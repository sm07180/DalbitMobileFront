import { ActionType } from 'typesafe-actions';
import * as actions from '../actions/clip';

export type ClipActions = ActionType<typeof actions>;

export interface ClipState {
    subjectType: Array<SubjectType>,
    termType: Array<SearchType>,
    categoryType: Array<SearchType>,
};

export interface SubjectType {
    cd: string;
    cdNm: string;
    value: string;
    sortNo: number;
    isUse: number;
    icon: string;
};

export interface SearchType {
    index: number;
    name: string;
};
