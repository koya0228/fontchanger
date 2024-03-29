"use strict";

import { workspace, WorkspaceConfiguration, QuickPickItem, window } from "vscode";
import { readJsonFile, writeJsonFile } from "./jsonFile";

type Target = "Editor" | "Terminal";
function getConfig(target: Target): WorkspaceConfiguration {
  if (target === "Editor") {
      return workspace.getConfiguration("editor");
  }
  return workspace.getConfiguration("terminal.integrated");
}


export async function addNewFontset(filepath: string): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const fontsetName = await window.showInputBox({ placeHolder: "Fontset Name" });
    console.log(fontsetName);
    if (fontsetName === undefined) {
      return resolve();
    }

    const editorFonts = await window.showInputBox({ placeHolder: "Editor Fonts" });
    if (editorFonts === undefined) {
      return resolve();
    }
    
    const terminalFonts = await window.showInputBox({ placeHolder: "Terminal Fonts" });
    if (terminalFonts === undefined) {
      return resolve();
    }

    console.log(fontsetName, editorFonts, terminalFonts);
    
    const fontsetsListStr = await readJsonFile(filepath);
    const fontsetsList = JSON.parse(fontsetsListStr);

    fontsetsList.push({
      name: fontsetName,
      fonts: {
        editor: editorFonts.split(","),
        terminal: terminalFonts.split(",")
      },
      selected: false
    });

    const jsonDataStr = JSON.stringify(fontsetsList);
    await writeJsonFile(filepath, jsonDataStr);
    resolve();
  });
}

export async function changeFontset(target: Target, fonts: string[]): Promise<void> {
  getConfig(target).update("fontFamily", fonts.join(", "), true);
}
