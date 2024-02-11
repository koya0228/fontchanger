"use script";


const vscode = acquireVsCodeApi();

const $ = (selector) => document.querySelector(selector);

const rootEl = $("#root");

createFontsetListViewer(rootEl);


async function createFontsetListViewer(parentEl) {
  parentEl.insertAdjacentHTML("beforeend", `
    <div class="bl_fontsetsList">
      <div class="bl_fontsetsList_search">
        <input type="text" class="bl_fontsetsList_search_input js_fontsetsList_search_input">
      </div>
      <div class="bl_fontsetsList_list js_fontsetsList_list"></div>
    </div>
  `);

  vscode.postMessage({ type: "read-json" });

  const fontsetsListStr = await receiveMessage();

  const fontsetsListEl = $(".js_fontsetsList_list");
  const fontsetsList = JSON.parse(fontsetsListStr);
  
  fontsetsList.forEach((thisFontset, i) => {
    fontsetsListEl.insertAdjacentHTML("beforeend", `
      <div class="bl_fontsetsList_item js_fontsetsList_item">
        <div class="bl_fontsetsList_name">
          <p>${thisFontset.name}</p>
        </div>
        <div class="bl_fontsetsList_marker_outer">
          <div class="el_selected_marker hp_selected_${thisFontset.selected}"></div>
        </div>
      </div>
    `);

    document.querySelectorAll(".js_fontsetsList_item")[i].addEventListener("click", () => {
      thisFontset.selected = true;

      vscode.postMessage({
        type: "change-font",
        target: "Editor",
        fonts: thisFontset.fonts.editor
      });
      vscode.postMessage({
        type: "change-font",
        target: "Terminal",
        fonts: thisFontset.fonts.terminal
      });

      fontsetsList.forEach((otherFontsets, j) => {
        if (i !== j && otherFontsets.selected) {
          otherFontsets.selected = false;
        }
      });

      vscode.postMessage({
        type: "write-json",
        data: fontsetsList
      });
    });
  });
}


function receiveMessage() {
  return new Promise((resolve, reject) => {
    window.addEventListener("message", (e) => {
      if (e.data.type === "fontsets-data") {
        resolve(e.data.data);
      }
    });
  });
}
