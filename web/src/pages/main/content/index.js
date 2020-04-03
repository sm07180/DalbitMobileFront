/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET_S, WIDTH_TABLET, WIDTH_PC_S} from 'context/config'
//context
import {COLOR_MAIN} from 'context/color'
import {Context} from 'context'
import Api from 'context/api'
import MainSlider from './main-slider'
import StarRangking from './ranking'
import MyStar from './my-star'
import ContentList from './live'
//components
const Main = props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [fetch, setFetch] = useState(null)
  const [fetch1, setFetch1] = useState(null)
  //임시 데이터

  //---------------------------------------------------------------------

  //fetch (메인상단)
  async function fetchData1() {
    const res = await Api.recommand()
    if (res.result === 'success') {
      setFetch1(res.data)
    }
  }
  //fetch (내 스타 영역.. 로그인시에만 보여줌)
  async function fetchData(obj) {
    const res = await Api.my_dj({...obj})
    if (res.result === 'success') {
      setFetch(res.data.list)
    }
  }
  const makeSlider = () => {
    if (fetch1 === null || fetch1 === undefined) return
    //데이터가공
    let data = []

    fetch1.map((list, idx) => {
      let obj = {}
      obj.roomNo = list.roomNo
      obj.memNo = list.memNo
      obj.listeners = list.listeners
      obj.likes = list.likes
      obj.title = list.title
      obj.nickNm = list.nickNm
      obj.url = list.profImg.thumb336x336
      data[idx] = obj
    })
    const obj = data.concat(data).concat(data)
    return <MainSlider Info={obj} />
  }
  //---------------------------------------------------------------------
  useEffect(() => {
    //내 스타 영역.. 로그인시에만 보여줌
    fetchData()
    fetchData1()
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content {...props}>
      {/* 메인 최상단 슬라이드 */}
      {makeSlider()}

      {/* 스타 랭킹 영역 */}
      <RangkingWrap>
        <StarRangking {...props} />
      </RangkingWrap>
      {/* 내 스타 영역.. 로그인시에만 보여줌 */}
      {context.token.isLogin && fetch !== null && fetch.length !== 0 && (
        <SectionWrap>
          <MyStar Info={fetch} />
        </SectionWrap>
      )}

      {/* 라이브 list 영역, 캐스트 list 영역 */}
      <SectionWrap>
        <ContentList type="live" />
      </SectionWrap>
    </Content>
  )
}
export default Main

//---------------------------------------------------------------------
// styled
const Content = styled.div`
  background: #fff;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    background: ${COLOR_MAIN};
    z-index: -4;
    content: '';
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    &:before {
      height: 200px;
    }
  }
`
const RangkingWrap = styled.section``

const SectionWrap = styled.section`
  position: relative;
  width: 1464px;
  margin: 0 auto;
  border-top: 1px solid ${COLOR_MAIN};
  &:after {
    display: none;
    position: absolute;
    top: -1px;
    right: 0;
    width: 2.5%;
    height: 1px;
    background: #fff;
    content: '';
  }

  @media (max-width: 1480px) {
    width: 95%;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 97.5%;
    margin: 0 0 0 2.5%;
    &:after {
      display: block;
    }
  }
`
