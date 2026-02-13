export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.converter = new showdown.Converter();

    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
    this.reset = this.reset.bind(this);
    this.markdown = this.markdown.bind(this);

    this.view.bindSave(this.save);
    this.view.bindLoad(this.load);
    this.view.bindReset(this.reset);
    this.view.bindMarkdown(this.markdown);
  }

  reset() {
    this.model.set({});
    this.view.setMessageField("");
    this.view.setPasswordField("");
    this.view.resetUrl();
    this.view.viewMode("input");
  }

  async save() {
    const message = this.view.getMessageFromField();
    if (!message) {
      return;
    }

    let password = this.view.getPasswordFromField();
    if (!password) {
      password = await this.randomPassword();
      this.view.setPasswordField(password);
    }

    // If current password & message matches old password & message return.
    const model = this.model.get();
    const p = model?.password;
    const m = model?.message;
    if (
      JSON.stringify({ password: p, message: m }) ==
      JSON.stringify({ password, message })
    ) {
      return;
    }

    this.view.setUrlHash(password);
    const id = await this.storeData(this.encrypt(password, message));

    // Save state
    this.model.set({ ...model, id, password, message });

    this.view.setUrlState(id);
    this.view.copyUrlToClipboard(this.view.getUrlState());
    this.view.setMessageField(message);
    this.view.viewMode("md-view");
  }

  async load() {
    const model = this.model.get();

    let password;
    let message;
    let id = this.view.getUrlState().searchParams.get("id");
    if (!id) {
      this.view.viewMode("input");
      return;
    }
    if (model?.id === id) {
      message = model.message;
      this.view.setMessageField(message);
      password = model.password;
      this.view.setPasswordField(password);
    } else {
      password = this.view.getPasswordFromField();
      if (!password && this.view.getUrlHash()) {
        password = this.view.getUrlHash();
        this.view.setPasswordField(password);
        const encryptedMessage = await this.fetchData(id);
        message = this.decrypt(password, encryptedMessage);
      }

      this.view.setMessageField(message);
      //this.view.viewMode("md-view");
      // Save state
      this.model.set({ ...model, id, password, message });
    }
  }

  markdown() {
    const message = this.view.getMessageFromField();
    let md = this.converter.makeHtml(message);
    this.view.setMarkdownField(md);
  }

  encrypt(password, message) {
    return sjcl.encrypt(password, message);
  }

  decrypt(password, encryptedMessage) {
    return sjcl.decrypt(password, JSON.parse(encryptedMessage));
  }

  async fetchData(id) {
    try {
      const r = await fetch(`/api/retrieve/${id}`);
      const d = await r.json();
      return d;
    } catch (e) {
      console.error("Error:", e);
    }
  }

  async storeData(data) {
    try {
      const r = await fetch(`/api/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!r.ok) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      const result = await r.json();
      return result.id;
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  }

  async randomPassword() {
    try {
      const r = await fetch(`https://random.daedalist.net/api/random/5`);

      if (!r.ok) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      const p = await r.text();
      return p;
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  }
}
