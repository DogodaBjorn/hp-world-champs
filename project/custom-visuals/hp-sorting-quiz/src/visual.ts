/*
 * hpSortingQuiz — "The Sorting Quiz" matching game for the Dataviz World
 * Champs Round 2 entry (page V). Analytical intent (design handoff, verbatim
 * justification): an interactive matching game — connect a minifigure photo
 * to its character, with era + set revealed on a correct match, immediate
 * right/wrong feedback, a running score, and drawn connection lines. Game
 * state lives entirely inside this visual (disconnected QuizQuestions table).
 *
 * Accessibility is in scope, not polish: full keyboard operation (Tab to a
 * card, arrows within a column, Enter/Space to connect), visible focus ring,
 * ARIA labels, an aria-live region announcing every result, and a text
 * fallback line per match ("Match made: Hermione Granger — 2001 era,
 * correct"). High-contrast mode supported via forced-colors CSS.
 *
 * Data contract: 10 rows from the disconnected QuizQuestions table; match is
 * BY VALUE (two Harry Potter figures both accept the one Harry Potter card).
 * Maintenance owner: the entrant. Lifetime: contest entry (one-shot).
 */
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import DataViewTable = powerbi.DataViewTable;

import { VisualFormattingSettingsModel } from "./settings";

interface Question {
    qNo: number;
    figId: string;
    figImg: string;
    character: string;
    era: string;
    setName: string;
    setImg: string;
    matched: boolean;
    revealed: boolean;
}

const SVG_NS = "http://www.w3.org/2000/svg";

export class Visual implements IVisual {
    private events: IVisualEventService;
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private root: HTMLElement;
    private scoreEl: HTMLElement;
    private liveRegion: HTMLElement;
    private board: HTMLElement;
    private lineLayer: SVGSVGElement;

    private questions: Question[] = [];
    private characters: string[] = [];
    private dataKey = "";
    private selectedFig: number | null = null;
    private score = 0;

    constructor(options: VisualConstructorOptions) {
        this.events = options.host.eventService;
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;

        this.root = document.createElement("div");
        this.root.className = "hpq-root";
        this.root.setAttribute("role", "application");
        this.root.setAttribute("aria-label", "The Sorting Quiz: match each minifigure to its character");

        const header = document.createElement("div");
        header.className = "hpq-header";
        this.scoreEl = document.createElement("div");
        this.scoreEl.className = "hpq-score";
        this.scoreEl.setAttribute("role", "status");
        header.appendChild(this.scoreEl);

        const btnReveal = this.makeButton("Reveal", "Reveal all answers", () => this.revealAll());
        const btnReset = this.makeButton("Reset", "Reset the game", () => this.resetGame());
        header.appendChild(btnReveal);
        header.appendChild(btnReset);
        this.root.appendChild(header);

        this.board = document.createElement("div");
        this.board.className = "hpq-board";
        this.root.appendChild(this.board);

        this.lineLayer = document.createElementNS(SVG_NS, "svg");
        this.lineLayer.classList.add("hpq-lines");
        this.lineLayer.setAttribute("aria-hidden", "true");
        this.root.appendChild(this.lineLayer);

        this.liveRegion = document.createElement("div");
        this.liveRegion.className = "hpq-visually-hidden";
        this.liveRegion.setAttribute("aria-live", "polite");
        this.root.appendChild(this.liveRegion);

        this.target.appendChild(this.root);
    }

