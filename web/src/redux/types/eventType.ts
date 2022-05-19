import { ActionType } from 'typesafe-actions';
import * as actions from '../actions/event';

export type EventActions = ActionType<typeof actions>;

export const teamStateDefault = {
  ground_no: 0,
  team_no: 0,
  team_name: '',
  team_medal_code: '',
  team_edge_code: '',
  team_bg_code: '',
  rank_pt: 0,
  send_dal_cnt: 0,
  rcv_byeol_cnt: 0,
  new_fan_cnt: 0,
  play_time: 0,
  bonus_play_time: 0,
  time_rank_bonus: 0,
  ins_date: '',
  upd_date: '',
  my_rank_no: '',

  isMyTeamExist: false,
}

export interface ITeamType {
  ground_no: number;       // 회차번호
  team_no: number;         // 팀번호
  team_name: string;       // 팀이름
  team_medal_code: string; // 팀 메달 코드(m000 형식)
  team_edge_code: string;  // 팀 테두리 코드(e000 형식)
  team_bg_code: string;    // 팀 배경 코드(b00 형식)
  rank_pt: number;         // 랭킹점수
  send_dal_cnt: number;    // 선물한달수
  rcv_byeol_cnt: number;   // 받은별수
  new_fan_cnt: number;     // 신규팬수
  play_time: number;       // 방송시간
  bonus_play_time: number; // 방송시간(가선점 시간 방송)
  time_rank_bonus: number; // 타임랭킹 가산점 (내 랭킹)
  ins_date: string;        // 등록일자
  upd_date: string;        // 수정일자
  my_rank_no?: string;     // 내 순위
  isMyTeamExist?: boolean; // 내 팀 존재 여부
}

export interface IRankingListType {
  list: Array<ITeamType>;
  cnt: number;
}

export interface IDallaGroundState {
  dallaGroundTabType: number;
  rankingListInfo: IRankingListType;
  myTeamInfo: ITeamType;
}