import React, {useState, useContext, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import API from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import NoResult from './noResult'
export default props => {
  const context = useContext(Context)
  //////////////////////////////////////////////////////////////

  const [list, setPosts] = useState([])
  //방송리스트 map
  const [listM, setPostsM] = useState([])
  //맴버리스트 map
  const [filter, setFilter] = useState('')
  const [filterM, setFilterM] = useState('')
  //온체이지 글자
  const [show, setShow] = useState(true)
  //검색결과

  //검색 api호출및 필터 벨류 저장
  async function fetchData() {
    const res = await API.member_search({
      params: {
        search: filter,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      if (res.data) {
        setPosts(res.data.list)
        setShow(true)
      }
      console.log(res)
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

  const ShowFilter2 = list.map((item, index) => {
    if (filterM.length > 1) {
      if (item.nickNm.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
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

  //---------------------------------------------------------------------

  //---------------------------------------------------------------------
  return (
    <Wrap>
      {props.children}
      <SearchBar>
        <input
          value={(filter, filterM)}
          onKeyDown={searchOnKeyDown}
          onChange={e => (setFilter(e.target.value), setFilterM(e.target.value), setShow(false))}
          placeholder="검색어를 2자 이상 입력해주세요"
        />
        <Icon
          onClick={() => {
            ShowClick()
          }}></Icon>
      </SearchBar>
      {show === false && <NoResult {...props} />}
      {show && ShowFilter2}
    </Wrap>
  )
}
const Wrap = styled.div`
  position: relative;
  & .titleBox {
    display: flex;
    padding: 48px 0 25px 0;
    margin-bottom: 12px;
    font-size: 20px;
    border-bottom: 1px solid ${COLOR_MAIN};
    & h2 {
      font-size: 20px;
      color: ${COLOR_MAIN};
      margin-right: 10px;
    }
    & h3 {
      font-size: 20px;
      color: #757575;
    }
  }
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
        background: url(${IMG_SERVER}/images/api/ico_plus_p.png);
      }
    }
  }
`
const SearchBar = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  display: flex;
  width: 470px;
  height: 48px;
  border-style: solid;
  border-color: #8556f6;
  border-width: 1px;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 10px;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 70%;
  }
  & input {
    width: 95%;
    height: 100%;
    font-size: 16px;
    font-weight: normal;
    line-height: 1;
    letter-spacing: -0.6px;
    text-align: left;
    color: #bdbdbd;
    outline: none;
  }
`
const Icon = styled.button`
  display: flex;
  width: 36px;
  height: 36px;
  background: url('https://image.dalbitcast.com/svg/ic_search_normal.svg') no-repeat center center / cover;
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
      background: url(${IMG_SERVER}/images/api/ic_headphone_s.png) no-repeat center center / cover;
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
      background: url(${IMG_SERVER}/images/api/ico-like-g-s.png) no-repeat center center / cover;
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
    background: url(${IMG_SERVER}/images/api/ic_live.png) no-repeat center center / cover;
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

//------------------------------------------------------------------
