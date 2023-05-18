export class Intake2Commt {

  intake2_id: number;
  intake_id: number;
  intake_detail_id: number;
  int_comment1: string;
  int_comment2: string;
  int_comment3: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
