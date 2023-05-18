export class SurveyDropdown {

  survey_id: number;
  survey_name: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
