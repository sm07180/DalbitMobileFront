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
import qs from 'query-string'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN} from 'context/color'

//components
import Header from 'components/ui/new_header'
import NoResult from 'components/ui/noResult'
import LayerPopupWrap from '../../main/component/layer_popup_wrap.js'

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

  async function fetchMainPopupData(arg) {
    const res = await Api.getBanner({
      params: {
        position: arg
      }
    })
    const {result, data, message} = res
    if (result === 'success') {
      if (data) {
        setPopupData(
          data.filter((v) => {
            if (Utility.getCookie('popup_notice_' + `${v.idx}`) === undefined) {
              return v
            } else {
              return false
            }
          })
        )
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

  const timeBanner = () => {
    const day = new Date()
    const getTime = day.getHours()
    if (getTime === 9) {
      return <img src="https://image.dalbitlive.com/event/morning_event/morning_banner.png" alt="굿모닝 결제 이벤트" />
    }
    if (getTime === 10) {
      return <img src="https://image.dalbitlive.com/event/morning_event/morning_banner.png" alt="굿모닝 결제 이벤트" />
    }

    if (getTime === 12) {
      return <img src="https://image.dalbitlive.com/event/lunch_event/lunch_banner.png" alt="런치 결제 이벤트" />
    }
    if (getTime === 13) {
      return <img src="https://image.dalbitlive.com/event/lunch_event/lunch_banner.png" alt="런치 결제 이벤트" />
    }
  }

  //useEffect
  useEffect(() => {
    fetchAdmin()
    getStoreList()
    fetchMainPopupData('12')
  }, [])

  return (
    <>
      <Header title="달 충전" />
      <Content>
        <div className="store_banner">{timeBanner()}</div>
        <p className="mydal">
          보유 달 <span>{mydal.toLocaleString()}</span>
        </p>
        {creatResult()}
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
  .store_banner {
    max-width: 540px;
    margin: auto;
    img {
      display: block;
      width: 100%;
    }
  }

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
