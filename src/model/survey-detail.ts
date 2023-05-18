import { SurveyDetailChoice} from './survey-detail-choice';
import { SurveyImage } from './survey-image';

export class SurveyDetail {

  survey_detail_id: number;
  survey_id: number;
  survey_resp_detail_id: number;
  survey_resp_id: number;
  question_cat: string;
  quest_catnum: number;
  question_no: number;
  question: string;
  question_com: string;
  question_type: number;
  quest_score: number;
  quest_wght: number;
  quest_fldscr: number;
  quest_fldwgt: number;
  quest_status: string;
  quest_srtord: number;
  quest_req: string;
  quest_reqrd: string;
  qst_com_req: string;
  guidance1: string;
  guidance2: string;
  guidance3: string;
  imge_requr: string;
  quest_dpnd1: number;
  quest_dpnv1: string;
  quest_dpnd2: number;
  quest_dpnv2: string;
  quest_dpnd3: number;
  quest_dpnv3: string;
  quest_dpnd4: number;
  quest_dpnv4: string;
  quest_dpnd5: number;
  quest_dpnv5: string;
  quest_misc1: string;
  quest_misc2: string;
  quest_misc3: number;
  quest_misc4: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  quest_answer: string;
  quest_commnt: string;
  like_scr: string;
  cons_scr: string;
  rank_risk: string;

  surveyDetailChoiceList: SurveyDetailChoice[];
  surveyImageList: SurveyImage[];


  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
