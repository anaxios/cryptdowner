export default class View {
  bindSave(callback) {
    document.addEventListener("DOMContentLoaded", () => {
      document
        .getElementById("encryptButton")
        .addEventListener("click", callback);
    });
  }

  bindLoad(callback) {
    document.addEventListener("DOMContentLoaded", () => {
      document
        .getElementById("decryptButton")
        .addEventListener("click", callback);
      document
        .getElementById("password")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            callback();
          }
        });
    });
    document.addEventListener("DOMContentLoaded", callback);
  }

  bindReset(callback) {
    //document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("resetButton").addEventListener("click", callback);
    //});
  }

  bindMarkdown(callback) {
    //document.getElementById("md-view").addEventListener("keyup", callback);
    const debounceCallback = this.debounce(callback, 100);
    document
      .getElementById("input")
      .addEventListener("input", debounceCallback);
    document.addEventListener("DOMContentLoaded", debounceCallback);
  }

  bindEdit(callback) {
    document.getElementById("editButton").addEventListener("click", callback);
  }
  debounce(fn, duration) {
    let id;
    return (...args) => {
      if (id) clearTimeout(id);
      id = setTimeout(() => fn(...args), duration);
    };
  }

  viewMode(element) {
    document.getElementById(element).classList.remove("hidden");
    [...document.getElementById("contentWrapper").children]
      .filter((child) => child.id !== element)
      .forEach((child) => {
        document.getElementById(child.id).classList.add("hidden");
      });
  }

  getPasswordFromField() {
    return document.getElementById("password").value;
  }

  setPasswordField(p) {
    document.getElementById("password").value = p;
  }

  getMessageFromField() {
    return document.getElementById("input").value;
  }

  setMessageField(message) {
    document.getElementById("input").value = message;
  }

  setMarkdownField(message) {
    document.getElementById("md-view").innerHTML = message;
  }

  getUrlHash() {
    return window.location.hash.slice(1);
  }

  setUrlHash(h) {
    window.location.hash = h;
  }

  setUrlState(message) {
    const url = new URL(document.location.href);

    url.searchParams.set("id", message);
    window.history.pushState({ id: "100" }, "Cryptdowner", url.toString());
  }

  resetUrl() {
    const url = this.getBaseUrl();
    window.history.pushState({ id: "100" }, "Cryptdowner", url.toString());
  }

  getBaseUrl() {
    return new URL(window.location.origin);
  }

  getUrlState() {
    return new URL(document.location.href);
  }

  copyUrlToClipboard(url) {
    //console.log(url.href);
    navigator.clipboard.writeText(url.href);
    this.copyShow();
  }

  copyShow() {
    const element = document.querySelector("#copiedPopup");
    element.classList.remove("hidden");
    setTimeout(() => {
      element.classList.add("hidden");
    }, 2500);
  }
}
