import {createAction} from "typesafe-actions";

const SET_SOCIAL_TAB = "social/SET_SOCIAL_TAB";

export const setSocialTab = createAction(SET_SOCIAL_TAB)<string>();