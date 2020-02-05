/**
 * @title RESTFUL API
 * @document https://docs.google.com/spreadsheets/d/1WiGM6RP2g4qvlKzkMnHMkrc8683Zy8Ka/edit#gid=248254560
 * @notice API정의서_v2.xlsx 문서확인
 * @example 사용법
 *
import Api from 'context/api'
const [fetch, setFetch] = useState(null)

//fetch
async function fetchData(obj) {
  const res = await Api.rooms_now({...obj})
  setFetch(res)
  console.log(res)
}

useEffect(() => {
  fetchData()
}, [])
 */

import axios from 'axios'
import qs from 'qs'
//component
import {API_SERVER} from 'context/config'

export default class API {
  //---------------------------------------------------------------------방송관련
  /**
   * @brief 방송방 생성
   * @method "POST"
   * @todo
   * @param int roomType                //*방송종류
   * @param string title                //*제목
   * @param string bgImg                //*백그라운드 이미지 경로
   * @param int bgImgRacy               //백그라운드 구글 선정성
   * @param string welcomMsg            //*환영 메시지
   * @param string notice               //공지사항
   * @param int entryType               //*entry 타입 (0:전체,1:팬,20세이상)
   * @param int os                      //*OS 구분(1:Android,2:IOS,3:PC)
   * @param string deviceId             //디바이스 고유아이디
   * @param string deviceToken          //디바이스 토큰
   * @param string appVer               //앱 버전
   * @create 김호겸 2020.01.31
   */
  static broad_create = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/create`, method: method || 'POST', data: data})
  }

  /**
   * @brief 방송방 참여하기 (익명 로그인일때 프로시저 memLogin:0 추가)
   * @method "POST"
   * @todo
   * @param int roomNo                //*방송방번호
   * @create 김호겸 2020.01.31
   */
  static broad_join = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/join`, method: method || 'POST', data: data})
  }

  /**
   * @brief 방송방 정보수정
   * @method "POST"
   * @todo
   * @param string roomNo               //*방송방번호
   * @param int roomType                //*방송종류
   * @param string title                //*제목
   * @param string bgImg                //백그라운드 이미지 경로
   * @param string bgImgDel             //삭제할 백그라운드 이미지 경로
   * @param int bgImgRacy               //백그라운드 구글 선정성
   * @param string welcomMsg            //환영 메시지
   * @param string notice               //공지사항
   * @param int os                      //*OS 구분(1:Android,2:IOS,3:PC)
   * @param string deviceId             //디바이스 고유아이디
   * @param string deviceToken          //디바이스 토큰
   * @param string appVer               //앱 버전
   * @create 김호겸 2020.01.31
   */
  static broad_edit = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/edit`, method: method || 'POST', data: data})
  }
  /**
   * @brief 방송방 리스트 (익명 로그인일때 프로시저 memLogin:0 추가)
   * @method "GET"
   * @todo
   * @param int roomType                //*방주제
   * @param int page                    //*페이지번호
   * @param int records                 //*페이지당 리스트 개수
   * @create 김호겸 2020.01.31
   */
  static broad_list = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/list`, method: method || 'GET', data: data})
  }

  /**
   * @brief 방송방 참여자 리스트
   * @method "GET"
   * @todo
   * @param string roomNo               //*방송방번호
   * @param int page                    //페이지번호
   * @param int records                 //페이지당 리스트 개수
   * @create 김호겸 2020.01.31
   */
  static broad_listeners = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/listeners`, method: method || 'GET', data: data})
  }
  /**
   * @brief 방송방 좋아요 추가
   * @method "POST"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @create 김호겸 2020.01.31
   */
  static broad_likes = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/likes`, method: method || 'POST', data: data})
  }

  /**
   * @brief 게스트 지정하기
   * @method "POST"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param string memNo                  //*게스트 회원번호
   * @param string title                  //*본방제목으로
   * @create 김호겸 2020.01.31
   */
  static broad_guest = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/guest`, method: method || 'POST', data: data})
  }

  /**
   * @brief 게스트 취소하기
   * @method "DELETE"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param string memNo                  //*게스트 회원번호
   * @create 김호겸 2020.01.31
   */
  static broad_guest = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/guest`, method: method || 'DELETE', data: data})
  }

  /**
   * @brief 방송방 공지사항 조회
   * @method "GET"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @create 김호겸 2020.01.31
   */
  static broad_notice = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/notice`, method: method || 'GET', data: data})
  }

  /**
   * @brief 방송방 공지사항 입력/수정
   * @method "POST"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param string notice                 //*공지사항
   * @create 김호겸 2020.01.31
   */
  static broad_notice = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/notice`, method: method || 'POST', data: data})
  }
  /**
   * @brief 방송방 공지사항 삭제
   * @method "DELETE"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @create 김호겸 2020.01.31
   */
  static broad_notice = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/notice`, method: method || 'DELETE', data: data})
  }
  /**
   * @brief 방송방 사연등록
   * @method "POST"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param string contents                 //*사연등록
   * @create 김호겸 2020.01.31
   */
  static broad_stoty = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/stoty`, method: method || 'POST', data: data})
  }
  /**
   * @brief 방송방 사연 목록 조회
   * @method "GET"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param string contents                 //*사연등록
   * @create 김호겸 2020.01.31
   */
  static broad_stoty = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/stoty`, method: method || 'GET', data: data})
  }
  /**
   * @brief 방송방 사연 목록 삭제
   * @method "DELETE"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param int storyIdx                 //*사연 인덱스 번호
   * @create 김호겸 2020.01.31
   */
  static broad_stoty = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/stoty`, method: method || 'DELETE', data: data})
  }
  /**
   * @brief 방송방 공유링크 확인 (익명 로그인일때 프로시저 memLogin:0 추가)
   * @method "GET"
   * @todo
   * @param string link                //*링크코드
   * @create 김호겸 2020.01.31
   */
  static broad_link = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/link`, method: method || 'GET', data: data})
  }

  /**
   * @brief 방송방 강퇴하기
   * @method "POST"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param string blockNo                 //*강퇴회원번호
   * @create 김호겸 2020.01.31
   */
  static broad_kickout = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/link`, method: method || 'POST', data: data})
  }

  /**
   * @brief 방송방 정보조회 (익명 로그인일때 프로시저 memLogin:0 추가)
   * @method "GET"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @create 김호겸 2020.01.31
   */
  static broad_info = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/info`, method: method || 'GET', data: data})
  }
  //--------------------------------------------------------------------- 회원 관련
  /**
   * @brief 토큰조회
   * @method "GET"
   * @param int    os                 //*OS구분
   * @param string deviceid           //*디바이스 고유아이디
   * @param string deviceToken        //디바이스 토큰
   * @param string appVer             //앱 버전
   * @param string appAdId            //광고 아이디
   * @create 김호겸 2020.01.15
   */

  static getToken = async obj => {
    const {url, method, params, data} = obj || {}
    return await ajax({...obj, url: url || `/token`, method: method || 'GET', data: data})
  }

  /**
   * @brief 회원로그인
   * @method "POST"
   * @param string memType            //*회원구분
   * @param string memId              //*아이디,소셜아이디
   * @param string memPwd             //비밀번호
   * @param int    os                 //*OS구분
   * @param string deviceid           //디바이스 고유아이디
   * @param string deviceToken        //디바이스 토큰
   * @param string appVer             //앱 버전
   * @param string appAdId            //광고 아이디
   * @create 김호겸 2020.01.15
   */

  static member_login = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/member/login`, method: method || 'POST', data: data})
  }

  /**
   * @brief 회원가입
   * @method "POST"
   * @param string memType               //*회원구분
   * @param string memId                //*아이디,소셜아이디
   * @param string memPwd               //비밀번호
   * @param string gender            //*성별
   * @param string nickNm            //*닉네임
   * @param string birthYY           //*생년
   * @param string birthMM           //*생월
   * @param string birthDD           //*생일
   * @param string term1           //*약관동의1
   * @param string term2           //*약관동의2
   * @param string term3           //*약관동의3
   * @param string name              //*이름
   * @param string profImg           //프로필이미지 패스
   * @param int    profImgRacy          //프로필이미지 구글선정성
   * @param string email             //이메일
   * @param int    os                //*OS구분
   * @param string deviceid          //디바이스 고유아이디
   * @param string deviceToken     //디바이스 토큰
   * @param string appVer            //앱 버전
   * @create 김호겸 2020.01.15
   */
  static member_join = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/member/signup`, method: method || 'POST', data: data})
  }

  /**
   * @brief 닉네임 중복체크
   * @method "GET"
   * @param string nickNm            //*닉네임
   * @create 김호겸 2020.01.15
   */
  static nickName_check = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/member/nick`, method: method || 'GET', data: data})
  }

  /**
   * @brief 비밀번호 변경
   * @method "POST"
   * @param string memId           //*핸드폰 번호
   * @param string memPwd               //*비밀번호
   * @create 김호겸 2020.01.15
   */
  static password_modify = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/member/pwd`, method: method || 'POST', data: data})
  }

  /**
   * @brief 프로필 편집
   * @method "POST"
   * @param string gender            //*성별
   * @param string nickNm            //*닉네임
   * @param string name              //*이름
   * @param string birthYY           //*생년
   * @param string birthMM           //*생월
   * @param string birthDD           //*생일
   * @param string profImg           //프로필이미지 패스
   * @param string profImgDel        //삭제할 프로필이미지 패스
   * @param int    profImgRacy          //프로필이미지 구글선정성
   * @param string bgImg             //배경이미지 패스
   * @param string bgImgDel          //삭제 할 배경이미지 패스
   * @param int    bgImgRacy            //배경이미지 구글 선정성
   * @param string message           //메세지
   * @create 김호겸 2020.01.15
   */

  static profile_edit = async obj => {
    const {url, method, memember, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/profile`, method: method || 'POST', data: data})
  }

  /**
   * @brief 팬 등록
   * @method "POST"
   * @param string    memNo             //*스타회원번호
   * @create 김호겸 2020.01.15
   */
  static pan_register = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/pan`, method: method || 'POST', data: data})
  }

  /**
   * @brief 팬 해제
   * @method "DELETE"
   * @param string    memNo             //*스타회원번호
   * @create 김호겸 2020.01.15
   */
  static pan_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/pan`, method: method || 'DELETE', data: data})
  }

  /**
   * @brief 회원정보조회
   * @method "GET"
   * @param string    memNo             //*스타회원번호
   * @create 김호겸 2020.01.15
   */
  static member_info = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/profile}`, method: method || 'GET', params: params})
  }

  /**
   * @brief 회원 방송방 기본설정 조회하기
   * @method "GET"
   * @create 김호겸 2020.01.15
   */
  static member_broadcast_basic_request = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/broad`, method: method || 'GET', params: params})
  }

  /**
   * @brief 회원 방송방 기본설정 수정하기
   * @method "GET"
   * @param int roomType          //*방송종류
   * @param string title          //*제목
   * @param string bgImg          //백그라운드 이미지 경로
   * @param string bgImgDel       //삭제할 백그라운드 이미지
   * @param int bgImgRacy         //백그라운드 구글 선정성
   * @param string wecomMsg       //*환영 메세지
   * @param string notice         //공지사항
   * @param int entryType         //*입장 (0:전체, 1:팬 ,2:20세이상)
   * @create 김호겸 2020.01.15
   */
  static member_broadcast_basic_Edit = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/broad`, method: method || 'POST', data: data})
  }

  /**
   * @brief 회원 신고하기
   * @method "POST"
   * @param string    memNo             //*신고회원번호
   * @param int       reason             //*신고사유
   * @param string    cont               //*상세내용
   * @create 김호겸 2020.01.15
   */
  static member_declar = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/declar`, method: method || 'POST', data: data})
  }

  /**
   * @brief 회원 차단하기
   * @method "POST"
   * @param string    memNo             //*차단회원번호
   * @create 김호겸 2020.01.15
   */
  static member_block = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/block`, method: method || 'POST', data: data})
  }

  /**
   * @brief 회원 차단 해제하기
   * @method "DELETE"
   * @param string    memNo             //*차단회원번호
   * @create 김호겸 2020.01.15
   */
  static member_block_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/block`, method: method || 'DELETE', data: data})
  }

  /**
   * @brief 회원 알림설정 조회하기
   * @method "GET"
   * @create 김호겸 2020.01.31
   */
  static member_notify_request = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/notify`, method: method || 'GET', data: data})
  }

  /**
   * @brief 회원 알림설정 수정하기
   * @method "POST"
   * @param int isAll                 //*전체알림
   * @param int isFanReg              //*팬등록알림
   * @param int isBoard               //*팬보드알림
   * @param int isStarCast            //*스타방송알림
   * @param int isStarNoti            //*스타공지사항알림
   * @param int isEvtNoti             //*이벤트공지알림
   * @param int isSearch              //*검색전용
   * @create 김호겸 2020.01.31
   */
  static member_notify_edit = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/notify`, method: method || 'POST', data: data})
  }

  /**
   * @brief 회원 팬보드 팬보드 댓글 달기
   * @method "POST"
   * @param string memNo              //*팬보드 회원번호
   * @param int depth                 //* (1:댓글,2:대댓글)
   * @param int boardNo               //대댓글일 경우 부모 댓글번호
   * @param int content               //*내용
   * @create 김호겸 2020.01.31
   */
  static member_fanboard_add = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/profile/board`, method: method || 'POST', data: data})
  }
  /**
   * @brief 회원 팬보드 목록조회
   * @method "GET"
   * @param string memNo              //*팬보드 회원번호
   * @param int page                  //페이지번호
   * @param int records               //페이지당 리스트 수
   * @create 김호겸 2020.01.31
   */
  static member_fanboard_list = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/profile/board`, method: method || 'GET', data: data})
  }

  /**
   * @brief 회원 팬보드 삭제하기
   * @method "DELETE""
   * @param string memNo                  //*팬보드 회원번호
   * @param int boardIdx                  //*페이지번호
   * @create 김호겸 2020.01.31
   */
  static member_fanboard_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/profile/board`, method: method || 'DELETE', data: data})
  }
  /**
   * @brief 회원 팬보드 대댓글 조회하기
   * @method "GET"
   * @param string memNo              //*팬보드 회원번호
   * @param int boardNo                  //*댓글 그룹번호
   * @create 김호겸 2020.01.31
   */
  static member_fanboard_reply = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/profile/board/reply`, method: method || 'GET', data: data})
  }
  /**
   * @brief 회원 방송방 빠른말 가져오기 (없을 경우 기획에서 정의된 기본 데이터 노출되어야함)
   * @method "GET"
   * @create 김호겸 2020.01.31
   */
  static member_broadcast_shortcut = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/shortcut`, method: method || 'GET', data: data})
  }

  /**
   * @brief 회원 방송방 빠른말 저장하기
   * @method "POST"
   * @param string order_1                  //*첫번째 명령
   * @param string text_1                   //*첫번째 내용
   * @param string onOff_1                  //*첫번째 사용여부(on/off)
   * @param string order_2                  //*두번째 명령
   * @param string text_2                   //*두번째 내용
   * @param string onOff_2                  //*두번째 사용여부(on/off)
   * @param string order_3                  //*세번째 명령
   * @param string text_3                   //*세번째 내용
   * @param string onOff_3                  //*세번째 사용여부(on/off)
   * @create 김호겸 2020.01.31
   */
  static member_broadcast_shortcut = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/shortcut`, method: method || 'POST', data: data})
  }

  //-------------------------------------------------------------------- 포토 관련

  /**
   * @brief 이미지 업로드
   * @method "POST"
   * @param string file                      //file 객체
   * @param string dataUrl                   //data URL
   * @param string imageUrl                  //image URL
   * @create 김호겸 2020.01.31
   */
  static image_upload = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/upload`, method: method || 'POST', data: data})
  }
}
//---------------------------------------------------------------------
//ajax
export const ajax = async obj => {
  const {url, method, data, params} = obj
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMTU3NzY5MDY1NTk0NkB0cnVlIiwiaWF0IjoxNTgwNjkwOTM0LCJleHAiOjE1ODMxOTY1MzR9.-pU_2P_h4-GKx4t0QPwxriqpC4v02Csk_P59Ytwbt50'
  try {
    let res = await axios({
      method: method,
      headers: {
        authToken: token,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      url: API_SERVER + url,
      params: params,
      data: data
    })
    // table 모양 로그출력
    //console.table(res.data)
    // string 로그출력
    //console.log(JSON.stringify(res.data, null, 1))
    return res.data
  } catch (error) {
    errorMsg(error)
  }
}
//error
export const errorMsg = error => {
  // console.log('%c' + '## AJAX Error', 'width:100%;font-size:12px;padding:5px 10px;color:#fff;background:blue;')
  //console.log(error)
}
