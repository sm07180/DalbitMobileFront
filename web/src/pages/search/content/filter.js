import React, {useState, useContext, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
import NoResult from './noResult'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
export default props => {
  const context = useContext(Context)
  //////////////////////////////////////////////////////////////

  const [list, setPosts] = useState([])
  //방송리스트 map
  const [listM, setPostsM] = useState([])
  const [show, setShow] = useState(false)
  //맴버리스트 map
  const [filter, setFilter] = useState('')
  const [filterM, setFilterM] = useState('')
  //온체이지 글자

  //검색결과
  const [query, setQuery] = useState('')

  //qs

  /////////////////////////////////////////////////////////////
  //초기 qs검색 api호출및 필터 벨류 저장
  const prevQueryRef = useRef('')
  useEffect(() => {
    //const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    //console.log(props.history.location.search.split('?')[1] && decodeURIComponent(props.history.location.search.split('?')[1]).split('=')[1])
    const qs = props.history.location.search.split('?')[1] && decodeURIComponent(props.history.location.search.split('?')[1]).split('=')[1]
    console.log(props.history.location.search)
    //props.history.push(`/search?query=${search}`)
    // const qs = props.history.split('?')[1] && decodeURIComponent(props.history.split('?')[1].split('=')[1])
    if (prevQueryRef.current !== qs) {
      setFilter(qs)
      setFilterM(qs)
      prevQueryRef.current = qs
    }
    ShowClick()
  }, [query])
  //검색 api호출및 필터 벨류 저장
  async function fetchData() {
    //const qs = props.history.location.search.split('?')[1] && decodeURIComponent(props.history.location.search.split('?')[1]).split('=')[1]
    const qs = props.history.location.search.split('?')[1] && decodeURIComponent(props.history.location.search.split('?')[1]).split('=')[1]
    const res = await API.live_search({
      params: {
        search: filter || qs,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      if (res.data) {
        setPosts(res.data.list)
        console.log(res.data.list)
        setShow(true)
      }
    }
    const resMember = await API.member_search({
      params: {
        search: filter || qs,
        page: 1,
        records: 10
      }
    })
    if (resMember.result === 'success') {
      if (resMember.data) {
        setPostsM(resMember.data.list)

        setShow(true)
      }
    }

    if (resMember.result === 'fail' && res.result === 'fail') {
      setShow(false)
    }
  }

  const ShowClick = () => {
    setPosts([])
    setPostsM([])
    fetchData()
  }
  const searchOnKeyDown = e => {
    const {currentTarget} = e
    if (currentTarget.value === '') {
      return
    }
    if (e.keyCode === 13) {
      setPosts([])
      setPostsM([])
      fetchData()
    }
  }

  /////////////////////////////////////////////////맵

  const ShowFilter2 = listM.map((item, index) => {
    if (filterM.length > 1) {
      if (item.nickNm.toLocaleLowerCase().includes(filterM.toLocaleLowerCase())) {
        return (
          <MemberWrap key={index}>
            <Mimg bg={item.profImg.url}></Mimg>
            <InfoBox>
              <div className="id">{item.memId}</div>
              <div className="idName">{item.nickNm}</div>
            </InfoBox>
            {item.roomNo !== '0' && <div className="livebox"></div>}
          </MemberWrap>
        )
      } else {
        return null
      }
    } else {
    }
  })
  //
  const ShowFilter = list.map((item, index) => {
    if (filter.length > 1) {
      if (item.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
        const {nickNm, memNo, profImg, auth, title} = item
        const {thumb62x62} = profImg
        let mode = '해당사항없음'
        // if (auth === 0) mode = '0'
        // if (auth === 1) mode = '1'
        // if (auth === 2) mode = '2'
        // if (auth === 2) mode = '3'
        // //
        // if (auth !== 1) return
        return (
          <ListWrap key={index}>
            {/* <p className="authClass">[{mode}]</p> */}
            <Img className="imgwrap" bg={profImg.url}>
              <Thumb thumb={thumb62x62} />
            </Img>
            <em>{title}</em>
            <h2>{title}</h2>
            <h3>{nickNm}</h3>
            <InfoWrap>
              <div>
                <span className="listen"></span>
                <strong>{item.entryCnt}</strong>
              </div>
              <div>
                <span className="like"></span>
                <strong>{item.likeCnt}</strong>
              </div>
            </InfoWrap>
          </ListWrap>
        )
      } else {
        return null
      }
    } else {
    }
  })
  //---------------------------------------------------------------------
  //tab:탭클릭 index정의 state
  const {currentItem, changeItem} = useTabs(0, tabConent)
  //---------------------------------------------------------------------
  return (
    <Wrap>
      <SearchBar>
        <input value={(filter, filterM)} onKeyDown={searchOnKeyDown} onChange={e => (setFilter(e.target.value), setFilterM(e.target.value), setShow(false))} />
        <Icon
          onClick={() => {
            ShowClick()
          }}></Icon>
      </SearchBar>

      {show === false && <NoResult />}
      {show === true && (
        <>
          <Tab>
            {tabConent.map((section, index) => (
              <button onClick={() => changeItem(index)} key={index} className={currentItem.id === index ? 'on' : ''}>
                {section.tab}
              </button>
            ))}
          </Tab>
          {currentItem.tab === '통합' && (
            <>
              <div className="liveList MnoResult">
                <div className="livetitle">
                  <p>
                    사람 <em>{listM.length}명</em>
                  </p>
                  <p>
                    결과 더보기<em></em>
                  </p>
                </div>
                <div className="flexWrap memflex">{ShowFilter2}</div>
              </div>

              <div className="liveList noResult">
                <div className="livetitle">
                  <p>
                    라이브 <em>{list.length}건</em>
                  </p>
                  <p>
                    결과 더보기<em></em>
                  </p>
                </div>
                <div className="flexWrap">{ShowFilter}</div>
              </div>
            </>
          )}
          {currentItem.tab === '사람' && (
            <>
              <div className="liveList MnoResult">
                <div className="livetitle">
                  <p>
                    사람 <em>{listM.length}명</em>
                  </p>
                  <p>
                    결과 더보기<em></em>
                  </p>
                </div>
                <div className="flexWrap">{ShowFilter2}</div>
              </div>
            </>
          )}
        </>
      )}
      {currentItem.tab === '라이브' && (
        <>
          <div className="liveList noResult">
            <div className="livetitle">
              <p>
                라이브 <em>{list.length}건</em>
              </p>
              <p>
                결과 더보기<em></em>
              </p>
            </div>
            <div className="flexWrap">{ShowFilter}</div>
          </div>
        </>
      )}
    </Wrap>
  )
}
const Wrap = styled.div`
  & .liveList {
    width: 100%;
    margin-top: 58px;
    &.noResult {
      margin-bottom: 101px;
    }
    &.MnoResult {
      margin-bottom: 50px;
    }
    & .livetitle {
      width: 100%;
      line-height: 36px;
      &:after {
        content: '';
        clear: both;
        display: block;
      }
    }
    & .flexWrap {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin-top: 26px;
    }

    & p:first-child {
      float: left;
      color: #8556f6;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.5px;
      em {
        margin-left: 10px;
        color: #757575;
        font-style: normal;
        font-weight: normal;
      }
    }
    & p:last-child {
      float: right;
      color: #757575;
      font-size: 14px;
      line-height: 36px;
      letter-spacing: -0.35px;
      &:after {
        content: '';
        clear: both;
        display: block;
      }
      & em {
        float: right;
        width: 36px;
        height: 36px;
        margin-left: 10px;
        background: url('https://devimage.dalbitcast.com/images/api/ico_plus_p.png');
      }
    }
  }
`
const SearchBar = styled.div`
  display: flex;
  width: 100%;
  height: 68px;
  border-style: solid;
  border-color: #8556f6;
  border-width: 3px;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 10px;
  & input {
    width: 95%;
    height: 100%;
    font-size: 24px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.6px;
    text-align: left;
    color: #8556f6;
    outline: none;
  }
`
const Icon = styled.button`
  display: flex;
  width: 48px;
  height: 48px;
  background: url('https://devimage.dalbitcast.com/svg/ic_search_normal.svg');
`

const ListWrap = styled.div`
  width: calc(14.28% - 25px);
  margin-bottom: 37px;
  margin-right: 29px;
  &:nth-child(7n) {
    margin-right: 0px;
  }
  @media (max-width: ${WIDTH_PC_S}) {
    width: calc(16.66% - 25px);
    &:nth-child(7n) {
      margin-right: 29px;
    }
    &:nth-child(6n) {
      margin-right: 0px;
    }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: calc(25% - 25px);
    &:nth-child(6n) {
      margin-right: 29px;
    }
    &:nth-child(4n) {
      margin-right: 0px;
    }
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: calc(50% - 4px);
    margin-right: 8px;
    &:nth-child(4n) {
      margin-right: 29px;
    }
    &:nth-child(2n) {
      margin-right: 0px;
    }
  }

  & em {
    display: block;
    margin-top: 19px;
    color: #bdbdbd;
    font-style: normal;
    font-size: 14px;
    letter-spacing: -0.35px;
  }
  & h2 {
    margin-top: 18px;
    color: #424242;
    font-size: 16px;
    font-weight: normal;
    letter-spacing: -0.4px;
  }
  & h3 {
    margin-top: 12px;
    color: #8556f6;
    font-size: 14px;
    letter-spacing: -0.35px;
  }
`
const Img = styled.div`
  position: relative;
  width: 100%;
  height: 148px;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
const Thumb = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  bottom: -32px;
  right: 0;
  border-radius: 50%;
  background: url(${props => props.thumb}) no-repeat center center / cover;
`
const InfoWrap = styled.div`
  display: flex;
  margin-top: 35px;
  & div {
    width: 50%;
    &:after {
      content: '';
      display: block;
      clear: both;
    }
    & span {
      float: left;
      width: 24px;
      height: 24px;
      margin-right: 6px;
      background: url('https://devimage.dalbitcast.com/images/api/ic_headphone_s.png') no-repeat center center / cover;
    }
    & strong {
      float: left;
      color: #bdbdbd;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      line-height: 24px;
      letter-spacing: -0.35px;
    }
    & .like {
      background: url('https://devimage.dalbitcast.com/images/api/ico-like-g-s.png') no-repeat center center / cover;
    }
  }
`
///
const MemberWrap = styled.div`
  display: flex;
  position: relative;
  width: calc(33.33% - 5px);
  height: 58px;
  border: solid 1px #f5f5f5;
  border-radius: 32px;
  margin-bottom: 5px;
  padding: 11px 10px;
  box-sizing: border-box;
  &:not(:last-child) {
    margin-right: 5px;
  }
  @media (max-width: ${WIDTH_PC_S}) {
    width: calc(50% - 5px);
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    &:not(:last-child) {
      margin-right: 0px;
    }
  }
  & .livebox {
    position: absolute;
    right: 10px;
    width: 36px;
    height: 36px;
    background: url('https://devimage.dalbitcast.com/images/api/ic_live.png') no-repeat center center / cover;
  }
`
const Mimg = styled.div`
  width: 36px;
  height: 36px;
  background: url(${props => props.bg}) no-repeat center center / cover;
  border-radius: 50%;
`
const InfoBox = styled.div`
  margin-left: 10px;
  &:after {
    content: '';
    clear: both;
    display: block;
  }
  & .id {
    display: inline-block;
    height: 50%;
    font-size: 14px;
    color: #8555f6;
    letter-spacing: -0.35px;
  }
  & .idName {
    height: 50%;
    font-size: 14px;
    letter-spacing: -0.35px;
    color: #424242;
  }
`

//tab function && styled
const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }
  const [currentIndex, SetCurrentIndex] = useState(initialTab)
  return {
    currentItem: allTabs[currentIndex],
    changeItem: SetCurrentIndex
  }
}
//------------------------------------------------------------------
//styled
const Tab = styled.div`
  margin-top: 50px;
  & button {
    width: 33.33%;
    height: 48px;
    display: inline-block;
    border: 1px solid #e0e0e0;
    border-bottom: 1px solid ${COLOR_MAIN};
    color: ${COLOR_MAIN};
    margin-left: -1px;
    &:first-child {
      margin-left: 0;
    }
    &.on {
      border: 1px solid ${COLOR_MAIN};
      background-color: ${COLOR_MAIN};
      color: white;
    }
  }
  & button:focus {
    outline: none;
  }
`
//------------------------------------------------------------------
//탭 셀렉트 배열
const tabConent = [
  {
    id: 0,
    tab: '통합'
  },
  {
    id: 1,
    tab: '사람'
  },
  {
    id: 2,
    tab: '라이브'
  }
]
