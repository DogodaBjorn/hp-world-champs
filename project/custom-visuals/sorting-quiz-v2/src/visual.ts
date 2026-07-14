/*
 * The Sorting Ceremony — three-column matching quiz (Two Marriages v2).
 * Spec: design_handoff_powerbi/custom_visual_quiz.md + S5_sorting_quiz.md.
 * Chain interaction: click a minifig tile, then a character name, then an
 * era label. A correct chain locks in gold; a wrong pick flashes red for
 * 400 ms. Ten rounds bound from the QuizPool table, five per wave; score,
 * reveal and reset live inside the visual (PBIR buttons cannot drive a
 * custom visual's state — recorded build deviation).
 */
"use strict";

import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbi.DataView;

import "./../style/visual.less";

interface Round {
    key: string;
    img: string;
    name: string;
    era: string;
}

const WAVE = 5;
const GOLD = "#C9A227";
const RED = "#B33A2B";
const IDLE = "#B5AB95";

/** Deterministic LCG shuffle — stable per wave, no crypto needed. */
function shuffled<T>(items: T[], seed: number): T[] {
    const a = items.slice();
    let s = seed >>> 0;
    for (let i = a.length - 1; i > 0; i--) {
        s = (s * 1664525 + 1013904223) >>> 0;
        const j = s % (i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export class Visual implements IVisual {
    private root: HTMLElement;
    private panel: HTMLElement;
    private figCol: HTMLElement;
    private nameCol: HTMLElement;
    private eraCol: HTMLElement;
    private gutter: SVGSVGElement;
    private scoreValue: HTMLElement;
    private live: HTMLElement;

    private pool: Round[] = [];
    private wave = 0;
    private matched = new Set<string>();
    private revealed = new Set<string>();
    private selFig: string | null = null;
    private selName: string | null = null;
    private flashTimer: number | undefined;

    constructor(options: VisualConstructorOptions) {
        this.root = options.element;
        this.root.classList.add("sq2-root");
        this.root.replaceChildren();

        this.panel = el("div", "sq2-panel");
        const figWrap = el("div", "sq2-col sq2-col-figs");
        figWrap.appendChild(head("Minifigure"));
        this.figCol = el("div", "sq2-items sq2-figs");
        figWrap.appendChild(this.figCol);

        const nameWrap = el("div", "sq2-col sq2-col-names");
        nameWrap.appendChild(head("Character"));
        this.nameCol = el("div", "sq2-items sq2-names");
        nameWrap.appendChild(this.nameCol);

        const eraWrap = el("div", "sq2-col sq2-col-eras");
        eraWrap.appendChild(head("Era · Set"));
        this.eraCol = el("div", "sq2-items sq2-eras");
        eraWrap.appendChild(this.eraCol);

        this.gutter = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.gutter.classList.add("sq2-gutter");
        this.gutter.setAttribute("aria-hidden", "true");

        this.panel.append(figWrap, this.gutter, nameWrap, eraWrap);

        const side = el("div", "sq2-side");
        const score = el("div", "sq2-score");
        score.appendChild(el("div", "sq2-score-label", "SCORE"));
        this.scoreValue = el("div", "sq2-score-value", "0 / 10");
        score.appendChild(this.scoreValue);
        score.appendChild(el("div", "sq2-score-note", "576 minifigures in the archive"));

        const reveal = btn("sq2-btn sq2-btn-reveal", "Reveal answers", () => this.reveal());
        const reset = btn("sq2-btn sq2-btn-reset", "Reset", () => this.reset());
        side.append(score, reveal, reset);

        this.live = el("div", "sq2-live");
        this.live.setAttribute("aria-live", "polite");

        this.root.append(this.panel, side, this.live);
    }

    public update(options: VisualUpdateOptions): void {
        const rounds = parseRounds(options.dataViews && options.dataViews[0]);
        const changed = JSON.stringify(rounds.map(r => r.key)) !== JSON.stringify(this.pool.map(r => r.key));
        this.pool = rounds;
        if (changed) {
            this.resetState();
        }
        this.render();
    }

    private resetState(): void {
        this.wave = 0;
        this.matched.clear();
        this.revealed.clear();
        this.selFig = this.selName = null;
    }

    private reset(): void {
        this.resetState();
        this.render();
        this.announce("Quiz reset. Wave one of two.");
    }

    private reveal(): void {
        for (const r of this.waveRounds()) {
            if (!this.matched.has(r.key)) {
                this.revealed.add(r.key);
            }
        }
        this.announce("Answers revealed for this wave.");
        this.maybeAdvance();
        this.render();
    }

    private waveRounds(): Round[] {
        return this.pool.slice(this.wave * WAVE, this.wave * WAVE + WAVE);
    }

    private done(key: string): boolean {
        return this.matched.has(key) || this.revealed.has(key);
    }

    private maybeAdvance(): void {
        const all = this.waveRounds().every(r => this.done(r.key));
        if (all && (this.wave + 1) * WAVE < this.pool.length) {
            this.wave += 1;
            this.selFig = this.selName = null;
            this.announce("Wave complete. Next five minifigures.");
        }
    }

    private pickFig(key: string): void {
        if (this.done(key)) { return; }
        this.selFig = this.selFig === key ? null : key;
        this.selName = null;
        this.render();
    }

    private pickName(key: string): void {
        if (!this.selFig || this.done(key)) { return; }
        if (key === this.selFig) {
            this.selName = key;
            this.render();
        } else {
            this.wrong(this.selFig, key);
        }
    }

    private pickEra(key: string): void {
        if (!this.selFig || !this.selName || this.done(key)) { return; }
        if (key === this.selFig) {
            this.matched.add(key);
            const r = this.pool.find(x => x.key === key);
            this.selFig = this.selName = null;
            this.announce(`Correct: ${r ? r.name : "match"} locked. Score ${this.matched.size} of ${this.pool.length}.`);
            this.maybeAdvance();
            this.render();
        } else {
            this.wrong(this.selName, key);
        }
    }

    private wrong(fromKey: string, toKey: string): void {
        this.announce("Not a match.");
        this.render();
        this.drawLine(fromKey, toKey, "wrong");
        if (this.flashTimer) { window.clearTimeout(this.flashTimer); }
        this.flashTimer = window.setTimeout(() => {
            this.selFig = this.selName = null;
            this.render();
        }, 400);
    }

    private announce(text: string): void {
        this.live.textContent = text;
    }

    // ------------------------------------------------------------ render
    private render(): void {
        const rounds = this.waveRounds();
        const seed = 96 + this.wave * 17;
        const names = shuffled(rounds, seed);
        const eras = shuffled(rounds, seed + 5);

        this.scoreValue.textContent = `${this.matched.size} / ${this.pool.length || 10}`;

        this.figCol.replaceChildren();
        for (const r of rounds) {
            const tile = el("div", "sq2-tile");
            tile.dataset.key = r.key;
            tile.tabIndex = 0;
            tile.setAttribute("role", "button");
            tile.setAttribute("aria-label", `Minifigure ${this.done(r.key) ? "matched: " + r.name : "tile"}`);
            if (this.done(r.key)) { tile.classList.add("done"); }
            if (this.selFig === r.key) { tile.classList.add("sel"); }
            const img = document.createElement("img");
            img.src = r.img;
            img.alt = "";
            img.draggable = false;
            tile.appendChild(img);
            wireClick(tile, () => this.pickFig(r.key));
            this.figCol.appendChild(tile);
        }

        this.nameCol.replaceChildren();
        for (const r of names) {
            const row = el("div", "sq2-name", r.name + (this.done(r.key) ? " ✓" : ""));
            row.dataset.key = r.key;
            row.tabIndex = 0;
            row.setAttribute("role", "button");
            row.setAttribute("aria-label", `Character ${r.name}${this.done(r.key) ? ", matched" : ""}`);
            if (this.done(r.key)) { row.classList.add("done"); }
            if (this.selName === r.key) { row.classList.add("sel"); }
            wireClick(row, () => this.pickName(r.key));
            this.nameCol.appendChild(row);
        }

        this.eraCol.replaceChildren();
        for (const r of eras) {
            const row = el("div", "sq2-era", r.era + (this.done(r.key) ? " ✓" : ""));
            row.dataset.key = r.key;
            row.tabIndex = 0;
            row.setAttribute("role", "button");
            row.setAttribute("aria-label", `Era ${r.era}${this.done(r.key) ? ", matched" : ""}`);
            if (this.done(r.key)) { row.classList.add("done"); }
            wireClick(row, () => this.pickEra(r.key));
            this.eraCol.appendChild(row);
        }

        this.drawLines();
    }

    private drawLines(): void {
        this.gutter.replaceChildren();
        for (const r of this.waveRounds()) {
            if (this.done(r.key)) {
                this.drawLine(r.key, r.key, "locked");
            }
        }
        if (this.selFig && !this.selName) {
            this.drawLine(this.selFig, null, "idle");
        }
        if (this.selFig && this.selName) {
            this.drawLine(this.selFig, this.selName, "locked");
        }
    }

    private drawLine(figKey: string, nameKey: string | null, kind: "idle" | "locked" | "wrong"): void {
        const g = this.gutter.getBoundingClientRect();
        if (g.width === 0) { return; }
        const fig = this.figCol.querySelector(`[data-key="${figKey}"]`);
        const name = nameKey ? this.nameCol.querySelector(`[data-key="${nameKey}"]`) : null;
        if (!fig) { return; }
        const fr = fig.getBoundingClientRect();
        const y1 = fr.top + fr.height / 2 - g.top;
        const y2 = name ? (() => { const nr = name.getBoundingClientRect(); return nr.top + nr.height / 2 - g.top; })() : y1;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", "0");
        line.setAttribute("y1", String(y1));
        line.setAttribute("x2", String(g.width));
        line.setAttribute("y2", String(y2));
        if (kind === "idle") {
            line.setAttribute("stroke", IDLE);
            line.setAttribute("stroke-width", "1.5");
            line.setAttribute("stroke-dasharray", "3 5");
        } else if (kind === "wrong") {
            line.setAttribute("stroke", RED);
            line.setAttribute("stroke-width", "3");
            line.setAttribute("stroke-dasharray", "7 6");
        } else {
            line.setAttribute("stroke", GOLD);
            line.setAttribute("stroke-width", "3");
            line.classList.add("sq2-line-locked");
        }
        this.gutter.appendChild(line);
    }
}

function parseRounds(dv: DataView | undefined): Round[] {
    const table = dv && dv.table;
    if (!table || !table.rows || !table.columns) { return []; }
    const idx: Record<string, number> = {};
    table.columns.forEach((c, i) => {
        const roles = c.roles || {};
        for (const r of Object.keys(roles)) { idx[r] = i; }
    });
    if (idx.matchKey === undefined) { return []; }
    const out: Round[] = [];
    for (const row of table.rows) {
        out.push({
            key: String(row[idx.matchKey]),
            img: idx.figImage !== undefined ? String(row[idx.figImage]) : "",
            name: idx.characterName !== undefined ? String(row[idx.characterName]) : "",
            era: idx.eraLabel !== undefined ? String(row[idx.eraLabel]) : "",
        });
    }
    return out.slice(0, 10);
}

function el(tag: string, cls: string, text?: string): HTMLElement {
    const node = document.createElement(tag);
    node.className = cls;
    if (text !== undefined) { node.textContent = text; }
    return node;
}

function head(text: string): HTMLElement {
    return el("div", "sq2-colhead", text);
}

function btn(cls: string, label: string, onClick: () => void): HTMLElement {
    const b = document.createElement("button");
    b.className = cls;
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
}

function wireClick(node: HTMLElement, handler: () => void): void {
    node.addEventListener("click", handler);
    node.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handler();
        }
    });
}
