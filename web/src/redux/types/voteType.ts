import {ActionType} from "typesafe-actions";
import * as actions from "../actions/vote";

export type VoteActions = ActionType<typeof actions>;

export type VoteRequestType ={
  memNo: string 		 		 		 		// 회원번호(개설자)
  pmemNo: string 		 		 		 		// 회원번호(투표자)
  roomNo: string 		 		 		 	  // 방번호
  voteNo: string 		 		 		 	  // 투표번호
  itemNo: string 		 		 		 	  // 투표 항목 번호
  voteTitle: string 		 		 		// 투표제목
  voteItemName: string  // 투표 항목 제목
  voteItemNames: Array<string>  // 투표 항목 제목
  voteSlct: 's' | 'e' 		 		 	// 투표리스트 구분 [s:투표중, e:마감]
  voteAnonyYn: 'y' | 'n' 		 	  // 익명투표 여부 [y:익명, n:일반]
  voteDupliYn: 'y' | 'n' 		 	  // 중복투표 여부 [y:익명, n:일반]
  voteItemCnt: number 		 		 	// 투표항목수
  endTime: number 		 		 		 	// 마감설정시간 (초)
  endSlct: 'a'|'o'              //a:전체마감, o:단일마감
}
export type InsVoteRequestType = Pick<VoteRequestType, 'memNo' | 'roomNo' | 'voteTitle' | 'voteAnonyYn' | 'voteDupliYn' | 'voteItemCnt' | 'endTime' | 'voteItemNames'>
export type InsMemVoteRequestType = Pick<VoteRequestType, 'memNo' | 'pmemNo' | 'roomNo' | 'voteNo' | 'itemNo' | 'voteItemName'>
export type DelVoteRequestType = Pick<VoteRequestType, 'memNo' | 'roomNo' | 'voteNo'>
export type EndVoteRequestType = Pick<VoteRequestType, 'memNo' | 'roomNo' | 'voteNo' | 'endSlct'>
export type GetVoteListRequestType = Pick<VoteRequestType, 'memNo' | 'roomNo' | 'voteSlct'>
export type GetVoteSelRequestType = Pick<VoteRequestType, 'memNo' | 'roomNo' | 'voteNo'>
export type GetVoteDetailListRequestType = Pick<VoteRequestType, 'memNo' | 'pmemNo' | 'roomNo' | 'voteNo'>

export type VoteResultType = {
  voteNo: string 		 		 		 		  // 투표번호
  memNo: string 		 		 		 		    // 투표개설자 회원번호
  roomNo: string 		 		 		 		  // 투표개설 방번호
  voteTitle: string 		 		 		 		// 투표제목
  voteEndSlct: 's' | 'e' | 'd' 		// 투표종료구분[s:투표중, e:마감, d:투표삭제]
  voteAnonyYn: 'y' | 'n' 		 		 	// 익명투표 여부
  voteDupliYn: 'y' | 'n' 		 		 	// 중복투표 여부
  memVoteYn: 'y' | 'n' 		 		 	  // 투표 여부
  voteMemCnt : number 		 		 		 	// 투표참여회원수
  voteItemCnt: number 		 		 		 	// 투표항목수
  endTime: number 		 		 		 		  // 마감설정시간(초)
  startDate: DateType 		 		 		 		// 투표개설 일자
  endDate: DateType 		 		 		 		  // 투표종료 일자
  insDate: DateType 		 		 		 		  // 등록일자
  updDate: DateType 		 		 		 		  // 변경일자
  itemNo: string 		 		 		 		  // 투표항목번호
  voteItemName: string 		 		 		// 투표 항목 이름
}
// const [tabType, setTabType] = useState(tabMenu[0])
// const [makeVote, setMakeVote] = useState<boolean>(false);
// const [temp, setTemp] = useState("list");

export type ApiResultType = {
  result: string
  code: string
  messageKey: string
  message: string
  timestamp: string
  validationMessageDetail: Array<string>
  methodName:string
}

export type VoteStepType = 'list' | 'vote' | 'ins';
export type VoteStateType = ApiResultType & {
  tempInsVote: InsVoteRequestType
  voteList: VoteListResultType
  voteSel: VoteResultType
  voteDetailList: Array<VoteResultType>
  selVoteItem: VoteResultType
  step : VoteStepType
  active : boolean
}

export type DateType = {
  date : DateYMDType
  , time : DateHMSNType
}
export type DateYMDType = {
  year: number
  month: number
  day: number
}
export type DateHMSNType = {
  hour: number
  minute: number
  second: number
  nano: number
}


export type VoteListResultType = {
  cnt: number,
  list: Array<VoteResultType>
}

