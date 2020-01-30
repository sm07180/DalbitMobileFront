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
  //---------------------------------------------------------------------
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
    return await ajax({...obj, url: url || `/mypage/pan/{스타회원번호}}`, method: method || 'POST', data: data})
  }

  /**
   * @brief 팬 해제
   * @method "DELETE"
   * @param string    memNo             //*스타회원번호
   * @create 김호겸 2020.01.15
   */
  static pan_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/pan/{스타회원번호}}`, method: method || 'DELETE', data: data})
  }

  /**
   * @brief 회원정보조회
   * @method "GET"
   * @param string    memNo             //*스타회원번호
   * @create 김호겸 2020.01.15
   */
  static member_info = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/profile/{조회회원번호}}`, method: method || 'GET', params: params})
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
   * @create 김호겸 2020.01.15
   */
  static member_broadcast_basic_Edit = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/broad`, method: method || 'GET', params: params})
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
   * @brief 회원 해제하기
   * @method "DELETE"
   * @param string    memNo             //*차단회원번호
   * @create 김호겸 2020.01.15
   */
  static member_block_delete = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/mypage/block`, method: method || 'DELETE', data: data})
  }
}
//---------------------------------------------------------------------
//ajax
export const ajax = async obj => {
  const {url, method, data, params} = obj
  try {
    let res = await axios({
      method: method,
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      url: API_SERVER + url,
      params: qs.stringify(params),
      data: qs.stringify(data)
    })
    // table 모양 로그출력
    console.table(res.data)
    // string 로그출력
    //console.log(JSON.stringify(res.data, null, 1))
    return res.data
  } catch (error) {
    errorMsg(error)
  }
}
//error
export const errorMsg = error => {
  console.log('%c' + '## AJAX Error', 'width:100%;font-size:12px;padding:5px 10px;color:#fff;background:blue;')
  console.log(error)
}
