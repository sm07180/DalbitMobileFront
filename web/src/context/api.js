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
//context
import {Global} from 'App'
import {API_SERVER, PHOTO_SERVER, PAY_SERVER} from 'context/config'

// export const authToken = () => {
//   const context = useContext(Context)
//   return context.authToken
// }
export default class API {
  //---------------------------------------------------------------------방송관련
  /**
   * @brief 방송방 생성
   * @method "POST"
   * @todo
   * @param string roomType                //*방송종류
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
    const {data} = obj || {}
    return await ajax({url: `/broad/join`, method: 'POST', data: data})
  }
  /**
   * @brief 방송방 나가기
   * @method "DELETE"
   * @todo
   * @param int roomNo                //*방송방번호
   * @create 손완휘 2020.02.06
   */
  static broad_exit = async obj => {
    const {data} = obj || {}
    return await ajax({url: `/broad/exit`, method: 'DELETE', data: data})
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

  static main_init_data = async () => {
    return await ajax({url: '/main', method: 'GET'})
  }

  /**
   * @brief 방송방 리스트 (익명 로그인일때 프로시저 memLogin:0 추가)
   * @method "GET"
   * @todo
   * @param int roomType                //방주제
   * @param int page                    //페이지번호
   * @param int records                 //페이지당 리스트 개수
   * @param string searchType           //-1,0 or null:전체,1:추천,2:인기,3:신입
   * @create 김호겸 2020.01.31
   * @update 김호겸 2020.03.18
   */
  static broad_list = async obj => {
    if (obj) {
      const {params} = obj
      return await ajax({params, url: `/broad/list`, method: 'GET'})
    }
    return await ajax({url: `/broad/list`, method: 'GET'})
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
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/broad/listeners`, method: method || 'GET', params: params || {}})
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
    return await ajax({...obj, url: url || `/broad/notice`, method: method || 'GET', params: params})
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
   * @modify 황상한 2020.03.12
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
   * @modify 최우정 2020.02.27 / stoty => story 변경
   */
  static broad_story = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/story`, method: method || 'POST', data: data})
  }
  /**
   * @brief 방송방 사연 목록 조회
   * @method "GET"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param string contents                 //*사연등록
   * @create 김호겸 2020.01.31
   * @modify 최우정 2020.02.27 / data => params 변경, stoty => story 변경
   */
  static broad_story = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/broad/story`, method: method || 'GET', params: params})
  }
  /**
   * @brief 방송방 사연 목록 삭제
   * @method "DELETE"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param int storyIdx                 //*사연 인덱스 번호
   * @create 김호겸 2020.01.31
   * @modify 최우정 2020.02.27 / stoty => story 변경
   */
  static broad_story = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/story`, method: method || 'DELETE', data: data})
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
    return await ajax({...obj, url: url || `/broad/kickout`, method: method || 'POST', data: data})
  }

  /**
   * @brief 방송방 정보조회 (익명 로그인일때 프로시저 memLogin:0 추가)
   * @method "GET"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @create 김호겸 2020.01.31
   * @update 이은비 2020.02.20            //data -> params로 변경
   */
  static broad_info = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/broad/info`, method: method || 'GET', params: params})
  }
  /**
   * @brief 방송방 매니저지정
   * @method "POST"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param string memNo                 //*매니저지정회원번호
   * @create 김호겸 2020.03.05
   */
  static broad_manager = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/manager`, method: method || 'POST', data: data})
  }
  /**
   * @brief 방송방 매니저지정취소
   * @method "DELETE"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param string memNo                 //*매니저지정회원번호
   * @create 김호겸 2020.03.05
   */
  static broad_manager = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/manager`, method: method || 'DELETE', data: data})
  }
  /**
   * @brief 방송방 상태변경
   * @method "POST"
   * @todo
   * @param string roomNo                 //*방송방번호
   * @param boolean isMic                 //*마이크 on/off(on :True,off: False)
   * @param boolean isCall                 //*통화중여부(통화중 : True , 미통화중 : False)
   * @create 김호겸 2020.03.06
   */
  static broad_state = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/state`, method: method || 'POST', data: data})
  }
  /**
   * @brief 방송방 팬 등록(BJ팬 등록 경우 채팅방 알림)
   * @method "POST"
   * @todo
   * @param string memNo                 //*스타회원번호
   * @param string roomNo                 //*방송방 번호
   * @create 김호겸 2020.03.09
   */
  static broad_fan_insert = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/fan`, method: method || 'POST', data: data})
  }

  /**
   * @brief 방송방 팬 해제
   * @method "DELETE""
   * @todo
   * @param string memNo                 //*스타회원번호
   * @param string roomNo                 //*방송방 번호
   * @create 김호겸 2020.03.12
   */
  static broad_fan_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/fan`, method: method || 'DELETE', data: data})
  }
  /**
   * @brief 진행중인 방송방 확인
   * @method "GET""
   * @todo
   * @param string roomNo                 //*방번호
   * @create 손완휘 2020.03.16
   */
  static broad_check = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/broad/check`, method: method || 'GET', params: params})
  }
  /**
   * @brief 방송방 공유랑크 조회
   * @method "GET""
   * @todo
   * @param string roomNo                 //*방번호
   * @create 김호겸 2020.04.03
   */
  static broad_share = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/broad/share`, method: method || 'GET', params: params})
  }
  //--------------------------------------------------------------------- 회원 관련

  /**
   * @brief 마이페이지 방송설정 금지어 단어 저장
   * @method "POST"
   * @param string banWord              //금지어 ( | 구분자)
   * @create 이은비 2020.04.02
   */
  static mypage_banword_write = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/banword`, method: method || 'POST', data: data})
  }

  /**
   * @brief 마이페이지 방송설정 금지어 단어 조회
   * @method "GET"
   * @create 이은비 2020.04.02
   */
  static mypage_banword_list = async obj => {
    const {url, method} = obj || {}
    return await ajax({...obj, url: url || `/mypage/banword`, method: method || 'GET'})
  }

  /**
   * @brief 마이페이지 방송설정 금지어 단어 등록, 수정
   * @method "GET"
   * @param string banWord              //금지어 ( | 구분자), 파람 없이 보내면 조회만 함
   * @create 이은비 2020.04.02
   */
  static mypage_banword = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/mypage/banword`, method: method || 'GET', params: params})
  }

  /**
   * @brief 마이페이지 방송설정 유저 검색
   * @method "GET"
   * @param int userType               //필수 유저검색타입(0: 전체, 1:닉네임, 2:아이디)
   * @param string search              //필수 검색단어
   * @param int page                   //페이지번호
   * @param int records                //페이지당 리스트 수
   * @create 이은비 2020.04.06
   */
  static mypage_user_search = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/mypage/search`, method: method || 'GET', params: params})
  }

  /**
   * @brief 마이페이지 방송설정 고정매니저 조회
   * @method "GET"
   * @create 이은비 2020.04.06
   */
  static mypage_manager_list = async obj => {
    const {url, method} = obj || {}
    return await ajax({...obj, url: url || `/mypage/manager`, method: method || 'GET'})
  }

  /**
   * @brief 마이페이지 방송설정 고정매니저 등록
   * @method "POST"
   * @param string memNo               //필수 매니저될 회원 번호
   * @param string role              //권한설정
   * @create 이은비 2020.04.06
   */
  static mypage_manager_add = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/manager/add`, method: method || 'POST', data: data})
  }

  /**
   * @brief 마이페이지 방송설정 고정매니저 권한 수정
   * @method "POST"
   * @param string memNo               //필수 매니저될 회원 번호
   * @param string role                //필수 권한설정
   * @create 이은비 2020.04.06
   */
  static mypage_manager_edit = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/manager/edit`, method: method || 'POST', data: data})
  }

  /**
   * @brief 마이페이지 방송설정 고정매니저 해제
   * @method "DELETE""
   * @param string memNo               //필수 해제할 매니저 회원 번호
   * @create 이은비 2020.04.06
   */
  static mypage_manager_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/manager`, method: method || 'DELETE', data: data})
  }

  //블랙리스트
  /**
   * @brief 마이페이지 방송설정 블랙리스트 조회
   * @method "GET"
   * @create 이은비 2020.04.07
   */
  static mypage_black_list = async obj => {
    const {url, method} = obj || {}
    return await ajax({...obj, url: url || `/mypage/black`, method: method || 'GET'})
  }

  /**
   * @brief 마이페이지 방송설정 블랙리스트 등록
   * @method "POST"
   * @param string memNo               //필수 매니저될 회원 번호
   * @create 이은비 2020.04.07
   */
  static mypage_black_add = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/black/add`, method: method || 'POST', data: data})
  }

  /**
   * @brief 마이페이지 방송설정 블랙리스트 해제
   * @method "DELETE""
   * @param string memNo               //필수 해제할 매니저 회원 번호
   * @create 이은비 2020.04.07
   */
  static mypage_black_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/black`, method: method || 'DELETE', data: data})
  }

  //블랙리스트

  /**
   * @brief 마이페이지 리포트 방송내역 조회
   * @method "GET""
   * @param              /
   * @create 황상한 2020.03.30
   */
  static report_broad = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/mypage/report/broad`, method: method || 'GET', params: params})
  }
  /**
   * @brief 마이페이지 리포트 청취내역 조회
   * @method "GET""
   * @todo
   * @param              /
   * @create 황상한 2020.03.30
   */
  static report_listen = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/mypage/report/listen`, method: method || 'GET', params: params})
  }
  /**
   * @brief 마이페이지 팬보드 목록 조회
   * @method "GET""
   * @todo
   * @param              /
   * @create 황상한 2020.03.31
   */
  static mypage_fanboard_list = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/profile/board`, method: method || 'GET', params: params})
  }
  /**
   * @brief 마이페이지 팬보드 댓글 등록
   * @method "POST""
   * @todo
   * @param              /
   * @create 황상한 2020.03.31
   */
  static mypage_fanboard_upload = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/profile/board`, method: method || 'POST', data: data})
  }
  /**
   * @brief 마이페이지 팬보드 댓글 삭제
   * @method "DELETE"""
   * @todo
   * @param              /
   * @create 황상한 2020.03.31
   */
  static mypage_fanboard_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/profile/board`, method: method || 'DELETE', data: data})
  }
  /**
   * @brief 회원 팬보드 대댓글 조회하기
   * @method "GET"
   * @param string memNo              //*팬보드 회원번호
   * @param int boardNo                  //*댓글 그룹번호
   * @create 황상한 2020.04.01
   */
  static member_fanboard_reply = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/profile/board/reply`, method: method || 'GET', params: params})
  }
  /**
   * @brief 마이페이지 공지사항 등록
   * @method "POST""
   * @todo
   * @param              /
   * @create 황상한 2020.04.06
   */
  static mypage_notice_upload = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/notice/add`, method: method || 'POST', data: data})
  }
  /**
   * @brief 마이페이지 공지사항 수정
   * @method "POST""
   * @todo
   * @param              /
   * @create 황상한 2020.04.06
   */
  static mypage_notice_edit = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/notice/edit`, method: method || 'POST', data: data})
  }
  /**
   * @brief 마이페이지 공지사항 삭제
   * @method "DELETE""
   * @todo
   * @param              /
   * @create 황상한 2020.04.06
   */
  static mypage_notice_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/notice`, method: method || 'DELETE', data: data})
  }
  /**
   * @brief 회원 달 선물하기 -> 마이페이지
   * @method "POST"
   * @param string memNo              //*선물받는 회원번호
   * @param int    dal               //*선물할 달 수
   * @create 황상한 2020.04.07
   */
  static mypage_gift_dal = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/gift`, method: method || 'POST', data: data})
  }

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

  static getToken = async () => {
    return await ajax({url: `/token`, method: 'GET'})
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
    const {data} = obj
    return await ajax({url: `/member/login`, method: 'POST', data})
  }

  /**
   * @brief 회원 로그아웃
   * @method "POST"
   * @param string authToken            //*발행된토큰
   * @param Jsonstring custom-header    //*디바이스토큰
   * @create 김호겸 2020.01.15
   */

  static member_logout = async () => {
    return await ajax({url: `/member/logout`, method: 'POST'})
  }

  /**
   * @brief 회원가입
   * @method "POST"
   * @param string memType               //*회원구분
   * @param string memId                //*아이디,소셜아이디
   * @param string memPwd               //비밀번호
   * @param string gender            //*성별
   * @param string nickNm            //*닉네임
   * @param string birth           //*생년월일
   * @param string term1           //*약관동의1
   * @param string term2           //*약관동의2
   * @param string term3           //*약관동의3
   * @param string name              //*이름
   * @param string profImg           //프로필이미지 패스
   * @param int    profImgRacy          //프로필이미지 구글선정성
   * @param string email             //이메일
   * @param int    os                //*OS구분
   * @param string deviceid          //*디바이스 고유아이디
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
   * @update 이은비 2020.02.17 // data -> params로 변경
   */
  static nickName_check = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/member/nick`, method: method || 'GET', params: params})
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
   * @param string gender(required)            //*성별
   * @param string nickNm(required)            //*닉네임
   * @param string name              //*이름
   * @param string birth(required)   //*생일
   * @param string birthYY           //*생년
   * @param string birthMM           //*생월
   * @param string birthDD           //*생일
   * @param string profImg           //프로필이미지 패스
   * @param string profImgDel        //삭제할 프로필이미지 패스
   * @param int    profImgRacy          //프로필이미지 구글선정성
   * @param string bgImg             //배경이미지 패스
   * @param string bgImgDel          //삭제 할 배경이미지 패스
   * @param int    bgImgRacy            //배경이미지 구글 선정성
   * @param string profMsg           //메세지
   * @create 김호겸 2020.01.15
   */

  static profile_edit = async obj => {
    const {url, method, memember, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/profile`, method: method || 'POST', data: data})
  }

  /**
   * @brief 팬 등록,해제
   * @method "POST","DELETE"
   * @param string    memNo             //*스타회원번호
   * @create 김호겸 2020.01.15
   * @update 김호겸 2020.03.17
   */
  static fan_change = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/fan`, method: method || 'POST', data: data})
  }

  /**
   * @brief 회원정보조회 member_info -> mypage
   * @method "GET"
   * @create 김호겸 2020.01.15
   * @update 손완휘 2020.02.19
   */
  static mypage = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/mypage`, method: method || 'GET', params: params})
  }

  /**
   * @brie0f 회원정보조회 profile
   * @method "GET"
   * @param string    memNo             //*회원번호
   * @create 이은비 2020.01.15
   */
  static profile = async obj => {
    const {params} = obj
    return await ajax({url: `/profile`, method: 'GET', params: params})
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
   * @param string    memNo             //*신고회원번호(필)
   * @param int       reason             //*신고사유(필)
   * @param string    cont               //*기타 신고 사유
   * @param string    roomNo               //*룸넘버
   * @create 김호겸 2020.01.15
   * @수정 황상한 2020.03.11
   */
  static member_declar = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/declar`, method: method || 'POST', data: data})
  }

  /**
   * 마이페이지 공지사항 조회
   * @method "GET"
   * @param string    memNo(O)
   * @param number    page(X)
   * @param number    records(X)
   * @created 박송원 2020.03.27
   */
  static mypage_notice_inquire = async params => {
    return await ajax({url: `/mypage/notice`, method: 'GET', params})
  }

  /**
   * @breif 마이페이지 지갑 내역 조회
   * @method "GET"
   * @param number    walletType(O)
   * @param number    page(X)
   * @param number    records(X)
   * @created 박송원 2020.03.24
   */
  static mypage_wallet_inquire = async params => {
    const {coinType} = params
    return await ajax({url: `/mypage/${coinType}`, method: 'GET', params})
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

  /**
   * @brief 회원 달 선물하기 -> 방송방에서 프로필 보기 클릭 후 선물하기 할때 사용
   * @method "POST"
   * @param string memNo                   //*선물받는 회원번호
   * @param int    dal               //*선물할 달 수
   * @create 김호겸 2020.04.02
   */
  static member_gift_dal = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/gift`, method: method || 'POST', data: data})
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
   * @brief 마이 DJ 조회
   * @method "GET"
   * @create 손완휘 2020.03.27
   */
  static my_dj = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/my/dj`, method: method || 'GET', params: params})
  }
  /**
   * @brief recommand
   * @method "GET"
   * @create 손완휘 2020.03.27
   */
  static recommand = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/recommand`, method: method || 'GET', params: params})
  }

  //-------------------------------------------------------------------- 포토 관련

  /**
   * @brief 이미지 업로드
   * @method "POST"
   * @param string uploadType (required) 'bg or profile'
   * @param string file                      //file 객체
   * @param string dataUrl                   //data URL
   * @param string imageUrl                  //image URL
   * @create 김호겸 2020.01.31
   */
  static image_upload = async obj => {
    const {url, method, data} = obj || {}
    const {uploadType} = data
    if (!uploadType) return alert('Require uploadType')
    return await ajax({...obj, url: url || `/upload`, method: method || 'POST', data: data})
  }
  //-------------------------------------------------------------------- 토큰
  /**
   * @brief 토큰지정
   * @create 손완휘 2020.02.06
   */
  static setAuthToken = str => {
    this.authToken = str
  }
  /**
   * @brief Server->React customHeader
   * @create 손완휘 2020.02.06
   */
  static setCustomHeader = obj => {
    this.customHeader = obj
  }
  //--------------------------------------------------------------------- 방송 사이드컨텐츠

  /**
   * @brief 방송방 선물하기
   * @param string roomNo                     // 방송방 번호
   * @param string memNo                      // 선물 받을 회원번호
   * @param string itemNo                     // 선물할 아이템 번호
   * @param int itemCnt                       // 아이템 개수
   * @param boolean isSecret                  // 몰래 선물 여부
   * @create 최우정 2020.02.17
   * @update 김호겸 2020.04.03
   */
  static send_gift = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/broad/gift`, method: method || 'POST', data: data})
  }
  /**
   * @brief 방송방 개인 정보 조회
   * @create 최우정 2020.03.02
   */
  static member_info_view = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/broad/profile`, method: method || 'GET', params: params})
  }
  /**
   * @brief 방송방 회원정보 조회
   * @create 황상한 2020.02.20
   * @update 김호겸 2020.03.12   // 함수명 변경 info_view -> broad_member_profile
   */
  static broad_member_profile = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/broad/member/profile`, method: method || 'GET', params: params})
  }

  /**
   * @brief 방송방 선물받은 내역보기
   * @create 최우정 2020.02.25
   */
  static broadcast_room_received_gift_history = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || '/broad/history', method: method || 'GET', params: params})
  }

  /**
   * @brief 공통정보 조회하기
   * @create 최우정 2020.02.26
   */
  static splash = async () => {
    return await ajax({url: '/splash', method: 'GET'})
  }

  /**
   * @brief 방송방 순위, 부스트 사용한황 조회 * 현재 부스트 tab에서 사용 중(임시) 방송방 진입 시 가져와야 할 듯
   * @create 최우정 2020.02.26
   */
  static broadcast_room_live_ranking_select = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || '/broad/boost', method: method || 'GET', params: params})
  }

  /**
   * @brief 방송방 부스트 사용하기
   * @create 최우정 2020.02.26
   */
  static broadcast_room_use_item = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || '/broad/boost', method: method || 'POST', data: data})
  }
  /**
   * @brief 방송방 토큰 재생성
   * @create 김호겸 2020.02.28
   */
  static broadcast_reToken = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || '/broad/reToken', method: method || 'POST', data: data})
  }

  /**
   * @brief 공통 서치
   * @create 황상한 2020.03.02
   */

  static live_search = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || '/search/live', method: method || 'GET', params: params})
  }
  static member_search = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || '/search/member', method: method || 'GET', params: params})
  }

  //-------------------------------------------------------------------- 메인 관련

  /**
   * @brief DJ 랭킹 가져오기
   * @method "GET"
   * @param int rankType                      //기간 (1:전일, 2:주간 (일~토), 3:월간)
   * @param int page                          //페이지번호
   * @param int records                       //페이지당 리스트 수
   * @create 이은비 2020.03.11
   */
  static get_dj_ranking = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/rank/dj`, method: method || 'GET', params: params})
  }

  /**
   * @brief 팬 랭킹 가져오기
   * @method "GET"
   * @param int rankType                      //기간 (1:전일, 2:주간 (일~토), 3:월간)
   * @param int page                          //페이지번호
   * @param int records                       //페이지당 리스트 수
   * @create 이은비 2020.03.11
   */
  static get_fan_ranking = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/rank/fan`, method: method || 'GET', params: params})
  }

  //------------------------------------------------------------- 인증관련
  /**
   * @brief 휴대폰 인증번호요청
   * @method "POST"
   * @param string phoneNo                        //휴대폰번호
   * @param int authType                          //인증타입(0: 회원가입, 1:비밀번호변경
   * @create 이은비 2020.03.12
   */
  static sms_request = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/sms`, method: method || 'POST', data: data})
  }

  /**
   * @brief 휴대폰 인증확인
   * @method "POST"
   * @param int CMID                          //인증요청ID
   * @param int code                          //인증번호
   * @create 이은비 2020.03.12
   */
  static sms_check = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/sms/auth`, method: method || 'POST', data: data})
  }

  /**
   * @brief 본인인증 여부 체크
   * @method "GET"
   * @create 이은비 2020.03.23
   */
  static self_auth_check = async obj => {
    const {url, method} = obj || {}
    return await ajax({...obj, url: url || `/self/auth/check`, method: method || 'GET'})
  }

  /**
   * @brief 본인인증 요청
   * @method "POST"
   * @create 이은비 2020.03.23
   */
  static self_auth_req = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/self/auth/req`, method: method || 'POST', params: params})
  }

  /**
   * @brief 본인인증 확인 및 DB저장
   * @method "POST"
   * @param String rec_cert                          //결과수신 DATA ex) afsdgo;alemwuvrotiaumvailvmuliauvr
   * @param String certNum                           //수신한 요청번호 ex) 645822347125215
   * @create 이은비 2020.03.23
   */
  static self_auth_res = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/self/auth/res`, method: method || 'POST', data: data})
  }

  //-------------------------------------------------------------

  /**
   * @brief 회원 알림 내용 보기
   * @method "GET"
   * @param int page                             //페이지번호
   * @param int records                          //페이지당 리스트 수
   * @create 이은비 2020.03.16
   */
  static my_notification = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/mypage/notification`, method: method || 'GET', params: params})
  }

  //-------------------------------------------------------------고객센터
  /**
   * @brief 고객센터 공지사항 목록 조회
   * @method "GET"
   * @create 황상한 2020.03.24
   */
  static notice_list = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/center/notice`, method: method || 'GET', params: params})
  }
  /**
   * @brief 고객센터 공지사항 상세 목록 조회
   * @method "GET"
   * @create 황상한 2020.03.24
   */
  static notice_list_detail = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/center/notice/detail`, method: method || 'GET', params: params})
  }

  /**
   * @brief 고객센터 FAQ 리스트
   * @method "GET"
   * @create 황상한 2020.03.24
   */
  static faq_list = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/center/faq`, method: method || 'GET', params: params})
  }
  /**
   * @brief 고객센터 FAQ 상세 내용 조회
   * @method "GET"
   * @create 황상한 2020.03.24
   */
  static faq_list_detail = async obj => {
    const {url, method, params} = obj || {}
    return await ajax({...obj, url: url || `/center/faq/detail`, method: method || 'GET', params: params})
  }
  /**
   * @brief 고객센터 1:1문의하기 작성
   * @method "POST"
   * @create 손완휘 2020.03.25
   */
  static center_qna_add = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/center/qna/add`, method: method || 'POST', data: data})
  }
  /**
   * @brief 고객센터 1:1문의하기 작성
   * @method "POST"
   * @create 손완휘 2020.03.25
   */
  //------------------------------------------------------회원 탈퇴
  static info_secsseion = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/member/withdrawal`, method: method || 'POST', data: data})
  }

  //-------------------------------------------------------------스토어, 결제
  /**
   * @brief 스토어 구매상품 목록
   * @method "GET"
   * @create 이은비 2020.03.24
   */
  static store_list = async obj => {
    const {url, method} = obj || {}
    return await ajax({...obj, url: url || `/store/charge`, method: method || 'GET'})
  }

  /**
   * @brief 신용카드 결제요청
   * @method "POST"
   * @param String Prdtnm                              //상품명 (50byte 이하)
   * @param String Prdtprice                           //요청금액(10byte 이하)
   * @create 이은비 2020.03.25
   */
  static pay_card = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/rest/pay/card`, method: method || 'POST', data: data})
  }

  /**
   * @brief 휴대폰 결제요청
   * @method "POST"
   * @param String Prdtnm                              //상품명 (50byte 이하)
   * @param String Prdtprice                           //요청금액(10byte 이하)
   * @create 이은비 2020.03.25
   */
  static pay_phone = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/rest/pay/phone`, method: method || 'POST', data: data})
  }

  /**
   * @brief 가상계좌 결제요청(무통장입금)
   * @method "POST"
   * @param String Prdtnm                              //상품명 (50byte 이하)
   * @param String Prdtprice                           //요청금액(10byte 이하)
   * @create 이은비 2020.03.25
   */
  static pay_virtual = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/rest/pay/virtual`, method: method || 'POST', data: data})
  }

  /**
   * @brief 실시간 계좌이체 결제요청
   * @method "POST"
   * @param String Prdtnm                              //상품명 (50byte 이하)
   * @param String Prdtprice                           //요청금액(10byte 이하)
   * @create 이은비 2020.03.25
   */
  static pay_bank = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/rest/pay/bank`, method: method || 'POST', data: data})
  }
}
API.customHeader = null
API.authToken = null

//ajax
export const ajax = async obj => {
  const {url, method, data, params} = obj
  try {
    const pathType = url === '/upload' ? PHOTO_SERVER : url.includes('/rest/pay/') ? PAY_SERVER : API_SERVER
    const contentType = url === '/upload' ? '' : 'application/x-www-form-urlencoded; charset=utf-8'
    let formData = new FormData()
    if (url === '/upload' && data) {
      formData.append('file', '')
      formData.append('dataURL', data.dataURL)
      formData.append('imageURL', '')
      formData.append('uploadType', data.uploadType)
    }
    const dataType = url === '/upload' ? formData : qs.stringify(data)
    let res = await axios({
      method: method,
      headers: {
        authToken: API.authToken || '',
        'custom-header': API.customHeader || '',
        'content-type': contentType
      },
      url: pathType + url,
      params: params,
      data: dataType,
      withCredentials: true
    })

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
