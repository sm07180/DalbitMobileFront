/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
import Api from 'context/api'

//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//components

export default props => {
  //state
  const [rankingType, setRankingType] = useState('dj')
  const [djInfo, setDjInfo] = useState([])
  const [fanInfo, setFanInfo] = useState([])

  //api

  const fetch = async () => {
    const resDj = await Api.get_dj_ranking({
      params: {
        rankType: 1,
        page: 1,
        records: 5
      }
    })
    if (resDj.result === 'success') {
      setDjInfo(resDj.data.list)
    } else {
      console.log('실패', resDj.result)
    }

    const resfan = await Api.get_fan_ranking({
      params: {
        rankType: 1,
        page: 1,
        records: 5
      }
    })
    if (resfan.result === 'success') {
      setFanInfo(resfan.data.list)
    } else {
      console.log('실패', resfan.result)
    }
  }

  let rankingSlider = {}
  const params = {
    slidesPerView: 'auto',
    spaceBetween: 6,
    //freeMode: true,
    resistanceRatio: 0,
    breakpoints: {
      360: {
        spaceBetween: 12
      }
    }
  }

  //map
  const createSlide = (array, type) => {
    return array.map((item, index) => {
      const rankClass = `nth${item.rank}`

      return (
        <RankingItem
          key={index}
          className={rankClass}
          onClick={() => {
            props.history.push('/')
          }}>
          <ImgBox url={item.profImg.url}>
            <img src={item.profImg.url}></img>
            <p>{item.rank}</p>
          </ImgBox>
          <h2>{item.nickNm}</h2>
          {type == 'dj' && (
            <State>
              <span>500</span>
              <span>1200</span>
            </State>
          )}
        </RankingItem>
      )
    })
  }

  //function
  const handleTypeChange = e => {
    setRankingType(e.target.name)
  }

  //useEffect
  useEffect(() => {
    fetch()
  }, [])

  return (
    <Content>
      <div className="top-wrap">
        <div className="title-btn">
          <h2>랭킹</h2>
          <span
            onClick={() => {
              props.history.push('/ranking')
            }}>
            plus
          </span>
        </div>
        <div className="change-btn">
          <button name="dj" className={`${rankingType == 'dj' ? 'on' : 'off'}`} onClick={handleTypeChange}>
            DJ
          </button>
          <button name="fan" className={`${rankingType == 'fan' ? 'on' : 'off'}`} onClick={handleTypeChange}>
            팬
          </button>
        </div>
      </div>
      <RankingWrap>
        <PcWrap>{rankingType == 'dj' ? createSlide(djInfo, 'dj') : createSlide(fanInfo, 'fan')}</PcWrap>
        <MobileWrap>
          <Swiper
            {...params}
            getSwiper={e => {
              rankingSlider = e
            }}>
            {rankingType == 'dj' ? createSlide(djInfo, 'dj') : createSlide(fanInfo, 'fan')}
          </Swiper>
        </MobileWrap>
      </RankingWrap>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.div`
  position: relative;
  width: 1464px;
  margin: 0 auto;
  padding: 60px 0 80px 0;
  border-top: 1px solid ${COLOR_MAIN};
  text-align: center;

  .top-wrap {
    display: flex;
    & .title-btn {
      line-height: 36px;
      text-align: left;
      & h2 {
        display: inline-block;
        margin-right: 18px;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.85px;
        color: ${COLOR_MAIN};
      }
      & span {
        display: inline-block;
        width: 36px;
        height: 36px;
        font-size: 0;
        background: url(${IMG_SERVER}/images/api/ico-more-p.png) no-repeat center center / cover;
        vertical-align: top;
        cursor: pointer;
      }
    }
    & .change-btn {
      margin: 0 0 0 auto;

      button {
        width: 80px;
        border-radius: 34px;
        font-size: 20px;
        line-height: 34px;

        &.on {
          border: 1px solid ${COLOR_MAIN};
          color: ${COLOR_MAIN};
        }
        &.off {
          border: 1px solid #e0e0e0;
          color: #9e9e9e;
        }
      }
      button + button {
        margin-left: 5px;
      }
    }
  }

  @media (max-width: 1480px) {
    width: 97.5%;
    margin: 0 0 0 2.5%;
    padding: 40px 0 60px 0;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    .top-wrap {
      margin-right: 2.5%;
      .title-btn {
        h2 {
          font-size: 22px;
        }
      }

      .change-btn {
        button {
          width: 60px;
          font-size: 16px;
          line-height: 30px;
        }
      }
    }
  }
`

const RankingWrap = styled.div`
  margin-top: 37px;
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 20px;
  }

  /* .nth1 p {
    position: relative;
    width: 60px;
    margin-top: -30px;
    padding: 9px 0 7px 0;
    background: ${COLOR_MAIN};
    font-size: 37px;
    font-weight: 800;

    &:before {
      display: block;
      position: absolute;
      top: -26px;
      left: calc(50% - 21px);
      width: 42px;
      height: 34px;
      background: url(${IMG_SERVER}/svg/ico-crown.svg) no-repeat center / cover;
      content: '';
    } */

    /* @media (max-width: ${WIDTH_MOBILE}) {
      margin-top: -22px;
      width: 44px;
      padding: 0;
      font-size: 28px;

      &:before {
        top: -20px;
        left: calc(50% - 17px);
        width: 34px;
        height: 28px;
      }
    } */
  }
  .nth1 p {
    background: ${COLOR_MAIN};
  }

  .nth2 p {
    background: ${COLOR_POINT_P};
  }
  .nth3 p {
    background: ${COLOR_POINT_Y};
  }
`

const PcWrap = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: ${WIDTH_PC_S}) {
    display: none;
  }
`

const MobileWrap = styled.div`
  display: none;
  .swiper-slide {
    width: 30%;
  }
  @media (max-width: ${WIDTH_PC_S}) {
    display: block;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    .swiper-slide {
      width: 40%;
    }
    .swiper-container {
      padding-right: 2.5%;
    }
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    .swiper-slide {
      width: 65%;
    }
  }
`

const RankingItem = styled.div`
  /* width: 32.3%; */
  width:19.12%
  text-align: center;
  cursor:pointer;

  & + &{
    margin-left:1.1%;
    @media (max-width: ${WIDTH_PC_S}) {
      margin:0;
    }
  }

  p {
    width: 56px;
    border-radius: 0 0 15px 0;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    line-height: 56px;
  }
  h2 {
    overflow: hidden;
    margin-top: 40px;
    color: #424242;
    font-size: 24px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    p{
      width:40px;
      font-size:20px;
      line-height:40px;
    }
    h2{
      margin-top:25px;
      font-size:18px;
    }
  }
`

const ImgBox = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 280px;
  background: url(${props => props.url}) no-repeat center center / cover;
  text-align: left;
  z-index: -1;
  span {
    display: inline-block;
    padding: 0 11px;
    background: #fff;
    color: ${COLOR_POINT_P};
    font-size: 14px;
    line-height: 28px;
  }
  img {
    position: absolute;
    left: 0;
    top: 0;
    height: 0;
    z-index: -1;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 260px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    /* height: 260px; */
  }
  @media (max-width: ${WIDTH_MOBILE_S}) {
    height: 180px;
  }
`

const State = styled.div`
  margin-top: 20px;

  @media (max-width: ${WIDTH_MOBILE}) {
    margin-top: 15px;
  }

  span {
    display: inline-block;
    color: #9e9e9e;
    line-height: 26px;
  }

  span:first-child {
    padding-left: 44px;
    background: url(${IMG_SERVER}/images/api/ic_moon_y@2x.png) no-repeat left center;
    background-size: 36px;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding-left: 29px;
      background-size: 22px;
    }
  }
  span:last-child {
    padding-left: 38px;
    background: url(${IMG_SERVER}/svg/ico-like-r-m.svg) no-repeat left center;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding-left: 26px;
      background-size: 23px;
    }
  }
  span:first-child::after {
    display: inline-block;
    width: 1px;
    height: 16px;
    margin: 0 15px -2px 19px;
    background: #e0e0e0;
    content: '';
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 14px;
      margin: 0 10px -2px 13px;
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 10px;
    span {
      font-size: 14px;
      background-size: 24px !important;
    }
    span:first-child {
      padding-left: 28px;
    }
    span:first-child:after {
      margin: 0 10px -3px 14px;
    }
    span:last-child {
      padding-left: 26px;
    }
  }
`
