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
              <img src={item.itemThumbnail}></img>
              <p>달 {item.dalCnt}</p>
            </div>
            <p className="item-name">{item.byeolCnt}</p>
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
          <button onClick={chargeClick} className="charge-btn" disabled={selected == -1 ? true : false}>
            교환하기
          </button>
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
      <p className="mydal">보유 별 {mydal.toLocaleString()}</p>
      {creatResult()}
    </Content>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  width: 1040px;
  min-height: 300px;
  margin: 0 auto;
  padding: 40px 0 120px 0;

  .charge-btn {
    display: block;
    width: 328px;
    margin: 70px auto 0 auto;
    border-radius: 5px;
    background: ${COLOR_MAIN};
    color: #fff;
    line-height: 50px;
    &:disabled {
      background: #bdbdbd;
      color: #fff;
    }
  }

  .mydal {
    margin-bottom: 12px;
    color: #424242;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    text-align: right;
    transform: skew(-0.03deg);
    &:before {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-top: 2px;
      padding-right: 5px;
      vertical-align: top;
      background: url(${starIcon}) no-repeat;
      content: '';
    }
  }

  .item-name {
    &:before {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-top: 5px;
      padding-right: 1px;
      vertical-align: top;
      background: url(${starIcon}) no-repeat;
      content: '';
    }
  }

  @media (max-width: 1060px) {
    width: 100%;
    padding: 10px 0 0 0;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    h2 {
      padding-bottom: 26px;
      font-size: 24px;
    }
    .mydal {
      font-size: 14px;
      line-height: 24px;
      transform: skew(-0.03deg);
      &:before {
        width: 24px;
        height: 24px;
        margin-top: -1px;
        padding-right: 3px;
        background-size: 24px;
      }
    }
    .charge-btn {
      width: 100%;
      margin-top: 10px;
      border-radius: 10px;
      font-size: 14px;
      line-height: 48px;
    }
  }
`

const List = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding-top: 60px;

  .wrap {
    width: 15%;
    text-align: center;
    cursor: pointer;
    & > p {
      margin-top: 6px;
      border-radius: 8px;
      font-size: 18px;
      color: #424242;
      font-weight: 600;
      line-height: 44px;
      background: #fff;
    }
    &.on > p {
      color: #fff;
      background: ${COLOR_POINT_Y};
    }
  }
  .item-wrap {
    padding: 14px;
    border-radius: 10px;
    border: 1px solid #f5f5f5;
    background: #f5f5f5;
    img {
      width: 100%;
      margin-bottom: 10px;
    }
    p {
      color: #757575;
      font-size: 14px;
      transform: skew(-0.03deg);
    }
    p + p {
      padding-top: 8px;
    }
  }

  .on .item-wrap {
    background: #fff;
    border: 1px solid ${COLOR_POINT_Y};
    p {
      color: ${COLOR_POINT_Y};
      font-weight: 600;
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-wrap: wrap;
    padding-top: 0;
    .wrap {
      width: 32.4%;
      margin-bottom: 16px;

      & > p {
        margin-top: 2px;
        font-size: 14px;
        line-height: 28px;
        transform: skew(-0.03deg);
      }
    }
    .item-wrap {
      padding: 0 0 5px 0;
      img {
        width: calc(100% - 25px);
        margin-bottom: 0px;
      }
      p {
        font-size: 12px;
      }
    }
  }
`
