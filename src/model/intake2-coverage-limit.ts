export class Intake2CoverageLimit {
  
  coverage_limit_id: number;
  intake2_id: number;
  intake_id: number;
  intake_detail_id: number;
  req_coverage: string;
  req_limit: number;
  req_comment: string;
  req_lim_dte: number;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
