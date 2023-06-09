export class Mclmchng {

  mclmchng_id: number;
  intake_id: number;
  intake_detail_id: number;
  insd_claimno: string;
  ch_line: string;
  ch_pyear: number;
  ch_program: string;
  trans_date: number;
  record_type: string;
  trans_num: number;
  pay_code: string;
  pay_status: string;
  void_ind: string;
  amt_one: number;
  amt_two: number;
  amt_exp: number;
  amt_leg: number;
  amt_oth: number;
  amt_salv: number;
  amt_rec: number;
  trans_acct: string;
  draft_no: string;
  issue_date: number;
  payee_name: string;
  payee_nm2: string;
  payee_taxid: string;
  mail_addr1: string;
  mail_addr2: string;
  mail_city: string;
  mail_state: string;
  mail_zip: string;
  receipt_from: string;
  receipt_date: number;
  receipt_amt: number;
  trans_com1: string;
  trans_com2: string;
  tran_typ_grp: string;
  disable_grp: string;
  pay_to_grp: string;
  expense_grp: string;
  approvl_by: string;
  approvl_stat: string;
  approvl_date: number;
  approvl_tim: string;
  bill_no: string;
  bill_date: number;
  bill_org: string;
  bill_tot_amt: number;
  bill_red_amt: number;
  bill_dte_snt: number;
  bill_rd_rea: string;
  bank_acct: string;
  invoice_no: string;
  invoice_date: number;
  inv_rcv_dte: number;
  prnt_req_dte: number;
  tot_trans: number;
  payment_from: number;
  payment_thru: number;
  payment_f2: number;
  payment_t2: number;
  payment_f3: number;
  payment_t3: number;
  payment_f4: number;
  payment_t4: number;
  payment_f5: number;
  payment_t5: number;
  payment_f6: number;
  payment_t6: number;
  payment_f7: number;
  payment_t7: number;
  payment_f8: number;
  payment_t8: number;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}
