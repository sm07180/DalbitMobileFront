export type VoteRequestType ={
  memNo ?: string 		 		 		 		// 회원번호
  roomNo ?: string 		 		 		 	// 방번호
  voteNo ?: string 		 		 		 	// 투표번호
  voteTitle ?: string 		 		 		// 투표제목
  voteSlct ?: 's' | 'e' 		 		 	// 투표리스트 구분 [s:투표중, e:마감]
  voteAnonyYn ?: 'y' | 'n' 		 	// 익명투표 여부 [y:익명, n:일반]
  voteDupliYn ?: 'y' | 'n' 		 	// 중복투표 여부 [y:익명, n:일반]
  voteItemCnt ?: number 		 		 	// 투표항목수
  endTime ?: number 		 		 		 	// 마감설정시간 (초)
}

export type VoteResultType ={
  voteNo : string 		 		 		 		  // 투표번호
  memNo : string 		 		 		 		    // 투표개설자 회원번호
  roomNo : string 		 		 		 		  // 투표개설 방번호
  voteTitle : string 		 		 		 		// 투표제목
  voteEndSlct : 's' | 'e' | 'd' 		// 투표종료구분[s:투표중, e:마감, d:투표삭제]
  voteAnonyYn : 'y' | 'n' 		 		 	// 익명투표 여부
  voteDupliYn : 'y' | 'n' 		 		 	// 중복투표 여부
  voteMemCnt : number 		 		 		 	// 투표참여회원수
  voteItemCnt : number 		 		 		 	// 투표항목수
  endTime : number 		 		 		 		  // 마감설정시간(초)
  startDate : string 		 		 		 		// 투표개설 일자
  endDate : string 		 		 		 		  // 투표종료 일자
  insDate : string 		 		 		 		  // 등록일자
  updDate : string 		 		 		 		  // 변경일자
  itemNo : string 		 		 		 		  // 투표항목번호
  voteItemName : string 		 		 		// 투표 항목 이름
}
