import { createReducer } from "typesafe-actions";
import {IProfileTabState, ProfileActions} from "../../types/profileType";

const initialState: IProfileTabState = {
  tabList: ['방송공지','팬보드','클립'],
  tabName: '방송공지',
  isRefresh: true,
}

const profileTab = createReducer<IProfileTabState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_TAB_DATA": (state, {payload}) => {
    return {...payload}
  }
});

export default profileTab;