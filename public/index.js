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

  const test = await receiveMessage();
  console.log(test);
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

// createTextbox(rootEl, "editorTextbox");

// createBtn(rootEl, () => {
//   const fontsEl = $("#editorTextbox");
//   const fontsText = fontsEl.value;
//   console.log(fontsEl.value);

//   if (fontsText !== "") {
//     const fontsList = fontsText.split(",");
//     console.log(fontsList);

//     vscode.postMessage({
//       type: "new-font",
//       target: "Editor",
//       fonts: fontsList
//     });
//   }
// });


// createBtn(rootEl, () => {
//   vscode.postMessage({
//     type: "read-json"
//   });
// });


// function createBtn(parentEl, func = null) {
//   const btnEl = document.createElement("button");
//   if (func) {
//     btnEl.addEventListener("click", () => {
//       func();
//     });
//   }
//   btnEl.innerText = "BTN";
//   parentEl.appendChild(btnEl);
// }

// function createTextbox(parentEl, id) {
//   const textboxEl = document.createElement("input");
//   textboxEl.type = "text";
//   textboxEl.setAttribute("id", id);
//   parentEl.appendChild(textboxEl);
// }
