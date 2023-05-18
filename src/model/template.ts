import {Survey} from "./survey";

export class Template {

  surveyList: Survey[];
  msg: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
