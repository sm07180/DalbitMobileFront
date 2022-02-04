import { createAction } from "typesafe-actions";

export const SET_IS_LOADING = 'common/SET_IS_LOADING';
export const SET_IS_LOADING_SUCCESS = 'common/SET_IS_LOADING_SUCCESS';

export const setIsLoading = createAction(SET_IS_LOADING)();
export const setIsLoadingSuccess = createAction(SET_IS_LOADING_SUCCESS)<boolean|{isLoading:boolean,text:string}>();