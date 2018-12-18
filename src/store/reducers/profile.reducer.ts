import { ActionTypes, ActionUnion } from "../actions/profile.action";
import { profile } from "../../interfaces/profile";

const initialState: profile = {
  pk: 0,
  group: 0,
  name: '',
  designation: '',
  profile_image: '',
  upline: '',
  group_upline: 0,
  agency: {
    pk: 0,
    agency_image: '',
    name: '',
    company: '',
  }
};

export function profileReducer(state = initialState, action: ActionUnion) {
  switch (action.type) {
    case ActionTypes.fetch:
      return state;
    case ActionTypes.fetchSucceed:
      return state = action.payload;
    default:
      return state;
  }
}