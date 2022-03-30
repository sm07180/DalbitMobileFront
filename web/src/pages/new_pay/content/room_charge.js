/**
 * @route /pay/room
 * @file /pay/content/room_charge
 * @brief 안드로이드 - 방송방에서 충전하기 클릭했을때
 *        웹뷰 팝업에서 뜨는 달 충전/ 달 교환 페이지
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import Utility from 'components/lib/utility'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_MOBILE} from 'context/config'
import {Hybrid} from 'context/hybrid'

//static
import dalIcon from '../static/ic_moon_s.svg'
import starIcon from '../static/ic_star_s.svg'
import notiIcon from '../static/ic_notice.svg'

import GganbuReward from '../../event/gganbu/content/gganbuReward'


export default (props) => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  const {profile} = context
  let {tabType} = props
  if (tabType === undefined || (tabType !== 'charge' && tabType !== 'change')) tabType = 'charge'

  //useState
  const [chargeList, setChargeList] = useState(false)
  const [exchangeList, setExchangeList] = useState(false)
  const [selected, setSelected] = useState({
    num: 1,
    dal: "100",
    name: '달 100',
    price: "11000",
    itemNo: 'A1335',
  })
  const [selectedItem, setSelectedItem] = useState(tabType)
  const [myDal, setMyDal] = useState('')
  const [myByeol, setMyByeol] = useState('')
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
    const res = await Api.store_list({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      setChargeList(res.data.dalPriceList.slice(0, 9))
      setMyDal(Utility.addComma(res.data.dalCnt))
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  async function getChangeList() {
    const res = await Api.getChangeItem({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      setExchangeList(res.data.list)
      setMyByeol(Utility.addComma(res.data.byeolCnt))
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  //---------------------------------------------------------------------
  const creatList = () => {
    if (chargeList) {
      return chargeList.map((item, index) => {
        return (
          <div
            className={[`wrap ${selected.num === index ? 'on' : 'off'}`]}
            key={index}
            applestoreid={item.appleStoreId}
            onClick={() => {
              if (selected.num === index) {
                setSelected(-1)
              } else {
                setSelected({
                  num: index,
                  dal : item.givenDal,
                  name: item.itemNm,
                  price: item.salePrice,
                  itemNo: item.itemNo
                })
              }
            }}>
            <div className="item-wrap">
              <div className="img-wrap">
                <img src={item.img}></img>
              </div>
              <p>{item.itemNm}</p>
              <p className="dal">￦{Utility.addComma(item.salePrice)}</p>
            </div>
          </div>
        )
      })
    }
  }

  const createChangeList = () => {
    if (exchangeList) {
      return exchangeList.map((item, index) => {
        return (
          <div
            className={[`wrap ${selected.num === index ? 'on' : 'off'}`]}
            key={index}
            onClick={() => {
              if (selected.num === index) {
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
              <div className="img-wrap">
                <img src={item.itemThumbnail}/>
              </div>
              <p>달 {item.dalCnt}</p>
              <p className="item-name dal">{Utility.addComma(item.byeolCnt)}</p>
            </div>
          </div>
        )
      })
    }
  }

  function chargeClick() {
    let url = `https://${location.host}/store/dalcharge?itemNm=${encodeURIComponent(selected.name)}&price=${selected.price}&itemNo=${selected.itemNo}&dal=${selected.dal}&webview=new`
    let urlObj = {url: url, title: '달 충전하기'}
    Hybrid('OpenPayPopup', urlObj)
  }

  function changeClick() {
    async function postChange() {
      const res = await Api.postChangeItem({
        data: {itemCode: selected.itemCode}
      })
      if (res.result === 'success' && _.hasIn(res, 'data')) {
        setMyByeol(Utility.addComma(res.data.byeolCnt))
        setMyDal(Utility.addComma(res.data.dalCnt))

        let gganbuData;
        let marbleTotleCtn;

        if(selected.byeol >= 300){
          marbleTotleCtn = Math.floor((Number(selected.byeol) / 100));
          const param = {
            insSlct: "e",
            marbleCnt : marbleTotleCtn,
          };
          gganbuData = await Api.getGganbuObtainMarble(param)
        }

        context.action.alert({
          msg: res.message,
          callback: () => {
            if(gganbuData) {
              const data = gganbuData.data;

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
              }else{
                Hybrid('CloseLayerPopup');
              }
            }else {
              Hybrid('CloseLayerPopup')
            }
          }
        })
      } else {
        context.action.alert({
          msg: res.message,
          callback: () => {
            Hybrid('CloseLayerPopup')
          }
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

  const tabClick = (type) => {
    setSelectedItem(type)
    setSelected(-1)
  }

  const goBackClick = () => {
    Hybrid('CloseLayerPopup')
  }

  const androidClosePopup = () => {
    Hybrid('CloseLayerPopup');
  }

  //useEffect
  useEffect(() => {
    getStoreList()
    getChangeList()
  }, [])

  //---------------------------------------------------------------------
  return (
    <Content>
      <TabItem>
        <button className={`${selectedItem === 'charge' && 'true'}`} onClick={() => {tabClick('charge')}}>달 충전</button>
        <button className={`${selectedItem === 'change' && 'true'}`} onClick={() => {tabClick('change')}}>달 교환</button>
      </TabItem>
      <div className="cnt-wrap">
        <p className={`my-cnt-text dal ${selectedItem === 'charge' && 'on'}`}>{myDal}</p>
        <p className={`my-cnt-text byeol ${selectedItem === 'change' && 'on'}`}>{myByeol}</p>
      </div>
      {selectedItem === 'charge' ? (
        <>
          {chargeList ? (
            <>
              <List className={`${selectedItem}`}>{creatList()}</List>
              <div className="btn-wrap">
                <button onClick={goBackClick} className="charge-btn close">취소하기</button>
                <button onClick={chargeClick} className="charge-btn" disabled={selected == -1 ? true : false}>결제하기</button>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          {exchangeList ? (
            <>
              <List className={`${selectedItem}`}>{createChangeList()}</List>
              <InfoList>
                <h5>달 교환 안내</h5>
                <p>보유중인 별을 달로 교환할 수 있습니다.</p>
                <p>달로 교환 된 별은 취소가 어렵습니다. 신중하게 선택해 주세요.</p>
                <p>교환 된 달은 선물하기가 가능합니다.</p>
              </InfoList>
              <div className="btn-wrap">
                <button onClick={goBackClick} className="charge-btn close">취소하기</button>
                <button onClick={changeClick} className="charge-btn" disabled={selected == -1 ? true : false}>교환하기</button>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}
      {rewardPop && <GganbuReward setRewardPop={setRewardPop} getMarble={getMarble} content={chargeContent} androidClosePopup={androidClosePopup}/>}
    </Content>
  )
}

//---------------------------------------------------------------------

const InfoList = styled.div`
  padding-top: 4px;
  h5 {
    margin-bottom: 2px;
    padding-left: 16px;
    background: url(${notiIcon}) no-repeat left center;
    color: #000;
    font-size: 12px;
  }
  p {
    position: relative;
    padding-left: 16px;
    font-size: 12px;
    color: #000;
    line-height: 20px;

    ::before {
      position: absolute;
      left: 6px;
      top: 9px;
      width: 2px;
      height: 2px;
      background: #000;
      content: '';
    }
  }
`

const TabItem = styled.div`
  position: fixed;
  top: 12px;
  left: 12px;
  width: calc(100% - 24px);
  display: flex;

  button {
    position: relative;
    padding: 0 0;
    width: 50%;
    color: #9e9e9e;
    font-size: 20px;
    font-weight: 800;

    &.true {
      color: ${COLOR_MAIN};
    }
  }
  button + button:before {
    width: 1px;
    height: 20px;
    background: #e5e5e5;
    position: absolute;
    left: 0;
    top: 5px;
    content: '';
  }
`

const Content = styled.section`
  width: 1040px;
  min-height: 300px;
  margin: 0 auto;
  padding: 40px 0 120px 0;

  p.my-cnt-text {
    color: #424242;
    font-size: 14px;
    text-align: center;
    padding: 16px 0;
    font-weight: bold;
  }

  .cnt-wrap {
    display: flex;
    padding-bottom: 9px;

    p {
      display: inline-block;
      width: 50%;
      padding: 0;
      line-height: 20px;
      color: #9e9e9e;
      &:before {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-top: 2px;
        padding-right: 1px;
        vertical-align: top;
        content: '';
      }
      &.on {
        color: ${COLOR_MAIN};
      }
      &.dal:before {
        background: url(${dalIcon}) no-repeat;
      }
      &.byeol:before {
        background: url(${starIcon}) no-repeat;
        background-size: 20px;
      }
    }
  }

  .item-name {
    &:before {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-top: 1px;
      padding-right: 1px;
      vertical-align: top;
      background: url(${starIcon}) no-repeat;
      background-size: 14px;
      content: '';
    }
  }

  .btn-wrap {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
    position: fixed;
    bottom: 12px;
    width: calc(100% - 24px);
    left: 12px;
    .charge-btn {
      display: block;
      width: 49.2%;
      margin-top: 0;
      border-radius: 10px;
      background: ${COLOR_MAIN};
      border: 1px solid ${COLOR_MAIN};
      color: #fff;
      line-height: 46px;
      &:disabled {
        background: #bdbdbd;
        color: #fff;
        border: 1px solid #bdbdbd;
      }

      &.close {
        background: #fff;
        color: ${COLOR_MAIN};
      }
    }
  }

  .mydal {
    color: #424242;
    font-size: 22px;
    font-weight: 600;
    line-height: 36px;
    text-align: center;
    &:before {
      display: inline-block;
      width: 36px;
      height: 36px;
      margin-top: -2px;
      padding-right: 5px;
      vertical-align: top;
      background: url(${IMG_SERVER}/images/api/ic_moon_s@2x.png) no-repeat;
      content: '';
    }
  }

  @media (max-width: 1060px) {
    width: 100%;
    padding: 44px 12px 0 12px;
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
      margin-top: 24px;
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
      background: ${COLOR_POINT_P};
    }
    &.on .img-wrap {
      background: #fff;
    }
    &.on .item-wrap {
      background: ${COLOR_POINT_P};
    }
    &.on p {
      color: #fff;
    }
  }

  &.change {
    .wrap.on .item-wrap {
      background: ${COLOR_POINT_Y};
    }
  }
  .item-wrap {
    padding: 14px;
    border-radius: 10px;
    background: #f5f5f5;
    .img-wrap {
      background: #f5f5f5;
      border-radius: 10px;
      margin: 0 3px;
    }
    img {
      width: 100%;
      margin-bottom: 10px;
    }
    p {
      padding-top: 3px;
      color: #757575;
      font-size: 14px;
      transform: skew(-0.03deg);
    }
    p + p {
      padding-top: 0;
      padding-bottom: 3px;
    }
  }

  .on .item-wrap {
    background: #fff;
    p {
      color: #fff !important;
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-wrap: wrap;
    .wrap {
      width: 31.8%;
      margin-bottom: 6px;

      & > p {
        font-size: 14px;
        line-height: 28px;
        transform: skew(-0.03deg);
      }
    }
    .item-wrap {
      padding: 3px 0 0 0;
      img {
        width: calc(100% - 28px);
        margin-bottom: 0;
        margin: 3px 0;
      }
      p {
        font-size: 12px;
        line-height: 15px;
      }
      p.dal {
        color: ${COLOR_MAIN};
        font-weight: 600;
      }
    }
  }
`

const NoResult = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 60px;

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
    }
  }
`

const NoImg = styled.div`
  display: flex;
  background: url('${IMG_SERVER}/images/api/img_noresult.png') no-repeat center center;
  width: 299px;
  height: 227px;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 90%;
    height: 198;
  }
`
