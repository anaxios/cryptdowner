export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.encrypt = this.encrypt.bind(this);
    this.decrypt = this.decrypt.bind(this);
    this.model.encrypt = this.model.encrypt.bind(this);

    this.view.bindEncrypt(this.encrypt);
    this.view.bindDecrypt(this.decrypt);
  }

  encrypt() {
    this.model.password = this.view.getPasswordFromField();
    this.model.message = this.view.getMessageFromField();
    this.view.setUrlState(this.model.encrypt());
    this.view.setMessageField("");
  }

  decrypt() {
    this.model.password = this.view.getPasswordFromField();
    this.model.message = this.view.getUrlState();
    this.view.setMessageField(this.model.decrypt(this.model.message));
  }
}
