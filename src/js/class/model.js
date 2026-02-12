export default class Model {
  constructor() {
    //    this.password = data.password;
    //    this.message = data.message;
    this.history = [];
  }

  set(model) {
    this.history.push(model);
  }

  get(revision = 1) {
    // Negates to index from the end of array.
    return this.history.at(-revision);
  }
}
