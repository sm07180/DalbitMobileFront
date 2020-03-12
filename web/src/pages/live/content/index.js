import React, {useEffect, useContext, useState, useMemo, useRef} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
import {isHybrid, Hybrid} from 'context/hybrid'
import {Scrollbars} from 'react-custom-scrollbars'
import {LiveStore} from '../store'
//components
import Title from './title'
import TopRank from './topRank'
import Live from './live'
import Pagination from './pagination'
//window.addEventListener 사용하면 state 가 초기화 되는 문제로 데이터들 함수 외부 변수로 사용 중
let liveList = []
let livePaging = []
let liveType = ''
let reload = true

const Test = props => {
  const [state, setState] = useState(props)
  console.log('props ', props)
  return <div>123</div>
}
export default props => {
  //----------------------------------------------------------- declare start
  const [list, setList] = useState([])
  const [paging, setPaging] = useState()
  const context = useContext(Context)
  const store = useContext(LiveStore)
  const [type, setType] = useState('') // roomType
  const [page, setPage] = useState(1)
  const [rank, setRank] = useState([])
  const scrollbars = useRef(null)
  const width = useMemo(() => {
    return window.innerWidth >= 600 ? 400 : 200
  })
  const [test, setTest] = useState('test')
  //----------------------------------------------------------- func start

  // 방송방 리스트 조회
  const getBroadList = async (obj, reload) => {
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      console.log('## res :', res)
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
        }
        setPaging(res.data.paging)
      }
    }
  }

  const mobileConcat = async obj => {
    console.log('## store.list : ', store.list)

    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      console.log('## res :', res)
      setList(false)
      return
    } else {
      console.log('## res :', res)
      console.log('## store.list : ', store.list)
      store.action.updateList([...liveList, ...res.data.list])
      setPaging(res.data.paging)
    }
  }

  // 공통코드 조회
  const commonData = async obj => {
    const res = await Api.splash({})
    if (res.result === 'success') {
      context.action.updateCommon(res.data) // context에 update
    }
    console.log('## res :', res.data)
  }

  //exitRoom
  async function exitRoom(obj) {
    const res = await Api.broad_exit({data: {...obj}})
    if (res.result === 'success') {
      return res
    }
    alert(res.message)
  }

  //joinRoom
  async function joinRoom(obj) {
    const {roomNo} = obj
    console.log('obj :: ', roomNo)
    const res = await Api.broad_join({data: {roomNo: obj.roomNo}})
    console.log('roomNo = ' + roomNo)
    //Error발생시 (방이 입장되어 있을때)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.join.already') {
      const exit = await exitRoom(obj)
      if (exit.result === 'success') joinRoom(obj)
    }
    //Error발생시 (종료된 방송)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.end') alert(res.message)
    //정상진입이거나,방탈퇴이후성공일경우
    if (res.result === 'success') {
      if (isHybrid()) {
        Hybrid('RoomJoin', res.data)
      } else {
        //하이브리드앱이 아닐때
        const {roomNo} = res.data
        context.action.updateBroadcastTotalInfo(res.data)
        props.history.push(`/broadcast?roomNo=${roomNo}`, res.data)
      }
    }
    return
  }

  const onScroll = e => {
    // if (window.innerWidth <= 600) {
    //   console.log('## paging :', livePaging)
    //   const position = window.scrollY
    //   console.log('## position :', position)
    //   if (position === 400) {
    //     console.log(position)
    //     mobileConcat({params: {roomType: type, page: livePaging.next, records: 10}})
    //     window.scrollTo(0, 100)
    //   }
    // }
    console.log('## store - list', store.list)
  }

  useEffect(() => {
    getBroadList({params: {roomType: type, page: page, records: 10}})
    commonData()
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  console.log('## store.list :', store)
  // console.log('## context :', context)
  //----------------------------------------------------------- components start
  return (
    <Container>
      <Title title={'라이브'} />
      <Wrap>
        <MainContents>
          {rank.length > 0 && <TopRank broadList={rank} joinRoom={joinRoom} getBroadList={getBroadList} setType={setType} paging={paging} width={width} type={type} />}
          <Live broadList={store.list} joinRoom={joinRoom} getBroadList={getBroadList} setType={setType} paging={paging} />
          {!store.list && (
            <NoResult>
              <NoImg />
              <span>조회 된 검색 결과가 없습니다.</span>
            </NoResult>
          )}
        </MainContents>
      </Wrap>
      {window.innerWidth > 600 && store.list && <Pagination paging={paging} getBroadList={getBroadList} type={type} />}
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
  align-items: center;
  flex-direction: column;
`
const Wrap = styled.div`
  display: flex;
  width: 65%;
  /* height: 80%; */
  justify-content: center;
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
  background: url('https://devimage.dalbitcast.com/images/api/img_noresult.png') no-repeat;
  width: 299px;
  height: 227px;
`
