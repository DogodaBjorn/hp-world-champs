/*
 * hpSortingQuiz formatting settings.
 * Every color surfaces here (formatting pane) and defaults to an hp-bricks
 * theme slot value — the render path reads ONLY these settings (repo rule:
 * no hardcoded hex in the render path).
 */
"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class GameColorsCard extends FormattingSettingsCard {
    correctColor = new formattingSettings.ColorPicker({
        name: "correctColor",
        displayName: "Correct match",
        value: { value: "#AA7F2E" }        // theme slot: Pearl Gold (categorical 1)
    });
    wrongColor = new formattingSettings.ColorPicker({
        name: "wrongColor",
        displayName: "Wrong match",
        value: { value: "#A95500" }        // theme slot: bad (Dark Orange)
    });
    textColor = new formattingSettings.ColorPicker({
        name: "textColor",
        displayName: "Text",
        value: { value: "#05131D" }        // theme slot: ink (Black brick)
    });
    cardColor = new formattingSettings.ColorPicker({
        name: "cardColor",
        displayName: "Cards",
        value: { value: "#FFFFFF" }        // theme slot: surface
    });
    eraOneColor = new formattingSettings.ColorPicker({
        name: "eraOneColor",
        displayName: "Era chip — first marriage",
        value: { value: "#AA7F2E" }        // theme slot: categorical 1
    });
    eraTwoColor = new formattingSettings.ColorPicker({
        name: "eraTwoColor",
        displayName: "Era chip — second marriage",
        value: { value: "#720E0F" }        // theme slot: accent (Dark Red)
    });

    name: string = "gameColors";
    displayName: string = "Game colors";
    slices: Array<FormattingSettingsSlice> = [
        this.correctColor, this.wrongColor, this.textColor,
        this.cardColor, this.eraOneColor, this.eraTwoColor
    ];
}

class GameTextCard extends FormattingSettingsCard {
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text size",
        value: 11
    });

    name: string = "gameText";
    displayName: string = "Game text";
    slices: Array<FormattingSettingsSlice> = [this.fontSize];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    gameColors = new GameColorsCard();
    gameText = new GameTextCard();

    cards = [this.gameColors, this.gameText];
}
