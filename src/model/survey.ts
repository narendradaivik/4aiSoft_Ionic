
import { SurveyDropdown } from "./survey-dropdown";
import {Location} from './location';
import {Progress} from './progress';
import {SurveyDetail} from "./survey-detail";

export class Survey {

  survey_id: number;
  survey_name: string;
  display_name: string;
  survey_comp: string;
  survey_code: number;
  survey_com: string;
  survey_status: string;
  riska_type: string;
  survey_brst: string;
  display_type: string;
  in_prog: string;
  version: number;
  period: string;
  frequency: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  survey_resp_id: number;
  location_cd: string;
  company_cd: string;
  inspct_date: number;
  inspct_seq: number;
  inspct_by: string;
  inspct_byttl: string;
  inspct_time: string;
  inspct_byid: string;
  inspct_ph1: string;
  inspct_eml: string;
  contact_co: string;
  contact_atco: string;
  contact_ttl: string;
  contact_ph1: string;
  contact_ph21: string;
  contact_fax: string;
  contact_eml: string;
  survey_stat: string;
  insd_claimno: string;
  srv_coor: string;
  product_num: string;
  vendor: string
  manufacturer: string;

  categoryList: number[];
  locationList: Location[];
  surveyDetailList: SurveyDetail[];
  surveyDropDownList: SurveyDropdown[];

  progress: Progress;

  print_url: string;

  action: string;

  msg: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
