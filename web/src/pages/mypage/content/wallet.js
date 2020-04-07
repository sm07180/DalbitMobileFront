import React, {useState, useEffect, useContext, useMemo} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'

// context
import {Context} from 'context'

// component
import Paging from 'components/ui/paging.js'
import List from '../component/wallet/list.js'

// static
import dalCoinIcon from '../component/images/ic_moon_l@2x.png'
import byeolCoinIcon from '../component/images/ic_star_l@2x.png'
import {WIDTH_MOBILE} from 'context/config'

export default props => {
  let history = useHistory()

  const [coinType, setCoinType] = useState('dal') // type 'dal', 'byeol'
  const [walletType, setWalletType] = useState(0) // 전체: 0, 구매: 1, 선물: 2, 교환: 3
  const [totalCoin, setTotalCoin] = useState(null)
  const [searching, setSearching] = useState(true)

  const [listDetailed, setListDetailed] = useState([]) // listDetailed: false -> Not found case
  const [totalPageNumber, setTotalPageNumber] = useState(null)
  const [page, setPage] = useState(1)

  const changeCoinTypeClick = type => {
    setCoinType(type)
  }

  const returnCoinText = t => {
    return t === 'dal' ? '달' : '별'
  }

  const returnCoinImg = t => {
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

  return (
    <div>
      <TitleWrap>
        {/* <span className="text">내 지갑</span> */}
        <CoinTypeBtn className={coinType === 'dal' ? 'active' : ''} onClick={() => changeCoinTypeClick('dal')}>
          달
        </CoinTypeBtn>
        <CoinTypeBtn className={coinType === 'byeol' ? 'active' : ''} onClick={() => changeCoinTypeClick('byeol')}>
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
          {coinType === 'dal' ? (
            <CoinChargeBtn
              onClick={() => {
                history.push('/store')
              }}>
              충전하기
            </CoinChargeBtn>
          ) : (
            <>
              {/* <CoinChargeBtn className="white-btn">달 교환</CoinChargeBtn>
              <CoinChargeBtn>환전하기</CoinChargeBtn> */}
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
      />

      {Array.isArray(listDetailed) && listDetailed.length > 0 && (
        <Paging setPage={setPage} totalPage={totalPageNumber} currentPage={page} />
      )}
    </div>
  )
}

const CoinChargeBtn = styled.button`
  padding: 16px 44px;
  color: #fff;
  background-color: #8556f6;
  border-radius: 10px;
  width: 150px;
  box-sizing: border-box;
  font-size: 16px;

  &.white-btn {
    border: 1px solid #8556f6;
    background-color: #fff;
    color: #8556f6;
    margin-right: 12px;
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
    color: #8556f6;
    font-size: 28px;
    letter-spacing: -0.7px;
    font-weight: 600;

    @media (max-width: ${WIDTH_MOBILE}) {
      font-size: 20px;
    }
  }
`

const CoinCountingView = styled.div`
  border: 3px solid #8556f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 118px;
  padding: 30px;
  box-sizing: border-box;

  @media (max-width: ${WIDTH_MOBILE}) {
    padding: 20px 16px;
    height: 80px;
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
    color: #8556f6;
  }
`

const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 10px 0;

  .text {
    font-size: 20px;
    letter-spacing: -0.5px;
    color: #8556f6;
  }
`
