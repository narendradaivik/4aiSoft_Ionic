export class Intake2WorkClass {

  work_class_id: number;
  intake2_id: number;
  intake_id: number;
  intake_detail_id: number;
  wc_class_code: string;
  wc_class_desc: string;
  wc_payroll: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
