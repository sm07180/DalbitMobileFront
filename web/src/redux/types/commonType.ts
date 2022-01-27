import { ActionType } from 'typesafe-actions';
import * as actions from '../actions/common';

export type CommonActions = ActionType<typeof actions>;

export interface CommonState {
  isLoading: boolean;
}

