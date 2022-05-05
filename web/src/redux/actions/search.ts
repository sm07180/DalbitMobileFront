import { createAction } from "typesafe-actions";
import {ISearchStateType} from "../types/searchType";

export const SET_SEARCH_DATA = 'search/SET_SEARCH_DATA';
export const setSearchData = createAction(SET_SEARCH_DATA)<ISearchStateType>();