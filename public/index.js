"use script";


const $ = (selector) => document.querySelector(selector);

const rootEl = $("#root");


createBtn(rootEl, () => {
  console.log("test");
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
