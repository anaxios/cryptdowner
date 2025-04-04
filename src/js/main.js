import Controller from "./class/controller.js";
import View from "./class/view.js";

const view = new View();
const controller = new Controller({ password: "pass", message: "hi" }, view);

document
  .getElementById("encryptButton")
  .addEventListener("click", controller.modifyUrlState);

document
  .getElementById("decryptButton")
  .addEventListener("click", controller.loadContentFromUrl);
// function run() {
//   modifyUrlState();
// }
// window.onload = () => {
//   //loadContentFromUrl()
// };
