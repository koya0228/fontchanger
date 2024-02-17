"use script";


const vscode = acquireVsCodeApi();

const $ = (selector) => document.querySelector(selector);

const rootEl = $("#root");

createFontsetListViewer(rootEl);


function createFontsetListViewer(parentEl) {
  return new Promise(async (resolve, reject) => {
    parentEl.insertAdjacentHTML("beforeend", `
      <div class="bl_fontsetsList">
        <div class="bl_fontsetsList_list js_fontsetsList_list">
          <div class="bl_fontsetsList_add js_fontsetsList_add">
            <p>Add Fontset</p>
          </div>
        </div>
      </div>
    `);

    $(".js_fontsetsList_add").addEventListener("click", async () => {
      vscode.postMessage({
        type: "add-font"
      });
      const fontsetsListStr = await receiveMessage();
      const rootEl = $("#root");
      rootEl.innerHTML = "";
      await createFontsetListViewer(rootEl);
    });

    vscode.postMessage({ type: "read-json" });

    const fontsetsListStr = await receiveMessage();
    const fontsetsList = JSON.parse(fontsetsListStr);

    const fontsetsListEl = $(".js_fontsetsList_list");
    
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

      document.querySelectorAll(".js_fontsetsList_item")[i].addEventListener("click", async() => {
        await (function() {
          return new Promise(async (resolve, reject) => {
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
            
            parentEl.innerHTML = "";
            await createFontsetListViewer(parentEl);

            resolve();
          });
        })();
        console.log("ijguigiug");
      });
    });

    resolve();
  });
}


function receiveMessage() {
  return new Promise((resolve, reject) => {
    window.addEventListener("message", (e) => {
      if (e.data.type === "fontsets-data") {
        console.log(e.data.data);
        resolve(e.data.data);
      }
    });
  });
}
