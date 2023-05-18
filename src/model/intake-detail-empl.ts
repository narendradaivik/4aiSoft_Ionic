export class IntakeDetailEmpl {

  empl_id: number;
  intake_id: number;
  intake_detail_id: number;
  cmt_emp_flg: string;
  date_hire: number;
  empl_dept: string;
  job_title: string;
  job_class: string;
  manager_name: string;
  nbr_employee: string;
  length_curr: string;
  employ_stat: string;
  date_emp_end: number;
  employee_id: string;
  avg_wkly_wge: number;
  meth_wg_dtrm: string;
  wage_rate: number;
  wage_period: string;
  wkly_hrs_cnt: number;
  dailyhrs_cnt: number;
  high_school: string;
  num_wks_wgs: string;
  emp_st_hired: string;
  emp_type: string;
  sch_pay_ind: string;
  emp_terms: number;
  msc_efld_01: string;
  msc_efld_02: string;
  msc_efld_03: string;
  msc_efld_04: string;
  msc_efld_05: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
