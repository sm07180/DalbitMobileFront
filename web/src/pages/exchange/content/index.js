/**
 * @file /exchange/index.js
 * @brief 달 교환 페이지
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import _ from 'lodash'
import Utility from 'components/lib/utility'

import NoResult from 'components/ui/noResult'

import starIcon from '../static/ic_star_s.svg'

export default (props) => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  const {profile} = context

  //useState
  const [list, setList] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [listState, setListState] = useState(-1)
  const [mydal, setMydal] = useState(0)

  //---------------------------------------------------------------------

  async function getStoreList() {
    const res = await Api.getChangeItem({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      setList(res.data.list)
      setListState(1)
      if (_.hasIn(res.data, 'byeolCnt')) setMydal(res.data.byeolCnt)
    } else {
      setListState(0)
      context.action.alert({
        msg: res.message
      })
    }
  }

  //---------------------------------------------------------------------
  //map
  const creatList = () => {
    if (list) {
      return list.map((item, index) => {
        return (
          <div
            className={[`wrap ${selected.num == index ? 'on' : 'off'}`]}
            key={index}
            onClick={() => {
              if (selected.num == index) {
                setSelected(-1)
              } else {
                setSelected({
                  num: index,
                  dal: item.dalCnt,
                  byeol: item.byeolCnt,
                  itemCode: item.itemCode
                })
              }
            }}>
            <div className="item-wrap">
              <p>달 {item.dalCnt}</p>
              <img src={item.itemThumbnail}></img>
            </div>
            <p className="item-name">{item.byeolCnt.toLocaleString()}별</p>
          </div>
        )
      })
    }
  }

  function chargeClick() {
    async function postChange() {
      const res = await Api.postChangeItem({
        data: {
          itemCode: selected.itemCode
        }
      })
      if (res.result === 'success' && _.hasIn(res, 'data')) {
        setMydal(res.data.byeolCnt)
        context.action.alert({
          msg: res.message
        })
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    }

    context.action.confirm({
      msg: `별 ${selected.byeol}을 달 ${selected.dal}으로 \n 교환하시겠습니까?`,
      callback: () => {
        postChange()
      }
    })
  }

  const creatResult = () => {
    if (listState == -1) {
      return null
    } else if (listState == 0) {
      return <NoResult />
    } else if (listState == 1) {
      return (
        <>
          <List>{creatList()}</List>
          <div className="btn-wrap">
            <button onClick={chargeClick} className="charge-btn cancel">
              취소
            </button>
            <button onClick={chargeClick} className="charge-btn" disabled={selected == -1 ? true : false}>
              교환하기
            </button>
          </div>
        </>
      )
    }
  }

  //useEffect
  useEffect(() => {
    getStoreList()
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <p className="mydal">
        보유 별 <span>{mydal.toLocaleString()}</span>
      </p>
      {creatResult()}
    </Content>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  margin: 0 auto;
  width: 100%;
  padding: 10px 16px;

  .btn-wrap {
    display: flex;
    margin-top: 16px;
  }
  .charge-btn {
    width: 49%;
    margin: 0 auto;
    border-radius: 12px;
    background: ${COLOR_MAIN};
    color: #fff;
    line-height: 44px;
    font-weight: bold;
    &.cancel {
      background: #757575;
    }
  }

  .mydal {
    margin: 10px 0 8px 0;
    color: #000;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    transform: skew(-0.03deg);
    span {
      color: #632beb;
      font-weight: normal;
    }
  }
`

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .wrap {
    width: 32.4%;
    margin-bottom: 13px;
    text-align: center;
    cursor: pointer;
    background: #eeeeee;
    &.on {
      background: #632beb;
      border-radius: 12px;
    }
    & > p {
      padding: 6px 0 8px 0;
      line-height: 18px;
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }
    &.on > p {
      color: #fff;
    }
  }
  .item-wrap {
    border-radius: 12px;
    border: 1px solid #f5f5f5;
    background: #fff;
    img {
      padding: 5px;
      width: 100%;
    }
    p {
      padding-top: 8px;
      line-height: 13px;
      color: #000;
      font-size: 12px;
      transform: skew(-0.03deg);
    }
    p + p {
      padding-top: 8px;
    }
  }

  .on .item-wrap {
    border: 1px solid #632beb;
  }
`
