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
  const [listM, setPostsM] = useState([])
  const [filter, setFilter] = useState('')
  const [filterM, setFilterM] = useState('')
  const [show, setShow] = useState(false)
  const [query, setQuery] = useState('')
  /////////////////////////////////////////////////////////////
  const prevQueryRef = useRef('')
  useEffect(() => {
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    if (prevQueryRef.current !== qs) {
      setFilter(qs)
      setFilterM(qs)
      prevQueryRef.current = qs
    }
    ShowClick()
    //console.log('pq', prevQueryRef)
  }, [query])

  async function fetchData() {
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
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
      }
    } else {
      setShow(false)
    }
  }

  const ShowClick = () => {
    setPosts([])
    setPostsM([])

    if (listM.length === 0 && list.length === 0) {
      setShow(false)
    } else {
      setShow(true)
    }
    fetchData()
  }
  /////////////////////////////////////////////////

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
        return (
          <ListWrap key={index}>
            <Img className="imgwrap" bg={item.profImg.url}>
              <Thumb thumb={item.profImg.thumb62x62} />
            </Img>
            <em>{item.title}</em>
            <h2>{item.title}</h2>
            <h3>{item.nickNm}</h3>
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

  const searchOnKeyDown = e => {
    const {currentTarget} = e
    if (currentTarget.value === '') {
      return
    }
    if (e.keyCode === 13) {
      setPosts([])
      setPostsM([])

      if (listM.length === 0 && list.length === 0) {
        setShow(false)
      } else {
        setShow(true)
      }
      fetchData()
    }
  }
  ///////////////////////////////
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
              <div className="liveList">
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

              <div className="liveList">
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
              <div className="liveList">
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
          <div className="liveList">
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
    & .livetitle {
      width: 100%;
      &:after {
        content: '';
        clear: both;
        display: block;
      }
    }
    & .flexWrap {
      display: flex;
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
  width: 148px;
  margin-right: 29px;
  margin-bottom: 37px;
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
//tab function
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
///
const MemberWrap = styled.div`
  display: flex;
  position: relative;
  width: 33%;
  height: 58px;
  border: solid 1px #f5f5f5;
  border-radius: 32px;
  margin-right: 5px;
  padding: 11px 10px;
  box-sizing: border-box;
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
