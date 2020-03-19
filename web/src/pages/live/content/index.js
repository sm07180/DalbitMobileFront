import React, {useEffect, useContext, useState, useMemo, useRef} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
import {isHybrid, Hybrid} from 'context/hybrid'
import {LiveStore} from '../store'
import {IMG_SERVER} from 'context/config'
//components
import Title from './title'
import TopRank from './topRank'
import Live from './live'
import Pagination from './pagination'
import roomCheck from 'components/lib/roomCheck.js'

//window.addEventListener 사용하면 state 가 초기화 되는 문제로 데이터들 함수 외부 변수로 사용 중
let liveList = []
let livePaging = []
let liveType = ''
let liveSearchType = ''
let liveRank = []
let reload = true

export default props => {
  //----------------------------------------------------------- declare start
  const [list, setList] = useState([])
  const [paging, setPaging] = useState()
  const context = useContext(Context)
  const store = useContext(LiveStore)
  const [type, setType] = useState('') // roomType
  const [searchType, setSearchType] = useState('0') // searchType
  const [page, setPage] = useState(1)
  const [rank, setRank] = useState([])
  const scroll = useRef(null)
  const width = useMemo(() => {
    return window.innerWidth >= 600 ? 400 : 200
  })
  //----------------------------------------------------------- func start

  // 방송방 리스트 조회
  const getBroadList = async (obj, reload) => {
    const {roomType, searchType} = obj.params
    liveType = roomType
    liveSearchType = searchType
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      setList(false)
      return
    } else {
      if (res.code === '0') {
        // code === "0" >> 데이터 없음
        store.action.updateList(false) // 데이터가 없을 때 false // store.list 가 false 일때 pagination, live-list 안보여줌
      } else {
        store.action.updateList(res.data.list)
        liveList = res.data.list
        livePaging = res.data.paging
        if (reload === undefined) {
          setRank(res.data.list.slice(0, 3)) // 상위 3명 따로 담아서 보냄
          liveRank = res.data.list.slice(0, 3)
        }
        setPaging(res.data.paging)
      }
    }
  }

  //scroll paging
  const mobileConcat = async obj => {
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      setList(false)
      return
    } else {
      console.log('## res :', res)
      liveList = liveList.concat(res.data.list)
      livePaging = res.data.paging
      store.action.updateList(liveList)
      if (liveRank.length < 3) {
        liveRank = liveList.slice(0, 3)
        setRank(liveRank)
      }
      window.addEventListener('scroll', onScroll)
    }
  }

  // 공통코드 조회
  const commonData = async obj => {
    const res = await Api.splash({})
    if (res.result === 'success') {
      context.action.updateCommon(res.data) // context에 update
      getBroadList({params: {roomType: type, page: page, records: 10, searchType: searchType}})
    }
  }
  //joinRoom
  async function joinRoom(obj) {
    const {roomNo} = obj
    //const data = await roomCheck(roomNo)
    const res = await Api.broad_join({data: {roomNo}})
    if (res.result === 'success') {
      if (isHybrid()) {
        if (res.data == null || res.data == undefined) {
          Hybrid('RoomJoin', '')
        } else {
          Hybrid('RoomJoin', res.data)
        }
      } else {
        context.action.updateBroadcastTotalInfo(res.data)
        props.history.push(`/broadcast?roomNo=${roomNo}`, res.data)
      }
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    } else {
      context.action.alert({
        callback: () => {
          props.history.push('/live')
        },
        msg: res.message
      })
    }
  }

  const onScroll = async e => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    if (livePaging.page < livePaging.totalPage) {
      if (scrollHeight - window.innerHeight - scrollTop < 80) {
        document.documentElement.scrollTo({top: scrollHeight * 0.2, behavior: 'smooth'})
        window.removeEventListener('scroll', onScroll)
        mobileConcat({params: {roomType: liveType, page: livePaging.next, records: 10, searchType: liveSearchType}})
      }
    }
  }

  useEffect(() => {
    commonData()
    if (innerWidth <= 600) {
      window.addEventListener('scroll', onScroll)
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }
  }, [])

  //----------------------------------------------------------- components start
  return (
    <Container>
      <Title title={'라이브'} />
      <Wrap>
        <MainContents>
          {rank.length > 0 && <TopRank broadList={rank} joinRoom={joinRoom} getBroadList={getBroadList} setType={setType} paging={paging} width={width} type={type} />}
          <Live broadList={store.list} joinRoom={joinRoom} getBroadList={getBroadList} setType={setType} paging={paging} type={type} searchType={searchType} setSearchType={setSearchType} />
          {!store.list && (
            <NoResult>
              <NoImg />
              <span>조회 된 검색 결과가 없습니다.</span>
            </NoResult>
          )}
        </MainContents>
      </Wrap>
      {window.innerWidth > 600 && store.list && <Pagination paging={paging} getBroadList={getBroadList} type={type} searchType={searchType} setSearchType={setSearchType} />}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  /* height: 100%; */
  margin-bottom: 2%;
  flex-direction: column;
  align-items: center;
`

const MainContents = styled.div`
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    align-items: flex-start;
  }
  display: flex;
  width: 100%;
  /* height: 100%; */
  /* align-items: flex-start; */
  /* align-items: center; */
  flex-direction: column;
`
const Wrap = styled.div`
  display: flex;
  width: 65%;
  /* height: 80%; */
  /* justify-content: center; */
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 90%;
  }
`
const NoResult = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 450px;

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    height: 350px;
  }

  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 282px;
    height: 26px;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.25;
    letter-spacing: -0.6px;
    color: #616161;
    margin-top: 30px;

    @media (max-width: ${WIDTH_MOBILE}) {
      font-size: 20px;
    }
  }
`

const NoImg = styled.div`
  display: flex;
  background: url(${IMG_SERVER}/images/api/img_noresult.png) no-repeat;
  width: 299px;
  height: 227px;
`
