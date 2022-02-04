import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header.js'
// components
import Tabmenu from '../../components/Tabmenu.js'
import HistoryList from './HistoryList.js'
// contents
import WalletPop from './wallet_pop'
// css

import './wallet.scss'

const walletTabmenu = ['달 내역', '별 내역', '환전']

const WalletPage = (props) => {
  const [walletType, setWalletType] = useState(walletTabmenu[0])

  const [showFilter, setShowFilter] = useState(false)

  return (
    <div id="walletPage">
      <Header type='back' title='내 지갑'>
        {walletType === walletTabmenu[0] ?
          <div className="buttonGroup">
            <button className="payCount" onClick={() => {history.push('/pay/store')}}>
              <i className='iconDal'></i>
              <span>1,234</span>
            </button>
          </div>
          : walletType === walletTabmenu[1] ?
          <div className="buttonGroup">
            <button className="payCount" onClick={() => {history.push('/pay/store')}}>
              <i className='iconStar'></i>
              <span>2,234</span>
            </button>
          </div>
          :
          <></>
        }
      </Header>
      <Tabmenu data={walletTabmenu} tab={walletType} setTab={setWalletType} />
      <section className="optionWrap">
        <div className="selectBox">
          <button>전체<i className="arrowDownIcon" /></button>
        </div>
        <div className="sub">최근 6개월 이내</div>
      </section>
      <HistoryList />
    </div>
  )
}

export default WalletPage