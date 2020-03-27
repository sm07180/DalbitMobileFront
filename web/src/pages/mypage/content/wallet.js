import React, {useState, useEffect, useContext, useMemo} from 'react'
import styled from 'styled-components'

import Api from 'context/api'

// context
import {Context} from 'context'

// component
import Paging from 'components/ui/paging.js'
import List from '../component/wallet/list.js'

// static
import dalCoinIcon from '../component/images/ic_moon_l@2x.png'
import byeolCoinIcon from '../component/images/ic_star_l@2x.png'
import {IMG_SERVER, WIDTH_MOBILE} from 'context/config'

export default props => {
  const [coinType, setCoinType] = useState('dal') // type 'dal', 'byeol'
  const [walletType, setWalletType] = useState(0) // 전체: 0, 구매: 1, 선물: 2, 교환: 3
  const [totalCoin, setTotalCoin] = useState(null)
  const [searching, setSearching] = useState(true)

  const [listDetailed, setListDetailed] = useState([]) // listDetailed: false -> Not found case
  const [totalPageNumber, setTotalPageNumber] = useState(null)
  const [page, setPage] = useState(1)
  const records = 10

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
        records
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
        <span className="text">내 지갑</span>
        <div>
          <CoinTypeBtn
            className={coinType === 'dal' ? 'active' : ''}
            style={{marginRight: '5px'}}
            onClick={() => changeCoinTypeClick('dal')}>
            달
          </CoinTypeBtn>
          <CoinTypeBtn
            className={coinType === 'byeol' ? 'active' : ''}
            style={{marginLeft: '5px'}}
            onClick={() => changeCoinTypeClick('byeol')}>
            별
          </CoinTypeBtn>
        </div>
      </TitleWrap>

      <CoinCountingView>
        <CoinCurrentStatus>
          <span className="text">{`현재 보유 ${returnCoinText(coinType)}:`}</span>
          <img className="coin-img" src={returnCoinImg(coinType)} />
          <span className="current-value">{totalCoin !== null && Number(totalCoin).toLocaleString()}</span>
        </CoinCurrentStatus>

        {/* <div>
          {coinType === 'dal' ? (
            <CoinChargeBtn>충전하기</CoinChargeBtn>
          ) : (
            <>
              <CoinChargeBtn className="white-btn">달 교환</CoinChargeBtn>
              <CoinChargeBtn>환전하기</CoinChargeBtn>
            </>
          )}
        </div> */}
      </CoinCountingView>

      <List
        searching={searching}
        coinType={coinType}
        walletData={listDetailed}
        returnCoinText={returnCoinText}
        setWalletType={setWalletType}
      />

      {Array.isArray(listDetailed) && listDetailed.length > 0 && (
        <Paging setPage={setPage} records={records} totalPage={totalPageNumber} currentPage={page} />
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
    }
  }
  .current-value {
    color: #8556f6;
    font-size: 28px;
    letter-spacing: -0.7px;

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
  color: #757575;
  width: 86px;
  padding: 15px 0;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  border-radius: 24px;

  &.active {
    color: #8556f6;
    border-color: #8556f6;
  }
`

const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 36px;
  margin-bottom: 16px;

  .text {
    font-size: 20px;
    letter-spacing: -0.5px;
    color: #8556f6;
  }
`
