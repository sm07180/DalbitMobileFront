import React, {useState, useEffect, useContext, useReducer, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

// component
import List from './list.js'

// static
import Header from 'components/ui/header/Header.js'
import WalletPop from './wallet_pop'

import './wallet.scss'

const WalletPage = (props) => {
  let history = useHistory()

  const [showFilter, setShowFilter] = useState(false)

  return (
    <div id="walletPage">
      <Header type={'back'} title={'내 지갑'}>
        <div className="currentValue" onClick={() => {history.push('/pay/store')}}>
          <i className='iconDal'></i>
          {/* <i className='iconStar'></i> */}
          1,234
        </div>
      </Header>
      <section className="tabWrap">
        <div className="tabBox">
          <button className="active">
            달 내역
          </button>
          <button className="">
            별 내역
          </button>
          <button className=""
            onClick={() => {
              history.push('/money_exchange')
            }}>
            환전
          </button>
        </div>
      </section>
      <List />
    </div>
  )
}

export default WalletPage