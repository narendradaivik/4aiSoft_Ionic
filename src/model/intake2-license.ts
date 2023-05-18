export class Intake2License {

  license_id: number;
  intake2_id: number;
  intake_id: number;
  intake_detail_id: number;
  license_no: string;
  license_typ: string;
  dte_lic_ef: number;
  dte_lic_exp: number;
  tim_lic_exp: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
