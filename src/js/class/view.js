export default class View {
  bindEncrypt(callback) {
    document
      .getElementById("encryptButton")
      .addEventListener("click", callback);
  }

  bindDecrypt(callback) {
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
  }

  getPasswordFromField() {
    return document.getElementById("password").value;
  }

  getMessageFromField() {
    return document.getElementById("input").value;
  }

  setMessageField(message) {
    document.getElementById("input").value = message;
  }

  setUrlState(message) {
    const url = new URL(document.location.href);

    url.searchParams.set("content", message);
    window.history.pushState({ id: "100" }, "Cryptdowner", url.toString());
  }

  getUrlState() {
    return new URL(document.location.href);
  }

  copyUrlToClipboard(url) {
    console.log(url.href);
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
