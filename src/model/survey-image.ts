export class SurveyImage {

  survey_resp_img_id: number;
  survey_resp_detail_id: number;
  survey_resp_id: number;
  imge_requr: string;
  image_qstnum: number;
  image_path: string;
  image_name: string;
  image_desc: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;
  base64: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
