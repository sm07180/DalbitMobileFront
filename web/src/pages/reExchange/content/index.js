/**
 * @file /exchange/index.js
 * @brief 달 교환 페이지
 */
import React, {useEffect, useState, useContext, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import _ from 'lodash'

import NoResult from 'components/ui/noResult'
import Popup from './auto_exchange_pop'
import GganbuReward from '../../event/gganbu/content/gganbuReward'

import ic_guide from '../static/guide_s.svg'
import ic_toggle_off from '../static/toggle_off_s.svg'
import ic_toggle_on from '../static/toggle_on_s.svg'
import ic_close from '../static/ic_close_round_g.svg'
import ic_notice from '../static/ic_notice.svg'

export default (props) => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  const {profile} = context
  let history = useHistory()
  //useState
  const [list, setList] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [listState, setListState] = useState(-1)
  const [mydal, setMydal] = useState(0)
  const [autoState, setAutoState] = useState(0)
  const [popState, setPopState] = useState(1)
  const [popup, setPopup] = useState(0)
  const [rewardPop, setRewardPop] = useState(false)
  const [getMarble, setGetMarble] = useState({
    rmarbleCnt : 0,
    ymarbleCnt : 0,
    bmarbleCnt : 0,
    vmarbleCnt : 0,
    totalmarbleCnt : 0,
  });
  const [chargeContent, setChargeContent] = useState("");

  //---------------------------------------------------------------------

  async function getStoreList() {
    const res = await Api.getChangeItem({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      setList(res.data.list)
      setListState(1)
      setSelected({
        num: 1,
        dal: res.data.list[1].dalCnt,
        byeol: res.data.list[1].byeolCnt,
        itemCode: res.data.list[1].itemCode
      })
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
              setSelected({
                num: index,
                dal: item.dalCnt,
                byeol: item.byeolCnt,
                itemCode: item.itemCode
              })
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

  let marbleTotleCtn =  0;

  function chargeClick() {
    async function postChange() {
      const res = await Api.postChangeItem({
        data: {
          itemCode: selected.itemCode
        }
      })
      if (res.result === 'success' && _.hasIn(res, 'data')) {
        setMydal(res.data.byeolCnt)
        context.action.toast({
          msg: res.message
        })
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    }

    async function fetchPayComplete() {
      console.log(selected.byeol);
      if(selected.byeol >= 300){
        marbleTotleCtn = Math.floor((Number(selected.byeol) / 100));
        const param = {
          insSlct: "e",
          marbleCnt : marbleTotleCtn,
        };
        const {data} = await Api.getGganbuObtainMarble(param)
        if (data.s_return === 1) {
          setChargeContent(`별 ${selected.byeol}개 교환으로 \n 구슬 ${marbleTotleCtn}개가 지급되었습니다.`);
          setRewardPop(true);
          setGetMarble({
            rmarbleCnt : data.rmarbleCnt,
            ymarbleCnt : data.ymarbleCnt,
            bmarbleCnt : data.bmarbleCnt,
            vmarbleCnt : data.vmarbleCnt,
            totalmarbleCnt : data.marbleCnt,
          })
        } 
      } else {

      }
    }
      

    if (selected.byeol > mydal) {
      return context.action.confirm({
        msg: `달 교환은 50별부터 가능합니다.`
      })
    }

    context.action.confirm({
      msg: `별 ${selected.byeol}을 달 ${selected.dal}으로 \n 교환하시겠습니까?`,
      callback: () => {
        postChange()
        fetchPayComplete()
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
          <div className="info-wrap">
            <h5>달 교환 안내</h5>
            {/* <p className="red">별 → 달 교환 시 1달당 1exp를 획득할 수 있습니다.</p>
            <p>별 → 달 교환 및 교환 달로 선물하기가 가능합니다.</p> */}
            <p>달교환은 최소 50별 이상부터 가능합니다.</p>
            <p>별을 달로 교환할 경우 교환달로 아이템 선물이 가능합니다.</p>
            <p>별을 달로 교환할 경우 1exp를 획득할 수 있습니다.</p>
          </div>

          <div className="btn-wrap">
            <button
              onClick={() => {
                history.goBack()
              }}
              className="charge-btn cancel">
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

  const toggleHandler = useCallback(async () => {
    const {result, data} = await Api.postDalAutoExchange({
      data: {autoChange: !autoState}
    })
    if (result === 'success') {
      setAutoState(data.autoChange)
      if (data.autoChange === 0) {
        context.action.toast({
          msg: '자동교환을 설정(OFF) 하였습니다'
        })
      } else {
        context.action.toast({
          msg: '자동교환을 설정(ON) 하였습니다'
        })
      }
    }
  }, [autoState])

  //useEffect
  useEffect(() => {
    getStoreList()

    const checkAutoState = async () => {
      const {result, data} = await Api.getDalAutoExchange()
      if (result === 'success') {
        setAutoState(data.autoChange)
        setPopState(data.autoChange)
      }
    }
    checkAutoState()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (popState === 0) {
        setPopState(1)
      }
    }, 8000)
  }, [popState])

  //---------------------------------------------------------------------
  return (
    <Content>
      <p className="mydal">
        내가 보유한 별 <span>{mydal.toLocaleString()}</span>
      </p>

      {creatResult()}

      {popup === 1 && <Popup setPopup={setPopup} />}
      {rewardPop && <GganbuReward setRewardPop={setRewardPop} getMarble={getMarble} content={chargeContent} />}
    </Content>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  height: 100vh;
  min-height: 300px;
  margin: 0 auto;
  width: 100%;
  padding: 10px 16px;

  .info-wrap {
    margin-top: 5px;
    h5 {
      display: flex;
      margin-bottom: 8px;
      padding-left: 16px;
      background: url(${ic_notice}) no-repeat left center;
      color: #424242;
      font-size: 12px;
      font-weight: bold;
    }
    p {
      position: relative;
      padding-left: 16px;
      color: #757575;
      font-size: 12px;
      line-height: 20px;
      &::before {
        position: absolute;
        left: 6px;
        top: 9px;
        width: 2px;
        height: 2px;
        background: #757575;
        content: '';
      }
      &.red {
        color: #ec455f;
      }
    }
  }

  .auto-exchange {
    display: flex;
    position: relative;
    padding: 8px 12px;
    margin-bottom: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background: #fff;
    p {
      padding-right: 5px;
      font-size: 14px;
      font-weight: bold;
      color: #000;
      line-height: 24px;
    }
    button.toggle {
      margin-left: auto;
    }
  }

  .auto-exchange-pop {
    position: absolute;
    padding: 12px 50px 12px 12px;
    right: 0;
    top: 45px;
    background: #757575;
    border-radius: 12px;
    font-size: 12px;
    line-height: 18px;

    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    &.on {
      opacity: 1;
      z-index: 1;
    }
    &.off {
      opacity: 0;
      z-index: 0;
    }
    p {
      color: #fff;
      font-weight: normal;
      font-size: 12px;
      line-height: 18px;
    }
    button {
      position: absolute;
      right: 4px;
      top: 4px;
    }
  }

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
      color: #FF3C7B;
      font-weight: normal;
    }
  }
`

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .wrap {
    width: 48.4%;
    margin-bottom: 13px;
    text-align: center;
    cursor: pointer;
    background: #eeeeee;
    &.on {
      background: #FF3C7B;
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
      width: 70%;
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
    border: 1px solid #FF3C7B;
  }
`
