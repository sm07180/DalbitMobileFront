import React, {useState} from 'react'
import styled from 'styled-components'
import Footer from '../footer'
export default () => {
  const [show, setShow] = useState(false)
  const ToggleBtn = () => {
    show ? setShow(false) : setShow(true)
    console.log(show)
  }

  return (
    <>
      <Wrap>
        <Logo></Logo>
        <Button onClick={ToggleBtn}></Button>
      </Wrap>
      {show && <Child />}
      <CopyRight>Copyrightⓒ2020 by (주)인포렉스. All rights reserved.</CopyRight>
    </>
  )
}

const Child = () => {
  return (
    <InfoWrap>
      <Info>
        <li>
          <span>대표이사</span>박진
        </li>
        <li>
          <span>사업자등록번호</span>409-81-49209
        </li>
        <li>
          <span>통신판매업 신고번호</span>제2004-30호
        </li>
      </Info>
      <Info>
        <li>
          <span>주소</span>서울특별시 강남구 테헤란로83길 18(삼성동) 8층
        </li>
        <li>
          <span>연락처</span>연락처
        </li>
        <li>
          <span>제휴/이벤트</span>inforex @inforex.com
        </li>
      </Info>
    </InfoWrap>
  )
}

const Wrap = styled.div`
  width: 204px;
  height: 36px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: 37.4px auto 0 auto;
`
const Logo = styled.div`
  flex-basis: 71.56%;
  height: 31px;
  background: url('https://devimage.dalbitcast.com/images/api/footerlogo.png') no-repeat center center / cover;
`
const Button = styled.button`
  flex-basis: 17.64%;
  height: 36px;
  background: url('https://devimage.dalbitcast.com/images/api/arrow-top.png') no-repeat center center / cover;
`
const CopyRight = styled.p`
  margin-top: 40px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: -0.35px;
  color: grey;
`

//---------------------------------------------------------------------
const InfoWrap = styled.div`
  margin-top: 22px;
`
const Info = styled.ul`
  font-size: 12px;
  li {
    display: inline-block;
    font-size: 14px;
    line-height: 28px;
    color: #757575;
    span {
      padding-right: 10px;
      color: #bdbdbd;
    }
  }
  li + li {
    margin-left: 20px;
  }
`
