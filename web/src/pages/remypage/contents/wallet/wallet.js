import React, {useState, useEffect} from 'react'

// global components
import Header from 'components/ui/header/Header.js'
// components
import Tabmenu from '../../components/Tabmenu.js'
import HistoryList from './HistoryList.js'
// contents
// css

import './wallet.scss'

const walletTabmenu = ['달 내역', '별 내역', '환전']

const WalletPage = (props) => {
  const [walletType, setWalletType] = useState(walletTabmenu[0])

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
      {walletType !== walletTabmenu[2] ?
        <HistoryList />
        :
        <></>
      }
    </div>
  )
}

export default WalletPage