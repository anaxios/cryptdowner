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
        return sjcl.encrypt(this.model.password,
                            this.model.message)
    }

    decrypt(encryptedMessage) {
        return sjcl.decrypt(this.password,
                            JSON.parse(encryptedMessage)
                           )
    }
}
