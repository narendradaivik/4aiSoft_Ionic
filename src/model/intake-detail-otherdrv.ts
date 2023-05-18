export class IntakeDetailOtherDrv {

  intake_detail_id: number;
  intake_id: number;
  odr_last: string;
  odr_first: string;
  odr_soc_sec: string;
  odr_number: string;
  odr_address1: string;
  odr_city: string;
  odr_state: string;
  odr_zip: string;
  odr_country: string;
  odr_home_pho: string;
  odr_bus_pho: string;
  own_last: string;
  own_first: string;
  own_address1: string;
  own_city: string;
  own_state: string;
  own_zip: string;
  own_country: string;
  own_home_pho: string;
  own_bus_pho: string;
  odr_chrg: string;
  odr_chg_com1: string;
  odr_drv_lic: string;
  odr_inj_flg: string;
  odr_fat_flg: string;
  odr_cit_flg: string;
  ovr_year: number;
  ovr_make: string;
  ovr_model: string;
  ovr_lic_st: string;
  ovr_insur1: string;
  ovr_policy: string;
  ovr_ins_con: string;
  ovr_ins_pho: string;
  ovr_damages1: string;
  ovr_locat1: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;
  
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
