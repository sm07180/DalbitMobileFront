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

export default props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  const {profile} = context

  //useState
  const [list, setList] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [listState, setListState] = useState(-1)

  //---------------------------------------------------------------------

  async function getStoreList() {
    const res = await Api.store_list({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      setList(res.data.list)
      setListState(1)
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
            key={item.itemNo}
            iosprice={item.iosPrice}
            onClick={() => {
              if (selected.num == index) {
                setSelected(-1)
              } else {
                setSelected({
                  num: index,
                  name: item.itemNm,
                  price: item.salePrice
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
    if (context.token.isLogin) {
      context.action.updatePopup('CHARGE', {
        name: selected.name,
        price: selected.price
      })
    } else {
      props.history.push('/login')
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
          <List>{creatList()}</List>
          <button onClick={chargeClick} className="charge-btn" disabled={selected == -1 ? true : false}>
            구매하기
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
  return <Content>{creatResult()}</Content>
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
    padding: 30px 0 0 0;
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
    padding-top: 0;
    .wrap {
      width: 32.4%;
      margin-bottom: 16px;

      & > p {
        font-size: 14px;
        line-height: 28px;
        transform: skew(-0.03deg);
      }
    }
    .item-wrap {
      padding: 5px 0 10px 0;
      img {
        width: calc(100% - 25px);
        margin-bottom: 4px;
      }
      p {
        font-size: 12px;
      }
    }
  }
`
