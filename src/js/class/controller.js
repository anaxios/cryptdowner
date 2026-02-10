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

    async encrypt() {
        this.model.message = this.view.getMessageFromField();
        if (!this.model.message) {return}

        this.model.password = this.view.getPasswordFromField();
        if (!this.model.password) {
            this.model.password = await this.randomPassword();
            this.view.setPasswordField(this.model.password);
        }
        this.view.setUrlHash(this.model.password);
        const id = await this.storeData(this.model.encrypt());
        this.view.setUrlState(id);
        this.view.copyUrlToClipboard(this.view.getUrlState());
        this.view.setMessageField("");
    }

    async decrypt() {
        this.model.password = this.view.getPasswordFromField();
        if (!this.model.password && this.view.getUrlHash()) {
            this.model.password = this.view.getUrlHash();
            this.view.setPasswordField(this.model.password);
        }
        const id = this.view
              .getUrlState()
              .searchParams.get("id");
        if (!id) {return}
        this.model.message = await this.fetchData(id);
        this.view.setMessageField(this.model.decrypt(this.model.message));
    }

    async fetchData(id) {
        try {
            const r = await fetch(`/api/retrieve/${id}`);
            const d = await r.json();
            //console.log(d);
            return d;
        } catch (e) {
            console.error('Error:', e);
        }
    }

    async storeData(data) {
        try {
            const r = await fetch(`/api/store`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!r.ok) {
                throw new Error(`HTTP error! status: ${r.status}`);
            }

            const result = await r.json();
            return result.id;
        } catch (e) {
            console.error('Error:', e);
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
            console.error('Error:', e);
            throw e;
        }
    }
}
