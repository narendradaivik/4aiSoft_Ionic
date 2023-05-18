import {Employee} from "./employee";
import {IntakeDetail} from "./intake-detail";

export class Intake {

  intake_id: number;
  company_cd: string;
  policy_yr: number;
  loss_ym: number;
  maj_line: string;
  program: string;
  claim_number: string;
  entry_by: string;
  entry_date: number;
  modify_by: string;
  modify_date: number;

  location_cd: string;

  employeeList: Employee[];
  intakeDetailList: IntakeDetail[];
  salutationList: string[];

  currentStep: string;
  msg: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
