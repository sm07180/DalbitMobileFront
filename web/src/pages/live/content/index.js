import React, {useEffect, useContext, useState, useMemo, useRef} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
import {isHybrid, Hybrid} from 'context/hybrid'
import {LiveStore} from '../store'
import {IMG_SERVER} from 'context/config'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
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

const RECORDS = 10

export default props => {
  //----------------------------------------------------------- declare start
  const context = useContext(Context)
  const store = useContext(LiveStore)
  const [type, setType] = useState('') // roomType
  const [searchType, setSearchType] = useState('0') // searchType
  const [rank, setRank] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPageNumber, setTotalPageNumber] = useState(null)

  const width = useMemo(() => {
    return window.innerWidth >= 600 ? 400 : 200
  })

  const {list} = store

  // 방송방 리스트 조회
  const getBroadList = async () => {
    const obj = {params: {roomType: type, page: currentPage, records: RECORDS, searchType: searchType}}
    const res = await Api.broad_list(obj)

    if (res.result === 'success') {
      if (res.data.list.length) {
        return {result: true, ...res.data}
      } else {
        return {result: false}
      }
    }
    return null
  }

  //scroll paging
  const mobileConcat = async () => {
    const obj = {params: {roomType: type, page: currentPage, records: RECORDS, searchType: searchType}}
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      return
    } else {
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

  const onScroll = async e => {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    if (livePaging.page < livePaging.totalPage) {
      if (scrollHeight - window.innerHeight - scrollTop < 80) {
        document.documentElement.scrollTo({top: scrollHeight * 0.2, behavior: 'smooth'})
        window.removeEventListener('scroll', onScroll)
        mobileConcat()
      }
    }
  }

  useEffect(() => {
    if (innerWidth <= 600) {
      window.addEventListener('scroll', onScroll)
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const {result, paging, list} = await getBroadList()
      if (result) {
        store.action.updateList(list)
        const {total} = paging
        setTotalPageNumber(total)
      } else {
        // result -> false
        store.action.updateList(false)
      }
    })()
  }, [currentPage, searchType])

  async function joinRoom(obj) {
    //console.log('asdasdadads')
    const {roomNo} = obj
    props.history.push(`/broadcast?roomNo=${roomNo}`)
    // const data = await roomCheck(roomNo, context)
    // if (data) {
    //   if (isHybrid()) {
    //     Hybrid('RoomJoin', data)
    //   } else {
    //     context.action.updateBroadcastTotalInfo(data)
    //     props.history.push(`/broadcast?roomNo=${roomNo}`)
    //   }
    // }
  }

  //----------------------------------------------------------- components start
  return (
    <Container>
      {/* <h2>라이브</h2> */}
      <Wrap>
        <MainContents>
          {/* <TopRank broadList={list} joinRoom={joinRoom} width={width} /> */}
          <Live
            broadList={list}
            joinRoom={joinRoom}
            getBroadList={getBroadList}
            setType={setType}
            type={type}
            searchType={searchType}
            setSearchType={setSearchType}
          />

          {!Array.isArray(store.list) && (
            <NoResult>
              <NoImg />
              <span>조회 된 검색 결과가 없습니다.</span>
            </NoResult>
          )}
        </MainContents>
      </Wrap>
      {list && list.length > 0 && (
        <Pagination current={currentPage} total={totalPageNumber} records={RECORDS} setCurrentPage={setCurrentPage} />
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 2%;
  flex-direction: column;
  align-items: center;

  & > h2 {
    padding: 40px 0 70px 0;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }
`

const MainContents = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    align-items: flex-start;
  }
`
const Wrap = styled.div`
  display: flex;
  width: 65%;
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
    transform: skew(-0.03deg);
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
