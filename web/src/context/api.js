/**
 * @title RESTFUL API
 * @document https://docs.google.com/spreadsheets/d/1WiGM6RP2g4qvlKzkMnHMkrc8683Zy8Ka/edit#gid=248254560
 * @notice API정의서_v2.xlsx 문서확인
 * @example 사용법
 *
import Api from 'Context/api'
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
import {API_SERVER} from 'Context/config'

export default class API {
  //---------------------------------------------------------------------
  /**
   * @brief 로그인 정보요청
   * @param string $id
   * @param string $password
   * @method "POST"
   */

  static login_authenticate = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || `/member/login?url=${url}`, method: method || 'POST', data: data})
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
