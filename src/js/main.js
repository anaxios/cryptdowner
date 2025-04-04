import Controller from "./class/controller.js";
import View from "./class/view.js";
import Model from "./class/model.js";

const model = new Model({ password: "", message: "" });
const view = new View();
const controller = new Controller(model, view);

// controller.initEvents();

// function run() {
//   modifyUrlState();
// }
// window.onload = () => {
//   //loadContentFromUrl()
// };
