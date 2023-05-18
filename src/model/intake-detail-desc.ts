export class IntakeDetailDesc {

  intake_detail_id: number;
  intake_id: number;
  desc_text: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;
  
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
