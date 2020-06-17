import React, { useState, useEffect, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import Api from 'context/api'

// context
import { Context } from 'context'
import { OS_TYPE } from 'context/config.js'

// component
import Paging from 'components/ui/paging.js'
import List from '../component/wallet/list.js'

// static
import dalCoinIcon from '../component/images/ic_moon_l@2x.png'
import byeolCoinIcon from '../component/images/ic_star_l@2x.png'
import {
  COLOR_MAIN,
  COLOR_POINT_Y,
  COLOR_POINT_P,
  PHOTO_SERVER
} from 'context/color'
import { WIDTH_MOBILE, IMG_SERVER } from 'context/config'
import Header from '../component/header.js'

// concat
let currentPage = 1
let timer
let moreState = false
export default props => {
  let history = useHistory()
  const context = useContext(Context)
  const [coinType, setCoinType] = useState('dal') // type 'dal', 'byeol'
  const [walletType, setWalletType] = useState(0) // 전체: 0, 구매: 1, 선물: 2, 교환: 3
  const [totalCoin, setTotalCoin] = useState(null)
  const [searching, setSearching] = useState(true)
  const [controllState, setcontrollState] = useState(false)
  const [nextList, setNextList] = useState(false)
  const [listDetailed, setListDetailed] = useState([]) // listDetailed: false -> Not found case
  const [page, setPage] = useState(1)
  const changeCoinTypeClick = type => {
    setCoinType(type)
    setWalletType(0)
    setcontrollState(!controllState)
  }
  const returnCoinText = t => {
    return t === 'dal' ? '달' : '별'
  }
  const returnCoinImg = t => {
    return t === 'dal' ? dalCoinIcon : byeolCoinIcon
  }
  async function fetchData(next) {
    currentPage = next ? ++currentPage : currentPage
    const response = await Api.mypage_wallet_inquire({
      coinType,
      walletType,
      page: currentPage,
      records: 15
    })
    if (response.result === 'success') {
      setSearching(false)
      const { list, dalTotCnt, byeolTotCnt, paging } = response.data
      if (coinType === 'dal') {
        setTotalCoin(dalTotCnt)
      } else if (coinType === 'byeol') {
        setTotalCoin(byeolTotCnt)
      }
      if (response.code === '0') {
        if (next !== 'next') {
          setListDetailed(false)
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextList(response.data.list)
        } else {
          setListDetailed(response.data.list)
          fetchData('next')
        }
      }
    } else {
    }
  }

  //재조회 및 초기조회
  useEffect(() => {
    currentPage = 1
    fetchData()
  }, [coinType, walletType, page])
  //스크롤 콘켓
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])

  //콘켓 쇼모어 이벤트
  const showMoreList = () => {
    if (moreState) {
      setListDetailed(listDetailed.concat(nextList))
      fetchData('next')
    }
  }
  //스크롤 이벤트
  const scrollEvtHdr = event => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function() {
      //스크롤
      const windowHeight =
        'innerHeight' in window
          ? window.innerHeight
          : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )
      const windowBottom = windowHeight + window.pageYOffset
      if (moreState && windowBottom >= docHeight - 200) {
        showMoreList()
      } else {
      }
    }, 10)
  }
  return (
    <div>
      {/* 공통타이틀 */}
      <Header>
        <div className="category-text">내 지갑</div>
      </Header>
      <Wrap>
        <TitleWrap>
          <CoinTypeBtn
            className={coinType === 'dal' ? 'active' : ''}
            onClick={() => {
              changeCoinTypeClick('dal')
            }}
          >
            달
          </CoinTypeBtn>
          <CoinTypeBtn
            className={coinType === 'byeol' ? 'active' : ''}
            onClick={() => {
              changeCoinTypeClick('byeol')
            }}
          >
            별
          </CoinTypeBtn>
        </TitleWrap>

        <CoinCountingView>
          <CoinCurrentStatus className={coinType === 'dal' ? 'active' : ''}>
            <span className="text">{`현재 보유 ${returnCoinText(
              coinType
            )}:`}</span>
            <span className="current-value">
              {totalCoin !== null && Number(totalCoin).toLocaleString()}
              {coinType === 'byeol' ? <em>별</em> : <em>달</em>}
            </span>
          </CoinCurrentStatus>

          <div>
            {coinType === 'dal' ? (
              <>
                {context.customHeader['os'] === OS_TYPE['IOS'] ? (
                  <CoinChargeBtn
                    onClick={() => {
                      webkit.messageHandlers.openInApp.postMessage('')
                    }}
                  >
                    충전하기
                  </CoinChargeBtn>
                ) : (
                  <CoinChargeBtn
                    onClick={() => {
                      history.push('/store')
                    }}
                  >
                    충전하기
                  </CoinChargeBtn>
                )}
              </>
            ) : (
              <>
                {context.customHeader['os'] !== OS_TYPE['IOS'] && (
                  <CoinChargeBtn
                    className="exchange gray"
                    onClick={() => {
                      history.push('/exchange')
                    }}
                  >
                    달교환
                  </CoinChargeBtn>
                )}
                {context.customHeader['os'] !== OS_TYPE['IOS'] && (
                  <CoinChargeBtn
                    className="exchange"
                    onClick={() => {
                      history.push('/money_exchange')
                    }}
                  >
                    환전하기
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
      </Wrap>
    </div>
  )
}
//styled-------------------------------------------------------------------------------
const CoinChargeBtn = styled.button`
  color: #fff;
  background-color: #632beb;
  box-sizing: border-box;
  font-size: 16px;
  width: 74px;
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
  font-size: 16px;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
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
    &.gray {
      width: 60px;
      background-color: #757575;
    }
  }
`
const CoinCurrentStatus = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  user-select: none;
  width: calc(100% - 160px);
  &.active {
    width: calc(100% - 80px);
  }
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
    font-size: 24px;
    font-weight: 800;
    text-align: center;
    color: #000000;
    > em {
      font-size: 18px;
      font-weight: normal;
      font-style: normal;
      letter-spacing: normal;
      color: #9e9e9e;
      margin-left: 6px;
    }
  }
`
const CoinCountingView = styled.div`
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 11px 6px;
  background-color: #fff;
  box-sizing: border-box;
`
const CoinTypeBtn = styled.button`
  position: relative;
  width: 80px;
  height: 36px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  line-height: 36px;
  margin-right: 2px;
  font-size: 16px;
  letter-spacing: normal;
  text-align: center;
  color: #000;
  border: solid 1px #e0e0e0;
  background-color: #ffffff;
  &.active {
    border: solid 1px #632beb;
    background-color: #632beb;
    color: #ffffff;
  }
`
const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
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
    background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center
      center / cover;
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
const Wrap = styled.div`
  padding: 12px 16px;
`
