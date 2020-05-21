/**
 * @file /store/index.js
 * @brief 스토어
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import qs from 'query-string'
//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import _ from 'lodash'
import Utility from 'components/lib/utility'
import {Hybrid} from 'context/hybrid'

export default props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  const {profile} = context
  //useState
  const [list, setList] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [selectedItem, setSelectedItem] = useState('charge')
  const [myCnt, setMyCnt] = useState('')

  //---------------------------------------------------------------------

  async function getStoreList() {
    const res = await Api.store_list({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      setList(res.data.list)
      setMyCnt(Utility.addComma(res.data.dalCnt))
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  async function getChangeList() {
    const res = await Api.getChangeItem({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      setList(res.data.list)
      setMyCnt('')
    } else {
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
            applestoreid={item.appleStoreId}
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
            <div className="item-wrap">
              <img src={item.img}></img>
              <p>{item.itemNm}</p>
            </div>
            <p>{Utility.addComma(item.salePrice)}원</p>
          </div>
        )
      })
    }
  }

  function chargeClick() {
    console.log('selected.name', selected.name)
    let url = `https://${location.host}/charge?name=${encodeURIComponent(selected.name)}&price=${selected.price}&itemNo=${
      selected.itemNo
    }&webview=new`

    let urlObj = {
      url: url,
      title: '달 충전하기'
    }
    alert(JSON.stringify(urlObj))
    Hybrid('OpenPayPopup', urlObj)
  }

  function changeClick() {}

  const tabClick = type => {
    setSelectedItem(type)
    setSelected(-1)
    if (type === 'charge') {
      getStoreList()
    } else {
      getChangeList()
    }
  }

  const goBackClick = () => {
    Hybrid('CloseLayerPopup')
  }

  //useEffect
  useEffect(() => {
    getStoreList()
  }, [])

  //---------------------------------------------------------------------
  return (
    <Content>
      <TabItem>
        <button
          className={`${selectedItem === 'charge' && 'true'}`}
          onClick={() => {
            tabClick('charge')
          }}>
          달 충전
        </button>
        <button
          className={`${selectedItem === 'change' && 'true'}`}
          onClick={() => {
            tabClick('change')
          }}>
          달 교환
        </button>
      </TabItem>
      {selectedItem === 'charge' ? (
        <>
          {list ? (
            <>
              <p className="my-cnt-text">보유 달 {myCnt}</p>
              <List>{creatList()}</List>
              <div className="btn-wrap">
                <button onClick={goBackClick} className="charge-btn close">
                  취소하기
                </button>
                <button onClick={chargeClick} className="charge-btn" disabled={selected == -1 ? true : false}>
                  결제하기
                </button>
              </div>
            </>
          ) : (
            // <NoResult>
            //   <NoImg />
            //   <span>조회된 결과가 없습니다.</span>
            // </NoResult>
            <></>
          )}
        </>
      ) : (
        <>
          {list ? (
            <>
              <p className="my-cnt-text">보유 별 {myCnt}</p>
              <List>{creatList()}</List>
              <div className="btn-wrap">
                <button onClick={goBackClick} className="charge-btn close">
                  취소하기
                </button>
                <button onClick={changeClick} className="charge-btn" disabled={selected == -1 ? true : false}>
                  교환하기
                </button>
              </div>
            </>
          ) : (
            // <NoResult>
            //   <NoImg />
            //   <span>조회된 결과가 없습니다.</span>
            // </NoResult>
            <></>
          )}
        </>
      )}
    </Content>
  )
}

//---------------------------------------------------------------------

const TabItem = styled.div`
  position: fixed;
  top: 12px;
  left: 12px;
  width: calc(100% - 24px);
  display: flex;
  button {
    position: relative;
    padding: 10px 0;
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
    top: 14px;
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
    padding: 54px 0 0 0;
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
    border: 1px solid ${COLOR_POINT_P};
    p {
      color: ${COLOR_POINT_P};
      font-weight: 600;
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-wrap: wrap;
    .wrap {
      width: 32.4%;
      margin-bottom: 15px;

      & > p {
        font-size: 14px;
        line-height: 28px;
        transform: skew(-0.03deg);
      }
    }
    .item-wrap {
      padding: 5px 0 10px 0;
      img {
        width: calc(100% - 28px);
        margin-bottom: 4px;
      }
      p {
        font-size: 12px;
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
