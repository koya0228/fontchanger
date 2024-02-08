"use script";


const vscode = acquireVsCodeApi();

const $ = (selector) => document.querySelector(selector);

const rootEl = $("#root");


createTextbox(rootEl, "editorTextbox");

createBtn(rootEl, () => {
  const fontsEl = $("#editorTextbox");
  const fontsText = fontsEl.value;
  console.log(fontsEl.value);

  const fontsList = fontsText.split(",");
  console.log(fontsList);

  vscode.postMessage({
    type: "new-font",
    target: "Editor",
    fonts: fontsList
  });
});


function createBtn(parentEl, func = null) {
  const btnEl = document.createElement("button");
  if (func) {
    btnEl.addEventListener("click", () => {
      func();
    });
  }
  btnEl.innerText = "BTN";
  parentEl.appendChild(btnEl);
}

function createTextbox(parentEl, id) {
  const textboxEl = document.createElement("input");
  textboxEl.type = "text";
  textboxEl.setAttribute("id", id);
  parentEl.appendChild(textboxEl);
}
