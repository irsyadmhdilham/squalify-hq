import { ActionTypes, ActionUnion } from "../actions/profile.action";
import { profile } from "../../models/profile";

const initialState: profile = {
  pk: 0,
  name: '',
  designation: '',
  profile_image: '',
  agency: {
    pk: 0,
    agency_image: '',
    name: '',
    company: '',
    members: []
  },
};

export function profileReducer(state = initialState, action: ActionUnion) {
  switch (action.type) {
    case ActionTypes.fetchSucceed:
      return state = action.payload;
    case ActionTypes.agencyNameImage:
      return {
        ...state,
        agency: {
          ...state.agency,
          agency_image: action.payload.agencyImage,
          name: action.payload.agencyName
        }
      };
    default:
      return state;
  }
}