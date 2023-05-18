export class User {
  userId: string;
  lastName: string;
  firstName: string;
  jobTitle: string;
  email: string;
  phone: string;
  companyCode: string;
  divloc: string;
  period: string;
  restrictList: string[];
  msg: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
