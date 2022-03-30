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
  const [counter, setCounter] = useState(1);

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
            className={[`item ${selected.num == index ? 'on' : ''}`]}
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
            <img className="dalImg" src={item.img}></img>
            <p className="quantity">{item.itemNm}</p>
            {item.salePrice === 1100000 && <span className="bonus">+500</span> }
            <p className="price">&#8361; {Utility.addComma(item.salePrice)}</p>
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

  //useEffect
  useEffect(() => {
    fetchAdmin()
    getStoreList()
    // fetchMainPopupData(12)
    fetchMainPopupData(4)
  }, [])

  return (
    <>
      <Header title="스토어" />
      <Content>
        <section className="store">
          <div className="dalWrap">
            <label>내가 보유한 달</label>
            <span>{mydal.toLocaleString()}</span>
          </div>
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
          <div className="item-list">{creatList()}</div>
          <div className="btn-wrap">
            <button onClick={chargeClick} className="charge">
              결제하기
            </button>
          </div>
        </section>
        {popupData.length > 0 && <LayerPopupWrap data={popupData} setData={setPopupData} />}
      </Content>
    </>
  )
}

const Content = styled.div`
  min-height: calc(100vh - 40px);
  background: #eeeeee;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  section{
    position:relative;
    width:100%;
    background:#fff;
    padding: 0 16px 35px;
    margin-bottom:9px;
    box-sizing:border-box;
    &:last-child{margin-bottom:0;}
  }
  .bannerBox {
    padding: 16px 0;
    img { 
      width: 100%;
    }
  }
  .dalWrap {
    display:flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 26px;
    margin: 13px 0;
    label {
      font-size: 15px;
      color: #666;
    }
    span {
      font-size: 20px;
      font-weight: bold;
      color: #202020;
      &::before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        margin-right: 4px;
        width: 24px;
        height: 24px;
        background: url('https://image.dalbitlive.com/svg/moon_yellow_s.svg') no-repeat 0 0;
      }
    }
  }
  .btn-wrap {
    display: flex;
    margin-top: 20px;
    button {
      width: 100%;
      height: 50px;
      border-radius: 16px;
      font-size: 15px;
      color: #fff;
      line-height: 44px;
      &.charge {
        background: #FF3C7B;
      }
    }
  }
  .item-list {
    display: flex;
    flex-direction: column;
    .item {
      position:relative;
      display:flex;
      align-items: center;
      width: 100%;
      padding: 0 10px 0 5px;
      margin-bottom: 10px;
      border: 1px solid #e3e3e3;
      border-radius: 16px;
      &.on {
        border-color: #FF3C7B;
        .price {
          background:#FF3C7B;
        }
        &::after{
          content:"";
          position:absolute;
          top:-2px    ;
          left:-2px;
          width:15px;
          height:15px;
          border-radius:100%;
          background:url("https://image.dalbitlive.com/store/dalla/ico_check.png") no-repeat center / contain;
        }
      }
      .dalImg {
        width: 50px;
        height: 50px;
        margin-right: 5px;
      }
      .quantity{
        font-size: 18px;
      }
      .price {
        width: 100px;
        height: 28px;
        line-height: 28px;
        margin-left:auto;
        text-align:center;
        font-size: 14px;
        font-weight: bold;
        color:#fff;
        background-color:#202020;
        border-radius:20px;
      }
      .bonus{
        width:41px;
        height:17px;
        line-height:17px;
        text-align:center;
        font-size:12px;
        color:#fff;
        background:#fd5b2a;
        border-radius:10px;
        margin-left:5px;
      }
    }
  }
  .title{
    font-size:20px;
    padding:20px 0 8px 0;
  }
  .summary{
    display:flex;
    flex-direction:column;
    width:100%;
    background:#fbfbfb;
    border-radius:8px;
    over-flow:hidden
    font-size:15px;
    &>div{
      display:flex;
      justify-content:space-between;
      align-items:center;
      height: 50px;
      padding:0 15px;
      &:last-child{
        border-top:1px solid #ececec;
      }
    }
    .quantityControl{
      display:flex;
      align-items:center;
      .controler{
        display:flex;
        justify-content:center;
        align-items:center;
        width:23px;
        height:23px;
        background:#FF3C7B;
        border-radius:100%;
      }
      .counter{
        width:45px;
        text-align:center;
      }
    }
  }
  .total{
    display:flex;
    justify-content:space-between;
    align-items:center;
    width:100%;
    height:55px;
    background:#FFF1F8;
    border-radius:8px;
    margin-top:10px;
    padding:0 15px;
  }
`
