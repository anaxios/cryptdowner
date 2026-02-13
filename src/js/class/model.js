export default class Model {
  constructor() {
    //    this.password = data.password;
    //    this.message = data.message;
    this.history = [];
  }

  set(model) {
    this.history.push(model);
    //console.log(`set model:`);
    //console.log(this.history.at(-1));
  }

  get(revision = 1) {
    // Negates to index from the end of array.
    console.log(`get model:`);
    console.log(this.history.at(-revision));
    return this.history.at(-revision);
  }
}
