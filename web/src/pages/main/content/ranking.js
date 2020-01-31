/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React from 'react'
import styled from 'styled-components'

//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER} from 'context/config'

//components

export default props => {
  return (
    <Content>
      <h1>랭킹</h1>
      <RankingWrap>
        <RankingItem>
          <ImgBox>
            <img src="https://devimage.dalbitcast.com/images/api/tica034m19020284.jpg"></img>
            <span>추천</span>
          </ImgBox>
          <p>1</p>
          <h2>박+룰루 소리부자</h2>
          <State>
            <span>4,693</span>
            <span>16,520</span>
          </State>
        </RankingItem>
        <RankingItem>
          <ImgBox>
            <img src="https://devimage.dalbitcast.com/images/api/tica034j16080551.jpg"></img>
            <span>추천</span>
          </ImgBox>
          <p>2</p>
          <h2>나른 새벽 함께 해요</h2>
          <State>
            <span>4,693</span>
            <span>16,520</span>
          </State>
        </RankingItem>
        <RankingItem>
          <ImgBox>
            <img src="https://devimage.dalbitcast.com/images/api/ti375a8312.jpg"></img>
            <span>추천</span>
          </ImgBox>
          <p>3</p>
          <h2>어닝 [팬 모집중]</h2>
          <State>
            <span>4,693</span>
            <span>16,520</span>
          </State>
        </RankingItem>
      </RankingWrap>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.div`
  position: relative;
  width: 904px;
  margin: 77px auto 100px auto;
  text-align: center;
  h1 {
    color: ${COLOR_MAIN};
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.85px;
  }

  &:before {
    position: absolute;
    top: -77px;
    left: 50%;
    width: 1px;
    height: 40px;
    background: ${COLOR_MAIN};
    content: '';
  }
`
const RankingWrap = styled.div`
  display: flex;
  margin-top: 37px;
  justify-content: space-between;
`

const RankingItem = styled.div`
  width: 32.3%;
  text-align: center;

  p {
    width: 44px;
    margin: -22px auto 32px auto;
    border-radius: 50%;
    background: ${COLOR_POINT_P};
    color: #fff;
    font-size: 28px;
    font-weight: 600;
    line-height: 44px;
  }
  h2 {
    overflow: hidden;
    color: #424242;
    font-size: 24px;
    font-weight: 600;
  }
`

const ImgBox = styled.div`
  overflow: hidden;
  position:relative;
  width: 100%;
  height: 292px;
  padding: 4px;
  text-align:left;
  /* height: 190px;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover; */
  span{
    display:inline-block;
    padding:0 11px;
    background:#fff;
    color:${COLOR_POINT_P}
    font-size:14px;
    line-height: 28px;
  }
  img{
    position:absolute;
    left:0;
    top:0;
    z-index:-1;
  }
`

const State = styled.div`
  margin-top: 20px;

  span {
    display: inline-block;
    color: #9e9e9e;
    line-height: 26px;
  }

  span:first-child {
    padding-left: 44px;
    background: url(${IMG_SERVER}/svg/ico-gold.svg) no-repeat left center;
  }
  span:last-child {
    padding-left: 38px;
    background: url(${IMG_SERVER}/svg/ico-like-r-m.svg) no-repeat left center;
  }
  span:first-child::after {
    display: inline-block;
    width: 1px;
    height: 16px;
    margin: 0 15px -2px 19px;
    background: #e0e0e0;
    content: '';
  }
`
