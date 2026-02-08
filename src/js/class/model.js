import "../lz-string.min.js";
import "../sjcl.js";

export default class Model {
  constructor(data) {
    this.password = data.password;
    this.message = data.message;
  }

  set password(pass) {
    this._password = pass;
  }

  get password() {
    return this._password;
  }

  set message(message) {
    this._message = message;
  }

  get message() {
    return this._message;
  }

  encrypt() {
      if (this.model.password) {
          return LZString.compressToEncodedURIComponent(
              JSON.stringify(sjcl.encrypt(this.model.password,
                                          this.model.message)))
      } else {
          return LZString.compressToEncodedURIComponent(this.model.message)
      }
  }

  decrypt(encryptedMessage) {
      if (this.password) {
          return sjcl.decrypt(this.password,
                              JSON.parse(
                                  LZString.decompressFromEncodedURIComponent(
                                      encryptedMessage)
                              ))
      } else {
          return LZString.decompressFromEncodedURIComponent(
              encryptedMessage)
      }
  }
}
