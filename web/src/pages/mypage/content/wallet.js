// component
import Paging from 'components/ui/paging.js'
// context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN} from 'context/color'
import {IMG_SERVER, WIDTH_MOBILE} from 'context/config'
import {OS_TYPE} from 'context/config.js'
import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import Header from '../component/header.js'
// static
import dalCoinIcon from '../component/images/ic_moon_l@2x.png'
import byeolCoinIcon from '../component/images/ic_star_l@2x.png'
import List from '../component/wallet/list.js'
import {Hybrid} from "context/hybrid";

export default (props) => {
  let history = useHistory()

  const context = useContext(Context)

  const [coinType, setCoinType] = useState('dal') // type 'dal', 'byeol'
  const [walletType, setWalletType] = useState(0) // 전체: 0, 구매: 1, 선물: 2, 교환: 3
  const [totalCoin, setTotalCoin] = useState(null)
  const [searching, setSearching] = useState(true)
  const [controllState, setcontrollState] = useState(false)

  const [listDetailed, setListDetailed] = useState([]) // listDetailed: false -> Not found case
  const [totalPageNumber, setTotalPageNumber] = useState(null)
  const [page, setPage] = useState(1)

  const changeCoinTypeClick = (type) => {
    setCoinType(type)
    setWalletType(0)
    setcontrollState(!controllState)
  }

  const returnCoinText = (t) => {
    return t === 'dal' ? '달' : '별'
  }

  const returnCoinImg = (t) => {
    return t === 'dal' ? dalCoinIcon : byeolCoinIcon
  }

  useEffect(() => {
    // searching ...
    setSearching(true)
    setTotalCoin(null)
    ;(async () => {
      const response = await Api.mypage_wallet_inquire({
        coinType,
        walletType,
        page,
        recrods: 10
      })

      if (response.result === 'success') {
        const {list, dalTotCnt, byeolTotCnt, paging} = response.data

        if (coinType === 'dal') {
          setTotalCoin(dalTotCnt)
        } else if (coinType === 'byeol') {
          setTotalCoin(byeolTotCnt)
        }

        if (list.length) {
          if (paging) {
            const {totalPage} = paging
            setTotalPageNumber(totalPage)
          }
          setListDetailed(list)
        } else {
          setListDetailed(false)
        }
        setSearching(false)
      }
    })()
  }, [coinType, walletType, page])

  useEffect(() => {
    if (context.walletIdx === 1) {
      changeCoinTypeClick('byeol')
    }
  }, [context.walletIdx])

  const checkSelfAuth = () => {
    async function fetchSelfAuth() {
      const res = await Api.self_auth_check({})
      if (res.result === 'success') {
        const {parentsAgreeYn, adultYn} = res.data
        if (parentsAgreeYn === 'n' && adultYn === 'n') return history.push('/selfauth_result')
        history.push('/money_exchange')
      } else if (res.result === 'fail' && res.code === '0') {
        history.push('/selfauth')
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    }
    fetchSelfAuth()
    // history.push('/money_exchange')
  }

  return (
    <div>
      {/* 공통타이틀 */}
      <Header>
        <div className="category-text">내 지갑</div>
      </Header>
      <TitleWrap>
        {/* <span className="text">내 지갑</span> */}
        <CoinTypeBtn
          className={coinType === 'dal' ? 'active' : ''}
          onClick={() => {
            changeCoinTypeClick('dal')
            context.action.updateWalletIdx(0)
          }}>
          달
        </CoinTypeBtn>
        <CoinTypeBtn
          className={coinType === 'byeol' ? 'active' : ''}
          onClick={() => {
            changeCoinTypeClick('byeol')
            context.action.updateWalletIdx(1)
          }}>
          별
        </CoinTypeBtn>
      </TitleWrap>

      <CoinCountingView>
        <CoinCurrentStatus>
          <span className="text">{`현재 보유 ${returnCoinText(coinType)}:`}</span>
          <img className="coin-img" src={returnCoinImg(coinType)} />
          <span className="current-value">{totalCoin !== null && Number(totalCoin).toLocaleString()}</span>
        </CoinCurrentStatus>

        <div>
          {context.walletIdx === 0 ? (
            <>
              {context.customHeader['os'] === OS_TYPE['IOS'] ? (
                <CoinChargeBtn
                  onClick={() => {
                    webkit.messageHandlers.openInApp.postMessage('')
                  }}>
                  충전하기
                </CoinChargeBtn>
              ) : (
                <CoinChargeBtn
                  onClick={() => {
                    history.push('/store')
                  }}>
                  충전하기
                </CoinChargeBtn>
              )}
            </>
          ) : (
            <>
              {(
                <CoinChargeBtn
                  className="exchange"
                  onClick={() => {
                    if(context.customHeader['os'] === OS_TYPE['IOS']){
                      async function fetchTokenShort() {
                          const res = await Api.getTokenShort()
                          if (res.result === 'success') {
                            Hybrid('openUrl', 'https://' + location.hostname + '/mypage/' + res.data.memNo + '/wallet?ppTT=' + res.data.authToken)
                          } else {
                            context.action.alert({
                                msg: res.message
                            })
                          }
                      }
                        fetchTokenShort()
                    }else{
                      history.push('/exchange')
                    }
                  }}>
                  교환
                </CoinChargeBtn>
              )}
              {context.customHeader['os'] !== OS_TYPE['IOS'] && (
                <CoinChargeBtn
                  className="exchange"
                  onClick={() => {
                    checkSelfAuth()
                  }}>
                  환전
                </CoinChargeBtn>
              )}
            </>
          )}
        </div>
      </CoinCountingView>
      <List
        searching={searching}
        coinType={coinType}
        walletData={listDetailed}
        returnCoinText={returnCoinText}
        setWalletType={setWalletType}
        controllState={controllState}
      />
      {Array.isArray(listDetailed) && listDetailed.length > 0 && (
        <Paging setPage={setPage} totalPage={totalPageNumber} currentPage={page} />
      )}
    </div>
  )
}
//styled-------------------------------------------------------------------------------
const CoinChargeBtn = styled.button`
  padding: 10px 16px;
  color: #fff;
  background-color: #632beb;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;

  &.white-btn {
    border: 1px solid #632beb;
    background-color: #fff;
    color: #632beb;
    margin-right: 12px;
  }
  &.exchange {
    display: inline-block;
    flex-direction: inherit;
    width: 76px;
    margin-top: 0 !important;
    margin-left: 4px;
    background: #632beb;
  }
`
const CoinCurrentStatus = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  user-select: none;

  .text {
    color: #9e9e9e;
    font-size: 16px;
    letter-spacing: -0.4px;

    @media (max-width: ${WIDTH_MOBILE}) {
      display: none;
    }
  }
  .coin-img {
    width: 44px;
    margin-left: 20px;

    @media (max-width: ${WIDTH_MOBILE}) {
      width: 36px;
      margin-left: 0;
      margin-right: 3px;
    }
  }
  .current-value {
    color: #632beb;
    font-size: 28px;
    letter-spacing: -0.7px;
    font-weight: 600;

    @media (max-width: ${WIDTH_MOBILE}) {
      font-size: 20px;
    }
  }
`
const CoinCountingView = styled.div`
  border: 2px solid #632beb;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 118px;
  padding: 30px;
  box-sizing: border-box;
  @media (max-width: ${WIDTH_MOBILE}) {
    padding: 20px 12px;
    height: 65px;
  }
`
const CoinTypeBtn = styled.button`
  position: relative;
  width: 50%;
  text-align: center;
  color: #757575;
  font-size: 20px;
  font-weight: 600;
  line-height: 50px;
  &:first-child:after {
    display: block;
    position: absolute;
    right: 0;
    top: 15px;
    width: 1px;
    height: 20px;
    background: #e0e0e0;
    content: '';
  }
  &.active {
    color: #632beb;
  }
`
const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* margin: 20px 0 10px 0; */

  .text {
    font-size: 20px;
    letter-spacing: -0.5px;
    color: #632beb;
  }
`
// 탑 공통 타이틀 스타일
const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${COLOR_MAIN};
  align-items: center;
  margin-top: 24px;
  padding-bottom: 12px;
  button:nth-child(1) {
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
  }
  .title {
    width: calc(100% - 24px);
    color: ${COLOR_MAIN};
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.5px;
    text-align: center;
  }
`
