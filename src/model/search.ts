import {Location} from './location';
import {SearchResult} from './search-result';
import {SurveyDropdown} from './survey-dropdown';

export class Search {

  location: string;
  surveyId: string;
  dateFrom: string;
  dateTo: string;
  inspector: string;
  aType: string;
  product: string;
  manufacturer: string;
  venderNo: string;
  status: string;

  locationList: Location[];
  surveyDropDownList: SurveyDropdown[];
  searchResultList: SearchResult[];

  msg: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
