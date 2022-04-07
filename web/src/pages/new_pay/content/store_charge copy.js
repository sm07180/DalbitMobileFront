/**
 * @route /store
 * @file /pay/content/storeCharge.js
 * @brief 달충전 (구 스토어) 페이지
 *        마이페이지 메뉴 - 달 충전 혹은 마이페이지 - 내지갑 - 달 충전으로 접근 가능
 */
import React, {useEffect, useContext, useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import _ from 'lodash'
import Utility from 'components/lib/utility'
import qs from 'query-string'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN} from 'context/color'

//components
import Header from 'components/ui/new_header'
import NoResult from 'components/ui/noResult'
import LayerPopupWrap from '../../main/component/layer_popup_wrap.js'

/** @deprecated */
export default (props) => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  const {profile} = context
  const history = useHistory()

  let {event} = qs.parse(location.search)
  if (event === undefined) event = 0
  const {selected, setSelected} = props
  //useState
  const [list, setList] = useState(false)
  // const [selected, setSelected] = useState(-1)
  const [listState, setListState] = useState(-1)
  const [showAdmin, setShowAdmin] = useState(false)
  const [mydal, setMydal] = useState('0')
  const [popupData, setPopupData] = useState([])
  const [topbannerData, setTopbannerData] = useState([])

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
      setList(res.data.dalPriceList)
      setListState(1)
      setMydal(res.data.dalCnt)
    } else {
      setListState(0)
      context.action.alert({
        msg: res.message
      })
    }
  }

  async function fetchMainPopupData(arg) {
    const res = await Api.getBanner({
      params: {
        position: arg
      }
    })
    const {result, data, message} = res
    if (result === 'success') {
      if (data) {
        // 상단 배너
        setTopbannerData(data)
      }
    } else {
      context.action.alert({
        msg: message,
        callback: () => {
          context.action.alert({visible: false})
        }
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
                  itemNo: item.itemNo,
                  event: event
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
    const {name, price, itemNo} = selected
    if (context.token.isLogin) {
      if (selected !== -1) {
        history.push({
          pathname: '/pay/charge',
          search: `?name=${name}&price=${price}&itemNo=${itemNo}&event=${event}`
        })
      } else {
        context.action.alert({
          msg: '충전할 상품을 선택해주세요.',
          callback: () => {
            return
          }
        })
      }
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
            <button onClick={chargeClick} className="charge">
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
    // getStoreList()
    // fetchMainPopupData(12)
    fetchMainPopupData(4)
  }, [])

  return (
    <>
      <Header title="달 충전" />
      <Content>
        <div className="bannerBox">
          {topbannerData &&
            topbannerData.map((v, idx) => {
              return (
                <span key={`topbn-${idx}`}>
                  <img src={v.bannerUrl} alt="" />
                </span>
              )
            })}
        </div>
        <div className="dalWrap">
          <label>보유 달</label>
          <span>{mydal.toLocaleString()}</span>
        </div>
        {creatResult()}
        <div className="desc_wrap">
          <strong className="title">환급 안내</strong>
          <p className="list">
            DJ에게 달을 선물하면 <span className="emp">최대 80%</span>가 환급됩니다.
          </p>
        </div>
        {popupData.length > 0 && <LayerPopupWrap data={popupData} setData={setPopupData} />}
      </Content>
    </>
  )
}

const Content = styled.section`
  min-height: calc(100vh - 40px);
  padding: 0 16px;
  background: #eeeeee;
  padding-bottom: 16px;

  .bannerBox {
    padding: 16px 0;
    img {
      width: 100%;
    }
  }

  .dalWrap {
    margin-bottom: 16px;
    padding: 12px 16px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    label {
      font-size: 14px;
      font-weight: bold;
      line-height: 1.14;
    }

    span {
      height: 20px;
      float: right;
      font-size: 18px;
      font-weight: bold;
      line-height: 1.17;
      color: ${COLOR_MAIN};
      &::before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        margin-right: 4px;
        width: 20px;
        height: 20px;
        background: url('https://image.dalbitlive.com/svg/moon_yellow_s.svg') no-repeat 0 0;
      }
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
      .img-wrap .price {
        font-size: 16px;
        font-weight: bold;
        line-height: 32px;
      }
    }
  }
  .desc_wrap {
    padding-top: 25px;
    font-size: 12px;
    .title {
      display: block;
      padding-left: 16px;
      margin-bottom: 8px;
      color: #424242;
    }
    .list {
      position: relative;
      color: #757575;
      padding-left: 16px;
      line-height: 1.6;
      &::before {
        content: '∙';
        position: absolute;
        left: 1px;
        top: 0;
      }
      .emp {
        font-weight: bold;
        color: #FF3C7B;
      }
    }
  }
`
