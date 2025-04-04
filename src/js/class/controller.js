import "../lz-string.min.js";
import "../sjcl.js";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  modifyUrlState() {
    console.log("modifyUrlState");
    const url = new URL(document.location.href);
    const temp = LZString.compressToUTF16(
      JSON.stringify(
        sjcl.encrypt(
          document.getElementById("password").value,
          document.getElementById("input").value
        )
      )
    );
    url.searchParams.set("content", temp);
    window.history.pushState({ id: "100" }, "Cryptdowner", url.toString());
  }

  loadContentFromUrl() {
    console.log("loadContentFromUrl");
    document.getElementById("input").value = sjcl.decrypt(
      document.getElementById("password").value,
      JSON.parse(
        LZString.decompressFromUTF16(
          new URL(document.location.href).searchParams.get("content").toString()
        )
      )
    );
  }
}

//   modifyUrlState() {
//     const url = new URL(document.location.href);
//     const temp = LZString.compressToUTF16(
//       JSON.stringify(
//         sjcl.encrypt(
//           document.getElementById("password").value,
//           document.getElementById("input").value
//         )
//       )
//     );
//     url.searchParams.set("content", temp);
//     window.history.pushState({ id: "100" }, "Cryptdowner", url.toString());
//   }
