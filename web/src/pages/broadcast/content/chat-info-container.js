/**
 * @title 채팅 ui 상단 정보들 나타내는 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Scrollbars} from 'react-custom-scrollbars'
//context
import Api from 'context/api'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //state
  //const
  const {bjHolder, fanRank, bgImg, title, bjProfImg, rank, bjNickNm, likes} = {...props}
  console.log('랭크', fanRank)

  //---------------------------------------------------------------------
  //fetch
  async function fetchData() {
    const res = await Api.broad_info({
      params: {
        roomNo: props.roomNo
      }
    })
    setFetch({...fetch, ...res.data})
    console.log('방정보는', res)
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])

  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="dj-info">
        <Figure src={bjProfImg.url} holder={bjHolder} title={bjNickNm} className="dj">
          <img src={bjProfImg.url} alt={bjNickNm} />
        </Figure>
        <div>
          <p>{bjNickNm}</p>
          <p>{title}</p>
        </div>
        <ul>
          <li>
            <Figure src={fanRank[0].profImg.url} title={fanRank[0].nickNm}>
              <img src={fanRank[0].profImg.url} alt={fanRank[0].nickNm} />
            </Figure>
          </li>
          <li>
            <Figure src={fanRank[1].profImg.url} title={fanRank[1].nickNm}>
              <img src={fanRank[1].profImg.url} alt={fanRank[1].nickNm} />
            </Figure>
          </li>
          <li>
            <Figure src={fanRank[2].profImg.url} title={fanRank[2].nickNm}>
              <img src={fanRank[2].profImg.url} alt={fanRank[2].nickNm} />
            </Figure>
          </li>
          <li>13.5K</li>
        </ul>
      </div>
      <div className="cast-info">
        <ul>
          <li>85</li>
          <li>850</li>
          <li>00:30:00</li>
        </ul>
        <div>
          <button>메시지</button>
          <button>알람</button>
        </div>
      </div>
      <div className="option">
        <ul>
          <li>TOP 12</li>
          <li>추천</li>
          <li>인기</li>
          <li>신입</li>
        </ul>
        <button className="invite">게스트 초대</button>
      </div>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.div`
  position: relative;
  padding: 10px;

  .dj-info {
    display: flex;
    position: relative;
    & > * {
      flex: 0 0 auto;
    }
    img {
      display: none;
    }
    /* DJ 이미지*/
    & > figure {
      flex-basis: 60px;
      height: 60px;
      margin: 11px;
      border-radius: 50%;
    }
    /* DJ 이름, 방송 제목 */
    div {
      flex-grow: 1;
      flex-basis: auto;
      padding: 18px 0 18px 12px;
      p {
        overflow: hidden;
        width: 100%;
        color: #fff;
        text-overflow: ellipsis;
        /* white-space: nowrap; */
        letter-spacing: -0.45px;

        &:first-child {
          font-size: 18px;
        }
        &:last-child {
          font-size: 16px;
          transform: skew(-0.03deg);
        }
      }
    }
    /* 팬랭킹 */
    ul {
      flex-basis: 200px;
      padding: 16px 0;
      li {
        display: inline-block;
        position: relative;
        vertical-align: top;
      }
      figure {
        width: 48px;
        height: 48px;
        border-radius: 50%;
      }
      li:nth-child(-n + 3):after {
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        width: 18px;
        height: 18px;
        content: '';
      }
      li:nth-child(1):after {
        background: url(${IMG_SERVER}/images/chat/ic_gold.png) no-repeat 0 0 / cover;
      }
      li:nth-child(2):after {
        background: url(${IMG_SERVER}/images/chat/ic_silver.png) no-repeat 0 0 / cover;
      }
      li:nth-child(3):after {
        background: url(${IMG_SERVER}/images/chat/ic_bronze.png) no-repeat 0 0 / cover;
      }
      li:nth-child(4) {
        width: 47px;
        height: 47px;
        border-radius: 50%;
        border: 1px solid rgba(255, 2555, 255, 0.7);
        background: url(${IMG_SERVER}/images/chat/ic_fan.png) no-repeat center 8px;
        background-size: 13px;
        color: rgba(255, 2555, 255, 0.7);
        font-size: 13px;
        line-height: 60px;
        text-align: center;
        transform: skew(-0.03deg);
      }
      li + li {
        margin-left: 3px;
      }
    }
  }

  .cast-info {
  }

  .option {
  }
`

const Figure = styled.figure`
  position: relative;
  background: url(${props => props.src}) no-repeat center center / cover;
  cursor: pointer;

  &.dj:after {
    display: block;
    position: absolute;
    left: -10px;
    top: -10px;
    width: 82px;
    height: 82px;
    background: url(${props => props.holder}) no-repeat 0 0 / cover;
    content: '';
  }
`
