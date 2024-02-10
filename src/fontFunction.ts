"use strict";

import { workspace, WorkspaceConfiguration, QuickPickItem, window } from "vscode";

type Target = "Editor" | "Terminal";
function getConfig(target: Target): WorkspaceConfiguration {
  if (target === "Editor") {
      return workspace.getConfiguration("editor");
  }
  return workspace.getConfiguration("terminal.integrated");
}


export async function changeFontset(target: Target, fonts: string[]): Promise<void> {
  getConfig(target).update("fontFamily", fonts.join(", "), true);
}
