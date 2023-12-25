export class OptionList {
  options: HTMLLIElement[];

  constructor() {
    this.options = [];
  }

  set(element: HTMLLIElement) {
    return this.options.push(element);
  }
  has(element: HTMLLIElement | HTMLElement | EventTarget | null) {
    if (element === null || !(element instanceof HTMLLIElement)) return false;
    return this.options.includes(element);
  }
  indexOf(element: HTMLLIElement) {
    return this.options.indexOf(element);
  }
  size() {
    return this.options.length;
  }
  delete(element: HTMLLIElement) {
    this.options.splice(this.indexOf(element), 1);
    return this.options.length;
  }
  first() {
    if (this.options.length === 0) return;

    return this.options[0];
  }
  last() {
    if (this.options.length === 0) return;

    return this.options.at(-1);
  }
  next(element: HTMLLIElement) {
    if (!this.has(element)) return;

    const elementIndex = this.indexOf(element);
    if (elementIndex === -1) throw new Error("Element not found on option list.");

    if (elementIndex === this.size() - 1) return;

    return this.options.at(elementIndex + 1);
  }
  prev(element: HTMLLIElement) {
    if (!this.has(element)) return;

    const elementIndex = this.indexOf(element);
    if (elementIndex === -1) throw new Error("Element not found on option list.");

    if (elementIndex === 0) return;

    return this.options.at(elementIndex - 1);
  }
}
