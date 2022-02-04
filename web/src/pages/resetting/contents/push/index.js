import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import TabBtn from 'components/ui/tabBtn/TabBtn'

import SwitchList from '../../components/switchList'

import '../../style.scss'

const SettingPush = () => {
  const tabList = ['무음','소리','진동'];
  const [tabType, setTabType] = useState(tabList[0])

  return (
    <>
      <Header position={'sticky'} title={'Push 알림 설정'} type={'back'}/>
      <div className='subContent'>
        <div className='tabWrap'>
          <p className='topText'>메시지 알림</p>
          <ul className="tabmenu">
            {tabList.map((data,index) => {
              const param = {
                item: data,
                tab: tabType,
                setTab: setTabType,
              }
              return (
                <TabBtn param={param} key={index} />
              )
            })}
          </ul>
        </div>
        <div className='switchWrap'>
            <SwitchList title={"전체 알림 수신"} mark={true} on={true}></SwitchList>
        </div>
      </div>
    </>
  )
}

export default SettingPush
