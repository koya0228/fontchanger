"use script";


export function createBtn(parentEl, func = null) {
  const btn = document.createElement("button");
  if (!func) {
    btn.addEventListener("click", () => {
      func();
    });
  }
  btn.innerText = "BTN";
  parentEl.appendChild(btn);
}