    public update(options: VisualUpdateOptions) {
        this.events.renderingStarted(options);
        try {
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
                VisualFormattingSettingsModel, options.dataViews?.[0]);
            this.applyColors();

            const table = options.dataViews?.[0]?.table;
            const key = this.keyOf(table);
            if (key !== this.dataKey) {
                this.dataKey = key;
                this.loadQuestions(table);
                this.buildBoard();
            } else {
                this.redrawLines();
            }
            this.events.renderingFinished(options);
        } catch (error) {
            this.events.renderingFailed(options, String(error));
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    // ------------------------------------------------------------ data ----

    private roleIndex(table: DataViewTable, role: string): number {
        return table.columns.findIndex(c => c.roles && c.roles[role]);
    }

    private keyOf(table: DataViewTable | undefined): string {
        if (!table || !table.rows) return "";
        const i = this.roleIndex(table, "figureId");
        return table.rows.map(r => String(i >= 0 ? r[i] : "")).join("|");
    }

    private loadQuestions(table: DataViewTable | undefined) {
        this.questions = [];
        this.selectedFig = null;
        this.score = 0;
        if (!table || !table.rows) return;
        const ix = {
            qNo: this.roleIndex(table, "questionNo"),
            figId: this.roleIndex(table, "figureId"),
            figImg: this.roleIndex(table, "figureImage"),
            character: this.roleIndex(table, "character"),
            era: this.roleIndex(table, "era"),
            setName: this.roleIndex(table, "setName"),
            setImg: this.roleIndex(table, "setImage"),
        };
        const cell = (r: powerbi.DataViewTableRow, i: number) => (i >= 0 ? String(r[i] ?? "") : "");
        for (const r of table.rows) {
            this.questions.push({
                qNo: Number(cell(r, ix.qNo)) || this.questions.length + 1,
                figId: cell(r, ix.figId),
                figImg: cell(r, ix.figImg),
                character: cell(r, ix.character),
                era: cell(r, ix.era),
                setName: cell(r, ix.setName),
                setImg: cell(r, ix.setImg),
                matched: false,
                revealed: false,
            });
        }
        this.questions.sort((a, b) => a.qNo - b.qNo);
        this.characters = this.shuffle([...new Set(this.questions.map(q => q.character))]);
    }

    private shuffle<T>(arr: T[]): T[] {
        const a = arr.slice();
        const rand = new Uint32Array(1);
        for (let i = a.length - 1; i > 0; i--) {
            window.crypto.getRandomValues(rand);
            const j = rand[0] % (i + 1);
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // ------------------------------------------------------------- dom ----

    private makeButton(label: string, aria: string, onClick: () => void): HTMLButtonElement {
        const b = document.createElement("button");
        b.className = "hpq-btn";
        b.textContent = label;
        b.setAttribute("aria-label", aria);
        b.addEventListener("click", onClick);
        return b;
    }

    private applyColors() {
        const c = this.formattingSettings.gameColors;
        const t = this.formattingSettings.gameText;
        this.root.style.setProperty("--hpq-correct", c.correctColor.value.value);
        this.root.style.setProperty("--hpq-wrong", c.wrongColor.value.value);
        this.root.style.setProperty("--hpq-text", c.textColor.value.value);
        this.root.style.setProperty("--hpq-card", c.cardColor.value.value);
        this.root.style.setProperty("--hpq-era1", c.eraOneColor.value.value);
        this.root.style.setProperty("--hpq-era2", c.eraTwoColor.value.value);
        this.root.style.setProperty("--hpq-fontsize", `${t.fontSize.value}px`);
    }

    private buildBoard() {
        this.board.replaceChildren();
        this.lineLayer.replaceChildren();
        this.updateScore();
        if (!this.questions.length) {
            const empty = document.createElement("p");
            empty.className = "hpq-empty";
            empty.textContent = "Bind the QuizQuestions table (question number, figure id, figure image, character, era, set name, set image) to start the game.";
            this.board.appendChild(empty);
            return;
        }

        const colFigs = this.column("hpq-col-figs", "Minifigures");
        const colChars = this.column("hpq-col-chars", "Characters");
        const colReveal = this.column("hpq-col-reveal", "Era and set — revealed on a match");

        this.questions.forEach((q, i) => {
            const card = document.createElement("div");
            card.className = "hpq-card hpq-fig";
            card.id = `hpq-fig-${i}`;
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Minifigure ${q.qNo} of ${this.questions.length}. Guess who — press Enter to select, then choose a character.`);
            const img = document.createElement("img");
            img.src = q.figImg;
            img.alt = "";
            img.draggable = false;
            card.appendChild(img);
            const cap = document.createElement("span");
            cap.className = "hpq-cap";
            cap.textContent = `#${q.qNo}`;
            card.appendChild(cap);
            card.addEventListener("click", () => this.pickFigure(i));
            card.addEventListener("keydown", (e) => this.keyNav(e, () => this.pickFigure(i)));
            colFigs.body.appendChild(card);

            const rev = document.createElement("div");
            rev.className = "hpq-card hpq-reveal";
            rev.id = `hpq-rev-${i}`;
            rev.setAttribute("aria-label", `Answer slot for minifigure ${q.qNo}, hidden until matched`);
            rev.textContent = "?";
            colReveal.body.appendChild(rev);
        });

        this.characters.forEach((ch) => {
            const card = document.createElement("div");
            card.className = "hpq-card hpq-char";
            card.dataset.character = ch;
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Character ${ch}. Press Enter to match with the selected minifigure.`);
            card.textContent = ch;
            card.addEventListener("click", () => this.pickCharacter(ch, card));
            card.addEventListener("keydown", (e) => this.keyNav(e, () => this.pickCharacter(ch, card)));
            colChars.body.appendChild(card);
        });

        this.board.appendChild(colFigs.wrap);
        this.board.appendChild(colChars.wrap);
        this.board.appendChild(colReveal.wrap);
    }

    private column(cls: string, heading: string): { wrap: HTMLElement; body: HTMLElement } {
        const wrap = document.createElement("div");
        wrap.className = `hpq-col ${cls}`;
        const h = document.createElement("h3");
        h.textContent = heading;
        wrap.appendChild(h);
        const body = document.createElement("div");
        body.className = "hpq-col-body";
        wrap.appendChild(body);
        return { wrap, body };
    }

    private keyNav(e: KeyboardEvent, activate: () => void) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activate();
        } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const cards = Array.from(
                (e.currentTarget as HTMLElement).parentElement.querySelectorAll<HTMLElement>(".hpq-card[tabindex]"));
            const at = cards.indexOf(e.currentTarget as HTMLElement);
            const next = cards[at + (e.key === "ArrowDown" ? 1 : -1)];
            if (next) next.focus();
        }
    }

    // ------------------------------------------------------------ game ----

    private pickFigure(i: number) {
        const q = this.questions[i];
        if (q.matched || q.revealed) return;
        this.selectedFig = this.selectedFig === i ? null : i;
        this.board.querySelectorAll(".hpq-fig").forEach((el, k) =>
            el.classList.toggle("hpq-selected", k === this.selectedFig));
        this.announce(this.selectedFig === null
            ? "Selection cleared."
            : `Minifigure ${q.qNo} selected. Now choose a character.`);
    }

    private pickCharacter(character: string, card: HTMLElement) {
        if (this.selectedFig === null) {
            this.announce("Select a minifigure first.");
            return;
        }
        const i = this.selectedFig;
        const q = this.questions[i];
        const fig = this.board.querySelector<HTMLElement>(`#hpq-fig-${i}`);
        if (q.character === character) {
            q.matched = true;
            this.score++;
            this.selectedFig = null;
            fig?.classList.remove("hpq-selected");
            fig?.classList.add("hpq-matched");
            fig?.setAttribute("aria-label", `Minifigure ${q.qNo}: ${q.character}, matched correctly.`);
            fig?.removeAttribute("tabindex");
            this.fillReveal(i);
            this.drawLine(fig, card, "locked");
            this.updateScore();
            this.announce(`Match made: ${q.character} — ${this.eraShort(q.era)}, correct. Score ${this.score} of ${this.questions.length}.`);
            if (this.allDone()) {
                this.announce(`Game over: ${this.score} of ${this.questions.length} matched. Well sorted!`);
            }
        } else {
            this.drawLine(fig, card, "wrong");
            fig?.classList.add("hpq-shake");
            card.classList.add("hpq-shake");
            setTimeout(() => {
                fig?.classList.remove("hpq-shake");
                card.classList.remove("hpq-shake");
            }, 700);
            this.announce(`Not ${character}. Try again.`);
        }
    }

    private fillReveal(i: number) {
        const q = this.questions[i];
        const rev = this.board.querySelector<HTMLElement>(`#hpq-rev-${i}`);
        if (!rev) return;
        rev.textContent = "";
        rev.classList.add("hpq-revealed");
        const chip = document.createElement("span");
        chip.className = "hpq-chip " + (this.isEraOne(q.era) ? "hpq-chip-era1" : "hpq-chip-era2");
        chip.textContent = this.eraShort(q.era);
        rev.appendChild(chip);
        const set = document.createElement("span");
        set.className = "hpq-set";
        set.textContent = q.setName;
        rev.appendChild(set);
        rev.setAttribute("aria-label", `Minifigure ${q.qNo}: ${q.character}, ${q.era}, from set ${q.setName}.`);
    }

    private isEraOne(era: string): boolean {
        return era.toLowerCase().indexOf("first") >= 0 || era.indexOf("2001") >= 0;
    }

    private eraShort(era: string): string {
        return this.isEraOne(era) ? "2001–2011" : "2018–now";
    }

    private allDone(): boolean {
        return this.questions.every(q => q.matched || q.revealed);
    }

    private revealAll() {
        this.questions.forEach((q, i) => {
            if (!q.matched && !q.revealed) {
                q.revealed = true;
                this.fillReveal(i);
                const fig = this.board.querySelector<HTMLElement>(`#hpq-fig-${i}`);
                fig?.classList.add("hpq-revealed-fig");
            }
        });
        this.updateScore();
        this.announce(`All answers revealed. Final score ${this.score} of ${this.questions.length}.`);
    }

    private resetGame() {
        this.questions.forEach(q => { q.matched = false; q.revealed = false; });
        this.characters = this.shuffle(this.characters);
        this.score = 0;
        this.selectedFig = null;
        this.buildBoard();
        this.announce("Game reset. Select a minifigure to begin.");
    }

    // ----------------------------------------------------------- lines ----

    private drawLine(from: HTMLElement | null, to: HTMLElement | null, kind: "locked" | "wrong") {
        if (!from || !to) return;
        const r = this.root.getBoundingClientRect();
        const a = from.getBoundingClientRect();
        const b = to.getBoundingClientRect();
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", String(a.right - r.left));
        line.setAttribute("y1", String(a.top + a.height / 2 - r.top));
        line.setAttribute("x2", String(b.left - r.left));
        line.setAttribute("y2", String(b.top + b.height / 2 - r.top));
        line.setAttribute("class", kind === "locked" ? "hpq-line-locked" : "hpq-line-wrong");
        if (kind === "locked") {
            line.dataset.fig = from.id;
            line.dataset.char = (to.dataset && to.dataset.character) || "";
        }
        this.lineLayer.appendChild(line);
        if (kind === "wrong") {
            setTimeout(() => line.remove(), 700);
        }
    }

    private redrawLines() {
        this.lineLayer.replaceChildren();
        this.questions.forEach((q, i) => {
            if (!q.matched) return;
            const fig = this.board.querySelector<HTMLElement>(`#hpq-fig-${i}`);
            const card = this.board.querySelector<HTMLElement>(`.hpq-char[data-character="${CSS.escape(q.character)}"]`);
            this.drawLine(fig, card, "locked");
        });
    }

    // ------------------------------------------------------------ misc ----

    private updateScore() {
        this.scoreEl.textContent = `Score: ${this.score} / ${this.questions.length || 10}`;
    }

    private announce(text: string) {
        this.liveRegion.textContent = text;
    }
}
