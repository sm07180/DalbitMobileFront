import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
// components
import Tabmenu from '../../components/Tabmenu.js'

import '../../style.scss'

const walletTabmenu = ['관리', '등록']  

const SettingManager = () => {
  const [walletType, setWalletType] = useState(walletTabmenu[0])


  return (
    <>
      <Header position={'sticky'} title={'매니저 관리'} type={'back'}/>
      <div className='subContent'>
        <Tabmenu data={walletTabmenu} tab={walletType} setTab={setWalletType} />
      </div>
    </>
  )
}

export default SettingManager
