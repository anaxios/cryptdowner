export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
    this.reset = this.reset.bind(this);

    this.view.bindSave(this.save);
    this.view.bindLoad(this.load);
    this.view.bindReset(this.reset);
  }

  reset() {
    this.model.message = null;
    this.view.setMessageField(this.model.message);
    this.model.password = null;
    this.view.setPasswordField(this.model.password);
    this.view.resetUrl();
  }

  async save() {
    this.model.message = this.view.getMessageFromField();
    if (!this.model.message) {
      return;
    }

    this.model.password = this.view.getPasswordFromField();
    if (!this.model.password) {
      this.model.password = await this.randomPassword();
      this.view.setPasswordField(this.model.password);
    }
    this.view.setUrlHash(this.model.password);
    const id = await this.storeData(this.encrypt());
    this.view.setUrlState(id);
    this.view.copyUrlToClipboard(this.view.getUrlState());
    this.view.setMessageField("");
  }

  async load() {
    this.model.password = this.view.getPasswordFromField();
    if (!this.model.password && this.view.getUrlHash()) {
      this.model.password = this.view.getUrlHash();
      this.view.setPasswordField(this.model.password);
    }
    const id = this.view.getUrlState().searchParams.get("id");
    if (!id) {
      return;
    }
    const encryptedMessage = await this.fetchData(id);
    this.model.message = this.decrypt(encryptedMessage);
    this.view.setMessageField(this.model.message);
  }

  encrypt() {
    return sjcl.encrypt(this.model.password, this.model.message);
  }

  decrypt(encryptedMessage) {
    return sjcl.decrypt(this.model.password, JSON.parse(encryptedMessage));
  }

  async fetchData(id) {
    try {
      const r = await fetch(`/api/retrieve/${id}`);
      const d = await r.json();
      //console.log(d);
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
