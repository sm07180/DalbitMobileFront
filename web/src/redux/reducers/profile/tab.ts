import { createReducer } from "typesafe-actions";
import {IProfileTabState, ProfileActions} from "../../types/profileType";

const initialState: IProfileTabState = {
  tabList: ['피드','팬보드','클립'],
  tabName: '피드',
  isRefresh: true,
  isReset: true,
}

const profileTab = createReducer<IProfileTabState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_TAB_DATA": (state, {payload}) => {
    return {...payload}
  }
});

export default profileTab;