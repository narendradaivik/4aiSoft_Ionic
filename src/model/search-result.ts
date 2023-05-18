export class SearchResult {

  survey_resp_id = -1;
  survey_name: string;
  location_cd: string;
  riska_type: string;
  inspct_by: string;
  inspct_date: string;
  survey_stat: string;
  product_num: string;
  vendor: string;
  manufacturer: string;
  print_url: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
