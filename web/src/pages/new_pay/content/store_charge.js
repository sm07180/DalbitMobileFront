/**
 * @route /pay/store
 * @file /pay/content/storeCharge.js
 * @brief 달충전 (구 스토어) 페이지
 *        마이페이지 메뉴 - 달 충전 혹은 마이페이지 - 내지갑 - 달 충전으로 접근 가능
 */
import React, {useEffect, useContext, useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import _ from 'lodash'
import Utility from 'components/lib/utility'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN} from 'context/color'

//components
import Header from 'components/ui/new_header'
import NoResult from 'components/ui/noResult'

export default () => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  const {profile} = context
  const history = useHistory()

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
      const {name, price, itemNo} = selected
      history.push({
        pathname: '/pay/charge',
        search: `?name=${name}&price=${price}&itemNo=${itemNo}`
      })
    } else {
      history.push('/login')
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

  return (
    <>
      <Header title="달 충전" />
      <Content>
        <p className="mydal">
          보유 달 <span>{mydal.toLocaleString()}</span>
        </p>
        {creatResult()}
      </Content>
    </>
  )
}

const Content = styled.section`
  min-height: calc(100vh - 40px);
  padding: 0 16px;
  background: #eeeeee;
  padding-bottom: 16px;
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
      transform: skew(-0.03deg);
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
