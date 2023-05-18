import {IntakeDetailClaimant} from './intake-detail-claimant';
import {IntakeDetailEmpl} from './intake-detail-empl';
import {IntakeDetailAddInfo} from './intake-detail-addinfo';
import {IntakeDetailClmDet} from './intake-detail-clmdet';
import {IntakeDetailOtherDrv} from './intake-detail-otherdrv';
import {IntakeDetailDesc} from './intake-detail-desc';
import {Intake2} from './intake2';
import {Mclmchng} from './mclmchng';

export class IntakeDetail {

  intake_detail_id: number;
  intake_id: number;
  claim_number: string;
  claim_suffix: string;
  insd_claimno: string;
  compan_num: string;
  coverage: string;
  state_jurisd: string;
  state_accid: string;
  location_cd: string;
  unit_phone: string;
  status: string;
  date_of_loss: number;
  time_of_day: string;
  date_report: number;
  date_opened: number;
  time_opened: string;
  date_settled: number;
  mgr_notified: string;
  date_emplyr: number;
  area_mgr: string;
  area_phone: string;
  date_denial: number;
  rptd_by_name: string;
  rptd_by_pos: string;
  rptd_by_phon: string;
  date_to_car: number;
  date_updated: number;
  clm_coor: string;
  adjuster: string;
  date_assign: number;
  recvd_by: string;
  date_recvd: number;
  policy_no: string;
  eff_date: number;
  exp_date: number;
  carrier_num: string;
  carrier: string;
  clm_off_grp: string;
  review_by: string;
  date_review: number;
  date_diary: number;
  diary_com1: string;
  diary_com2: string;
  quest_clm: string;
  area_in_unit: string;
  type_info: string;
  body_info: string;
  cause_info: string;
  injury_info: string;
  severity_inf: string;
  rule_violat: string;
  equip_prblm: string;
  weap_typ_grp: string;
  product: string;
  product2: string;
  product3: string;
  offens1: string;
  offens2: string;
  lost_time: string;
  date_fst_off: number;
  date_last_w: number;
  on_prem: string;
  actv_grp: string;
  weath_grp: string;
  litigation: string;
  attorney: string;
  litigat_date: number;
  cmt_inj_flg: string;
  inj_pt_names: string;
  police_dept: string;
  police_invol: string;
  atty_rep_flg: string;
  prevent_flg: string;
  prvnt_measur: string;
  safety_rules: string;
  safety_shoes: string;
  safety_reg: string;
  safety_viol: string;
  med_attn: string;
  ppo_used: string;
  work_relate: string;
  our_drv_resp: string;
  loss_recov: string;
  unit_closed: string;
  lost_sales: string;
  lost_product: string;
  loss_caplize: string;
  thrd_pty_flt: string;
  inc_on_vtape: string;
  vtape_posess: string;
  claim_value: string;
  perpetrator: string;
  prod_pfs_ctr: string;
  hrs_between: number;
  clm_type: string;
  subrogation: string;
  subro_agnst: string;
  dine_take: string;
  exchange_rat: number;
  local_claim: number;
  local_expen: number;
  ddveh_clmno: string;
  est_damage: number;
  med_triag_no: string;
  msc_cfld_01: string;
  msc_cfld_02: string;
  msc_cfld_03: string;
  msc_cfld_04: string;
  msc_cfld_05: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  claimant: IntakeDetailClaimant;
  employee: IntakeDetailEmpl;
  addInfo: IntakeDetailAddInfo;
  clmDet: IntakeDetailClmDet;
  otherDrv: IntakeDetailOtherDrv;
  desc: IntakeDetailDesc;

  intake2List: Intake2[];

  mclmchngList: Mclmchng[];
  
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
