export class SurveyDetailChoice {

  choices_id: number;
  survey_detail_id: number;
  quest_fldnum: number;
  quest_fldval: string;
  quest_fldscr: number;
  quest_fldwgt: number;
  qstval_rqcom: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
