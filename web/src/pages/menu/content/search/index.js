import React, {useEffect, useRef, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
//context
import API from 'context/api'
// component
import Header from 'components/ui/new_header.js'
import InitialRecomend from './components/recomend'
import List from './components/list'

//static
//scss
import './search.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

// concat flag
let currentPage = 1
let timer
let moreState = false

let btnAccess = false

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const location = useLocation()
  const {search, state} = location
  // initial query
  const searchText = search && search.split('?query=')[1]
  // state
  const [result, setResult] = useState('') //검색텍스트
  const [recoTab, setRecoTab] = useState(0) //초기 추천 탭
  const [recoList, setRecoList] = useState([]) //초기 추천 탭 fetch list
  const [recoListClip, setRecoListClip] = useState([])
  const [filterType, setFilterType] = useState(0) //서치 필터 0.전체 1.dj 2.방송 3.클립
  const [CategoryType, setCategoryType] = useState(0) //카테고리 토글 0.통합검색
  const [clipType, setClipType] = useState([]) //splash clip type
  const [searchState, setSearchState] = useState(false) //검색 어때요 ,리스트 분기
  //list
  const [memberList, setMemberList] = useState([])
  const [liveList, setLiveList] = useState([])
  const [clipList, setClipList] = useState([])
  const [nextList, setNextList] = useState(false)
  const [nextLive, setNextLive] = useState(false)
  const [nextClip, setNextClip] = useState(false)
  const [total, setTotal] = useState({
    memtotal: 0,
    livetotal: 0,
    cliptotal: 0
  })
  //input focus
  const [focus, setFocus] = useState(false)
  const IputEl = useRef()
  //------------------------Data--fetch
  // 초기추천탭 Data
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
        setRecoListClip(res.data.list)
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: res.message
        }))
      }
    }
  }
  // 클립타입 Data
  const fetchDataClipType = async () => {
    const {result, data, message} = await API.getClipType({})
    if (result === 'success') {
      setClipType(data)
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
  }
  //검색 fetch 1. 맴버 2. 방송방 3. 클립
  async function fetchSearchMember(next) {
    currentPage = next ? ++currentPage : currentPage
    const res = await API.member_search({
      params: {
        search: result,
        page: currentPage,
        records: 20
      }
    })
    if (res.result === 'success') {
      if (res.data.paging && res.data.paging.total !== 0) {
        setTotal((prevState) => ({
          ...prevState,
          memtotal: res.data.paging.total
        }))
      }
      if (res.code === '0') {
        if (next !== 'next') {
          setMemberList(res.data.list)
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextList(res.data.list)
        } else {
          setMemberList(res.data.list)
          fetchSearchMember('next')
        }
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: res.message
      }))
    }
  }
  async function fetchSearchLive(next) {
    currentPage = next ? ++currentPage : currentPage
    const res = await API.broad_list({
      params: {
        search: result,
        page: currentPage,
        records: 20
      }
    })
    if (res.result === 'success') {
      if (res.data.paging && res.data.paging.total !== 0) {
        setTotal((prevState) => ({
          ...prevState,
          livetotal: res.data.paging.total
        }))
      }
      if (res.code === '0') {
        if (next !== 'next') {
          setLiveList(res.data.list)
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextLive(res.data.list)
        } else {
          setLiveList(res.data.list)
          fetchSearchLive('next')
        }
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: res.message
      }))
    }
  }
  async function fetchSearchClip(next) {
    currentPage = next ? ++currentPage : currentPage
    const res = await API.getClipList({
      search: result,
      slctType: 0,
      dateType: 0,
      page: currentPage,
      records: 20
    })
    if (res.result === 'success') {
      if (res.data.paging && res.data.paging.total !== 0) {
        setTotal((prevState) => ({
          ...prevState,
          cliptotal: res.data.paging.total
        }))
      }
      if (res.code === '0') {
        if (next !== 'next') {
          setClipList(res.data.list)
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextClip(res.data.list)
        } else {
          setClipList(res.data.list)
          fetchSearchClip('next')
        }
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: res.message
      }))
    }
  }
  //function
  //클립 서치 분기
  const holeSearch = () => {
    setTotal((prevState) => ({
      ...prevState,
      cliptotal: '',
      memtotal: '',
      livetotal: ''
    }))
    if (CategoryType === 1) {
      fetchSearchMember()
    } else if (CategoryType === 2) {
      fetchSearchLive()
    } else if (CategoryType === 3) {
      fetchSearchClip()
    } else {
      fetchSearchMember()
      fetchSearchLive()
      fetchSearchClip()
    }
  }
  const onChange = (e) => {
    setResult(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    btnAccess = true

    if (result.length < 2) {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: `두 글자 이상 입력해 주세요.`,
        callback: () => {
          btnAccess = false
        }
      }))
    } else {
      currentPage = 1
      setSearchState(true)
      setCategoryType(filterType)
      holeSearch()
      setTimeout(() => {
        btnAccess = false
      }, 1000)
      setFocus(false)
    }
  }
  const changeFilter = (id) => {
    // setFilterType(id)
    setCategoryType(id)
    setFocus(false)
  }

  //콘켓 쇼모어 이벤트
  const showMoreList = () => {
    if (moreState && CategoryType === 1) {
      setMemberList(memberList.concat(nextList))
      fetchSearchMember('next')
    } else if (moreState && CategoryType === 2) {
      setLiveList(liveList.concat(nextLive))
      fetchSearchLive('next')
    } else if (moreState && CategoryType === 3) {
      setClipList(clipList.concat(nextClip))
      fetchSearchClip('next')
    }
  }
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (moreState && windowBottom >= docHeight - 200) {
        showMoreList()
      } else {
      }
    }, 10)
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
  // 인풋 포커스 제어
  useEffect(() => {
    const {current} = IputEl
    const handleFocus = () => {
      setFocus(true)
    }
    current.addEventListener('focus', handleFocus)
    return () => {
      current.removeEventListener('focus', handleFocus)
    }
  })
  //window Scroll
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList, nextClip, nextLive])
  useEffect(() => {
    currentPage = 1
    if (result.length > 1) {
      holeSearch()
    }
  }, [CategoryType])
  //render ----------------------------------------------------

  return (
    <div id="search">
      {/* 서치 헤더 */}
      <Header title="검색" />
      {/* 서치 컨트롤러 */}
      <div className="controllerWrap">
        <div className={`controller ${focus ? 'focus' : ''}`}>
          <form onSubmit={handleSubmit}>
            <button type="submit" className="controller__submitBtn" disabled={btnAccess} />
            <input
              type="text"
              name="query"
              placeholder="검색어를 입력해 보세요."
              value={result}
              onChange={onChange}
              className="controller__submitInput"
              ref={IputEl}
            />
          </form>
        </div>
      </div>
      {/* 서치필터 focus state => 인풋에 포커스 할시의 행위*/}
      {focus && (
        <div className="filterWrap">
          {filterContent.map((item, idx) => {
            return (
              <button
                key={`${idx}+filterTab`}
                onClick={() => setFilterType(item.id)}
                className={filterType === item.id || filterType === 0 ? 'activeFiter' : ''}>
                {item.tab}
              </button>
            )
          })}
        </div>
      )}
      {/* 서치 추천 라이브/클립 컴포넌트 -props 1.setRecoTab => tab state emit (require parents data fetch ) 2.recoList => data list* 3.클립 스플래시*/}
      {!searchState && (
        <InitialRecomend
          setRecoTab={setRecoTab}
          recoList={recoList}
          clipType={clipType}
          state={state}
          recoListClip={recoListClip}
        />
      )}
      {searchState && (
        <>
          {filterType === 0 && (
            <div className="searchCategory">
              {tabContent.map((item, idx) => {
                return (
                  <button
                    key={`${idx}+categoryTab`}
                    onClick={() => changeFilter(item.id)}
                    className={CategoryType === item.id ? 'activeFiter' : ''}>
                    {item.tab}
                  </button>
                )
              })}
            </div>
          )}
          {/* 서치 리스트 */}
          <List
            filterType={filterType}
            memberList={memberList}
            clipList={clipList}
            liveList={liveList}
            total={total}
            clipType={clipType}
            CategoryType={CategoryType}
            setCategoryType={setCategoryType}
            searchText={result}
          />
        </>
      )}
    </div>
  )
}
// map
const tabContent = [
  {id: 0, tab: '통합검색'},
  {id: 1, tab: 'DJ'},
  {id: 2, tab: '방송'},
  {id: 3, tab: '클립'}
]
const filterContent = [
  {id: 0, tab: '전체'},
  {id: 1, tab: 'DJ'},
  {id: 2, tab: '방송'},
  {id: 3, tab: '클립'}
]
