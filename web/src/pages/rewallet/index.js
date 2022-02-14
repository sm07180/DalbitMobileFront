import React, {useState, useEffect} from 'react'
import Utility ,{addComma} from 'components/lib/utility'

// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from './components/tabmenu'
// contents
import HistoryList from './contents/HistoryList'
import Exchange from './contents/exchange/Exchange'
// css

import './style.scss'

const walletTabmenu = ['달 내역', '별 내역', '환전']

const WalletPage = (props) => {
  const [walletType, setWalletType] = useState(walletTabmenu[2])

  return (
    <div id="walletPage">
      <Header type='back' title='내 지갑'>
        {walletType === walletTabmenu[1] ? (
          <div className="buttonGroup">
            <button className="payCount" onClick={() => {history.push('/pay/store')}}>
              <i className='iconStar'></i>
              <span>{Utility.addComma(33000)}</span>
            </button>
          </div>
        ) : (
          <div className="buttonGroup">
            <button className="payCount" onClick={() => {history.push('/pay/store')}}>
              <i className='iconDal'></i>
              <span>{Utility.addComma(33000)}</span>
            </button>
          </div>
        )}
      </Header>
      <Tabmenu data={walletTabmenu} tab={walletType} setTab={setWalletType} />
      {walletType !== walletTabmenu[2] ?
        <HistoryList />
        :
        <Exchange />
      }
    </div>
  )
}

export default WalletPage