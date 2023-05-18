export class IntakeDetailClaimant {

  claimant_id: number;
  intake_id: number;
  intake_detail_id: number;
  salutation: string;
  claimant_fst: string;
  claimant_mi: string;
  claimant_lst: string;
  soc_security: string;
  cmt_address1: string;
  cmt_address2: string;
  cmt_address3: string;
  cmt_address4: string;
  cmt_city: string;
  cmt_state: string;
  cmt_zip: string;
  cmt_country: string;
  cmt_home_pho: string;
  cmt_bus_pho: string;
  cmt_bus_ext: string;
  cmt_cell_pho: string;
  cmt_cntry_nm: string;
  race: string;
  age: string;
  sex: string;
  marital_st: string;
  spouse_name: string;
  no_of_depend: number;
  depend_name: string;
  next_of_kin: string;
  relat_to_ins: string;
  cmt_drv_lic: string;
  cmt_dob: number;
  date_death: number;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
