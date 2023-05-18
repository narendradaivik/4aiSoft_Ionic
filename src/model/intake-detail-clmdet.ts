export class IntakeDetailClmDet {

  intake_detail_id: number;
  intake_id: number;
  acc_loc_name: string;
  loss_locat1: string;
  loss_locat2: string;
  acc_loc_city: string;
  acc_loc_cnty: string;
  acc_loc_st: string;
  acc_loc_zip: string;
  prop_dmg: string;
  inj_desc1: string;
  inj_desc2: string;
  inj_emp_flg: string;
  inj_dmge1: string;
  inj_dmge2: string;
  veh_prop_ds1: string;
  doing1: string;
  doing2: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;
  
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
