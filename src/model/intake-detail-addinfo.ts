export class IntakeDetailAddInfo {

  intake_detail_id: number;
  intake_id: number;
  driver_last: string;
  driver_first: string;
  driver_mi: string;
  dr_soc_sec: string;
  drv_address1: string;
  drv_city: string;
  drv_state: string;
  drv_zip: string;
  drv_country: string;
  drv_home_pho: string;
  drv_bus_pho: string;
  driver_chg: string;
  chrge_com1: string;
  dr_number: string;
  dr_age: string;
  dr_sex: string;
  veh_id_num: string;
  veh_yr: number;
  veh_make: string;
  veh_model: string;
  license_no: string;
  license_st: string;
  veh_drv_able: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;
  
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
