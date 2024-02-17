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
        <div class="bl_fontsetsList_item_outer">
          <div class="bl_fontsetsList_item js_fontsetsList_item">
            <div class="bl_fontsetsList_name">
              <p>${thisFontset.name}</p>
            </div>
            <div class="bl_fontsetsList_marker_outer">
              <div class="el_selected_marker hp_selected_${thisFontset.selected}"></div>
            </div>
          </div>
          <div class="bl_fontsetsList_item_delete js_fontsetsList_item_delete">
            <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
              <g>
                <polygon class="st0" points="511.998,70.682 441.315,0 256.002,185.313 70.685,0 0.002,70.692 185.316,256.006 0.002,441.318 
                  70.69,512 256.002,326.688 441.315,512 511.998,441.318 326.684,256.006"></polygon>
              </g>
            </svg>
          </div>
        </div>
      `);

      document.querySelectorAll(".js_fontsetsList_item_delete")[i].addEventListener("click", async () => {
        console.log("huihnklnlk");
        fontsetsList.splice(i, 1);

        vscode.postMessage({
          type: "write-json",
          data: fontsetsList
        });
        
        parentEl.innerHTML = "";
        await createFontsetListViewer(parentEl);
      });

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
