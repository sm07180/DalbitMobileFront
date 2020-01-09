/**
 * @title RESTFUL API
 * @example 사용법
 *
import Api from 'Context/api'
const [fetch, setFetch] = useState(null)

//fetch
async function fetchData(obj) {
  const res = await Api.rooms_now({...obj})
  setFetch(res)
  setChanges(changes => ({...changes, ...res.data}))
  console.log(res)
}

useEffect(() => {
  fetchData()
}, [])
 */

import axios from 'axios'
//component
import {API_SERVER} from 'Context/config'

/**
 * @brief 로그인 정보요청
 * @param string $id
 * @param string $password
 * @method "POST"
 */

export default class API {
  //---------------------------------------------------------------------
  //---------------------------------------------------------------------공통
  //매장 안내 이미지
  static login = async obj => {
    const {url, method, data} = obj || {}
    return await ajax({...obj, url: url || '/login/', method: method || 'POST', data: data})
  }
  // //매장 안내 이미지
  // static shop_introimg = async obj => {
  //   const {url, method} = obj || {}
  //   return await ajax({...obj, url: url || '/shop/introimg/', method: method || 'GET'})
  // }
  // //쿠폰(확인,생성)
  // static coupon = async obj => {
  //   const {url, method, data} = obj || {}
  //   return await ajax({...obj, url: url || '/coupon', method: method || 'GET', data: data})
  // }
}
//---------------------------------------------------------------------
//ajax
export const ajax = async obj => {
  const {url, method, data, params} = obj
  try {
    //let res = await axios({headers: {token: token}, method: method, url: Config.devServer + url, params: params, data: data})
    let res = await axios({method: method, url: API_SERVER + url, params: params, data: data})
    console.table(res.data)
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
