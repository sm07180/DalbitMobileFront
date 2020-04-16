/**
 * @file /ranking/content/rankList.js
 * @brief 랭킹 리스트 컴포넌트
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import qs from 'query-string'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import likeIcon from '../static/ico_like_g.svg'
import peopleIcon from '../static/ic_people.svg'

//component
import Figure from './Figure'

export default props => {
  //---------------------------------------------------------------------
  const {webview} = qs.parse(location.search)
  //context
  const context = useContext(Context)
  const MyMemNo = context.profile && context.profile.memNo
  const rankType = props.rankType
  console.log('rankTyperankType', rankType)
  //---------------------------------------------------------------------
  //map
  const creatList = () => {
    return props.list.map((item, index) => {
      const {rank, level, nickNm, profImg, memNo, likes, listeners} = item
      let rankName
      let link = ''
      if (webview) {
        link = MyMemNo !== memNo ? `/mypage/${memNo}/initial?webview=${webview}` : `/menu/profile`
      } else {
        link = MyMemNo !== memNo ? `/mypage/${memNo}` : `/menu/profile`
      }
      if (rank == 1 || rank == 2 || rank == 3) {
        rankName = `medal top${rank}`
      }
      return (
        <li key={index} className={rankType}>
          <h3 className={rankName}>
            <span>{rank}</span>
          </h3>
          <Figure url={profImg.thumb120x120} memNo={memNo} link={link} />
          <div
            onClick={() => {
              window.location.href = link
            }}>
            <strong>Lv {level}</strong>
            <p>{nickNm}</p>
            {rankType == 'dj' && (
              <>
                <span>
                  <img src={peopleIcon} />
                  {listeners}
                </span>
                <span>
                  <img src={likeIcon} />
                  {likes}
                </span>
              </>
            )}
          </div>
          {/* <button>팬 +</button> */}
        </li>
      )
    })
  }
  //---------------------------------------------------------------------
  return <RankList>{creatList()}</RankList>
}
//---------------------------------------------------------------------

const Contents = styled.div``

const RankList = styled.ul`
  margin-top: 20px;
  border-top: 1px solid ${COLOR_MAIN};

  li {
    display: flex;
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;

    & > * {
      flex: 0 0 auto;
    }

    h3 {
      flex-basis: 80px;
      line-height: 80px;
      text-align: center;
      span {
        display: inline-block;
        width: 32px;
        line-height: 32px;
        border-radius: 50%;
        background: #424242;
        color: #fff;
        font-size: 14px;
        font-weight: 800;
        vertical-align: middle;
        transform: skew(-0.03deg);
        z-index: -1;
      }

      &.medal {
        span {
          padding-top: 20px;
          background: none;
        }
      }
      &.top1 {
        background: url(${IMG_SERVER}/images/api/ic_r_gold.png) no-repeat center center;
      }
      &.top2 {
        background: url(${IMG_SERVER}/images/api/ic_r_silver.png) no-repeat center center;
      }
      &.top3 {
        background: url(${IMG_SERVER}/images/api/ic_r_bronze.png) no-repeat center center;
      }
    }

    &.fan {
      div {
        padding: 8px 0;
      }
    }

    div {
      overflow: hidden;
      width: calc(100% - 200px);
      cursor: pointer;
      padding: 15px 0 13px 0;
      strong {
        display: inline-block;
        color: ${COLOR_MAIN};
        font-size: 16px;
        font-weight: 800;
        transform: skew(-0.03deg);
      }
      p {
        overflow: hidden;
        width: 100%;
        margin-top: 10px;
        line-height: 18px;
        text-overflow: ellipsis;
        white-space: nowrap;
        transform: skew(-0.03deg);
      }
      span {
        font-size: 12px;
        line-height: 18px;
        img {
          vertical-align: top;
          margin-top: 4px;
          padding-right: 2px;
        }
      }

      span + span {
        padding-left: 8px;
        img {
          padding-right: 0;
        }
      }
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    li {
      padding: 5px 5px;
      h3 {
        flex-basis: 42px;
        height: 65px;
        line-height: 65px;
        background-size: 26px !important;

        span {
          width: 24px;
          line-height: 24px;
          font-size: 10px;
        }

        &.medal span {
          padding-top: 14px;
        }
      }

      div {
        width: calc(100% - 125px);
        padding: 0;
        strong {
          margin-top: 4px;
          font-size: 14px;
        }
        p {
          margin-top: 0;
          font-size: 14px;
        }
      }
    }
  }
`
