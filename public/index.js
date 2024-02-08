"use script";


const vscode = acquireVsCodeApi();

const $ = (selector) => document.querySelector(selector);

const rootEl = $("#root");


createBtn(rootEl, () => {
  vscode.postMessage({
    type: "new-font",
    target: "Editor",
    fonts: ["チョークS"]
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
