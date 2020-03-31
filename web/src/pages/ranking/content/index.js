/**
 * @file /ranking/content/index.js
 * @brief 랭킹
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import _ from 'lodash'

//component
import RankList from './rankList'
import Figure from './Figure'

const rankArray = ['dj', 'fan']
const dateArray = ['전일', '주간', '월간']

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  //state
  const [rankType, setRankType] = useState('dj')
  const [dateType, setDateType] = useState(1)
  const [list, setList] = useState(false)

  //---------------------------------------------------------------------
  //map
  const createRankButton = () => {
    return rankArray.map((item, index) => {
      return (
        <button
          key={index}
          className={rankType == item ? 'on' : 'off'}
          onClick={() => {
            setRankType(item)
            fetch(item, dateType)
          }}>
          {item == 'dj' ? '달D랭킹' : '팬랭킹'}
        </button>
      )
    })
  }
  const createDateButton = () => {
    return dateArray.map((item, index) => {
      ++index
      return (
        <button
          key={index}
          className={dateType == index ? 'on' : 'off'}
          onClick={() => {
            setDateType(index)
            fetch(rankType, index)
          }}>
          {item}
        </button>
      )
    })
  }

  const creatMyRank = () => {
    const {profImg, level, nickNm, memNo} = context.profile
    return (
      <div className="my-rank">
        <h3>
          <span>100</span>
        </h3>
        <Figure url={profImg.url} memNo={memNo} />
        <div>
          <strong>Lv {level}</strong>
          <p>{nickNm}</p>
        </div>
      </div>
    )
  }
  //---------------------------------------------------------------------
  //fetch
  async function fetch(type, dateType) {
    let res = ''
    if (type == 'dj') {
      res = await Api.get_dj_ranking({
        params: {
          rankType: dateType,
          page: 1,
          records: 10
        }
      })
    } else if (type == 'fan') {
      res = await Api.get_fan_ranking({
        params: {
          rankType: dateType,
          page: 1,
          records: 10
        }
      })
    }
    if (res.result === 'success' && _.hasIn(res, 'data.list')) {
      if (res.data.list == false) {
        //조회 결과값 없을경우 res.data.list = [] 으로 넘어옴
        setList(false)
      } else {
        setList(res.data.list)
      }
    } else {
      context.action.alert({
        msg: res.massage
      })
    }
  }

  //---------------------------------------------------------------------
  useEffect(() => {
    fetch(rankType, dateType)
  }, [])

  //---------------------------------------------------------------------
  return (
    <Contents>
      <h2>랭킹</h2>
      <div className="filter">
        <div className="rank-type">{createRankButton()}</div>
        <div className="date-type">{createDateButton()}</div>
      </div>
      {context.profile && creatMyRank()}
      {list ? (
        <RankList list={list} />
      ) : (
        <NoResult>
          <span>조회된 결과가 없습니다.</span>
        </NoResult>
      )}
    </Contents>
  )
}
//---------------------------------------------------------------------

const Contents = styled.div`
  width: 1210px;
  min-height: 300px;
  margin: 0 auto;
  padding: 40px 0 120px 0;
  h2 {
    padding-bottom: 60px;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }

  /* 상단 filter 버튼들 */
  .filter {
    display: flex;
    justify-content: space-between;
    & > div {
      button {
        line-height: 40px;
      }
      &.rank-type button {
        color: #bdbdbd;
        font-size: 20px;
        &.on {
          color: #424242;
          font-weight: 800;
        }
      }
      &.rank-type button + button {
        margin-left: 15px;
      }
      &.date-type button {
        width: 68px;
        border: 1px solid #e5e5e5;
        border-radius: 40px;
        color: #757575;

        &.on {
          border-color: ${COLOR_MAIN};
          color: ${COLOR_MAIN};
        }
      }
      &.date-type button + button {
        margin-left: 6px;
      }
    }
  }

  /* 내 랭킹 */
  .my-rank {
    display: flex;
    margin-top: 18px;
    padding: 12px;
    border-radius: 10px;
    background: #f5f5f5;

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
    }

    div {
      overflow: hidden;
      width: calc(100% - 200px);
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
        line-height: 24px;
        text-overflow: ellipsis;
        white-space: nowrap;
        transform: skew(-0.03deg);
      }
    }
  }

  @media (max-width: 1260px) {
    width: 95%;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    h2 {
      padding-bottom: 26px;
      font-size: 24px;
    }
    .filter {
      & > div {
        button {
          line-height: 30px;
        }
        &.rank-type button {
          font-size: 16px;
        }
        &.date-type button {
          width: 48px;
          font-size: 14px;
        }
      }
    }
    .my-rank {
      padding: 15px 0;
      h3 {
        flex-basis: 42px;
        height: 65px;
        line-height: 65px;
        background-size: 30px !important;
        span {
          width: 24px;
          line-height: 24px;
          font-size: 10px;
        }
      }

      div {
        width: calc(100% - 125px);
        padding: 11px 0 9px 0;
        strong {
          font-size: 14px;
        }
        p {
          margin-top: 2px;
          font-size: 14px;
        }
      }
    }
  }
`

const NoResult = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100% !important;
  margin-top:60px;
  padding-top:230px;
  background: url('${IMG_SERVER}/images/api/img_noresult.png') no-repeat center top;

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
      font-size: 18px;
      margin-top: 20px;
    }
  }
`
