export class Progress {

  percentComplete: string;
  currentStep: string;
  minStep: string;
  maxStep: string;
  label: string;
  nextId: string;
  previousId: string;
  currentId: string;
  categoryName: string;
  goTo: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
