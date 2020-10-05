import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {useHistory, useLocation} from 'react-router-dom'
//context

import {Context} from 'context/index.js'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import Room, {RoomJoin} from 'context/room'
import API from 'context/api'
// component
import Header from 'components/ui/new_header.js'
import InitialRecomend from './components/recomend'
import qs from 'query-string'
//static
import SearchIco from './static/ic_search.svg'
//scss
import './search.scss'
//flag
const tabContent = [
  {id: 0, tab: '통합검색'},
  {id: 1, tab: 'DJ'},
  {id: 2, tab: '방송'},
  {id: 3, tab: '클립'}
]
export default (props) => {
  // ctx && path
  const context = useContext(Context)
  const history = useHistory()
  const location = useLocation()
  const {search} = location
  const searchText = search && search.split('?query=')[1]
  // state
  const [result, setResult] = useState('') //검색텍스트
  const [recoTab, setRecoTab] = useState(0) //초기 추천 탭
  const [recoList, setRecoList] = useState([]) //초기 추천 탭 fetch list
  const [clipType, setClipType] = useState([])
  const [memberList, setMemberList] = useState([])
  //fetch
  // 초기추천탭 fetch list
  const fetchInitialList = async (recoTab) => {
    if (recoTab === 0) {
      const res = await API.getSearchRecomend({
        page: 1,
        records: 20
      })
      if (res.result === 'success') {
        setRecoList(res.data.list)
      } else {
        alert(res.message)
      }
    } else if (recoTab === 1) {
      const res = await API.getPopularList({
        page: 1,
        records: 20
      })
      if (res.result === 'success') {
        setRecoList(res.data.list)
      } else {
        context.action.alert({
          msg: message
        })
      }
    }
  }
  const fetchDataClipType = async () => {
    const {result, data, message} = await API.getClipType({})
    if (result === 'success') {
      setClipType(data)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  //fetch 사용자검색
  async function fetchSearch() {
    const res = await API.member_search({
      params: {
        search: result,
        page: 1,
        records: 20
      }
    })
    if (res.result === 'success') {
      setMemberList(res.data.list)
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  //function
  // fn : onChange => 검색 form 온체인지
  const onChange = (e) => {
    setResult(e.target.value)
  }
  const handleSubmit = (e) => {
    fetchSearch()
  }
  //initial url decode
  useEffect(() => {
    fetchDataClipType()
    if (search && searchText !== '') {
      setResult(decodeURI(searchText))
    }
    return () => {
      setResult('')
    }
  }, [])

  // 초기 탭 호출
  useEffect(() => {
    fetchInitialList(recoTab)
  }, [recoTab])

  //render ----------------------------------------------------
  return (
    <div id="search">
      {/* 서치 헤더 */}
      <Header title="검색" />
      {/* 서치 컨트롤러 */}
      <div className="controller">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="query"
            placeholder="검색어를 입력해 보세요."
            value={result}
            onChange={onChange}
            className="controller__submitInput"
          />
          <button type="submit" className="controller__submitBtn">
            <img className="ico" src={SearchIco} />
          </button>
        </form>
      </div>
      {/* 서치 추천 라이브/클립 컴포넌트 -props 1.setRecoTab => tab state emit (require parents data fetch ) 2.recoList => data list* 3.클립 스플래시*/}
      <InitialRecomend setRecoTab={setRecoTab} recoList={recoList} clipType={clipType} />
    </div>
  )
}
