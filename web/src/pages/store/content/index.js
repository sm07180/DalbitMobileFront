/**
 * @file /store/index.js
 * @brief 스토어
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

export default (props) => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  const {profile} = context

  //useState
  const [list, setList] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [listState, setListState] = useState(-1)
  const [showAdmin, setShowAdmin] = useState(false)
  const [mydal, setMydal] = useState('0')

  //---------------------------------------------------------------------
  const fetchAdmin = async () => {
    const adminFunc = await Api.getAdmin()
    if (adminFunc.result === 'success') {
      if (adminFunc.data.isAdmin === true) {
        setShowAdmin(true)
      }
    } else if (adminFunc.result === 'fail') {
      setShowAdmin(false)
    }
  }

  async function getStoreList() {
    const res = await Api.store_list({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      setList(res.data.list)
      setListState(1)
      setMydal(res.data.dalCnt)
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
            className={[`item ${selected.num == index ? 'on' : 'off'}`]}
            key={item.itemNo}
            iosprice={item.iosPrice}
            onClick={() => {
              if (selected.num == index) {
                setSelected(-1)
              } else {
                setSelected({
                  num: index,
                  name: item.itemNm,
                  price: item.salePrice,
                  itemNo: item.itemNo
                })
              }
            }}>
            <div className="img-wrap">
              <p>{item.itemNm}</p>
              <img src={item.img}></img>
            </div>
            <p className="price">{Utility.addComma(item.salePrice)}원</p>
          </div>
        )
      })
    }
  }

  function chargeClick() {
    if (context.token.isLogin) {
      /*if (__NODE_ENV === 'real') {
        context.action.updatePopup('CHARGE', {
          name: selected.name,
          price: selected.price,
          itemNo: selected.itemNo,
          isState: 'charge'
        })
      } else {*/
      // Test ing...
      props.history.push({
        pathname: '/charge',
        state: {
          paymentName: selected.name,
          paymentPrice: selected.price,
          itemNo: selected.itemNo,
          isState: 'charge'
        }
      })
      /*}*/
    } else {
      window.location.href = '/login'
    }
  }

  const creatResult = () => {
    if (listState == -1) {
      return null
    } else if (listState == 0) {
      return <NoResult />
    } else if (listState == 1) {
      return (
        <>
          <div className="item-list">{creatList()}</div>
          <div className="btn-wrap">
            <button
              className="cancel"
              onClick={() => {
                window.history.back()
              }}>
              취소
            </button>
            <button onClick={chargeClick} className="charge" disabled={selected == -1 ? true : false}>
              결제하기
            </button>
          </div>
        </>
      )
    }
  }

  //useEffect
  useEffect(() => {
    fetchAdmin()
    getStoreList()
  }, [])

  //---------------------------------------------------------------------
  return (
    <Content>
      <p className="mydal">
        보유 달 <span>{mydal.toLocaleString()}</span>
      </p>
      {creatResult()}
    </Content>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  .mydal {
    padding: 16px 0 8px 0;
    font-size: 16px;
    font-weight: bold;
    span {
      color: ${COLOR_MAIN};
    }
  }
  .btn-wrap {
    display: flex;
    margin-top: 10px;
    button {
      width: 50%;
      height: 44px;
      background: #757575;
      border-radius: 12px;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      line-height: 44px;
      &.charge {
        margin-left: 4px;
        background: ${COLOR_MAIN};
      }
    }
  }
  .item-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      width: calc(33.333% - 3px);
      padding: 1px;
      margin-bottom: 13px;
      border-radius: 12px;
      text-align: center;
      &.on {
        background: ${COLOR_MAIN};
        .price {
          color: #fff;
        }
      }
      .img-wrap {
        padding: 9px 0 4px 0;
        border-radius: 12px;
        background: #fff;
        p {
          padding-bottom: 2px;
          font-size: 12px;
          font-weight: bold;
        }
        img {
          width: 80px;
          height: 80px;
        }
      }
      .price {
        font-size: 16px;
        font-weight: bold;
        line-height: 32px;
      }
    }
  }
`