import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'

// components
import Tabmenu from '../../components/Tabmenu'
import FilterBtn from '../../components/FilterBtn'
import SettingList from '../../components/SettingList'

import '../../style.scss'
import './blackList.scss'

const tabmenu = ['관리', '등록']
const filter = ['전체','닉네임','ID']

const Settingblack = () => {
  const [tabType, setTabType] = useState(tabmenu[0])
  const [blackList, setblackList] = useState([])

  const getblackList = () =>{
    Api.mypage_black_list({}).then((res) =>{
      if (res.result === 'success'){
        setblackList(res.data.list)
      }
    })
  }
  
  useEffect(() => {
    getblackList()
  }, [])

  return (
    <div id="black">
      <Header position={'sticky'} title={'차단회원 관리'} type={'back'}/>
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      {tabType === tabmenu[0] ? (
        <>
          <section className="counterWrap">
            <div>차단 회원<span>{blackList.length}</span></div>
          </section>
          <section className="listWrap">
            {blackList.length > 0 ? (
              <>
                {blackList.map((item, index)=>{
                  return(
                    <SettingList data={item} key={index}>
                      <button className="delete">해제</button>
                    </SettingList>
                    )
                })}
              </>
            ) : (
              <>
                <div className="noResult">등록한 차단회원이 없습니다.</div> 
              </>
            )}
          </section>
        </>
      ): (
        <>
          <section className="inputWrap">
            <div className="inputBox">
              <FilterBtn data={filter} />
              <input type="text" placeholder='검색어를 입력해 보세요'/>
              <span className="icon"></span>
            </div>
          </section>
          <section className="counterWrap">
            <div>검색 결과<span>1</span></div>
          </section>
          <section className="listWrap">
            {blackList.length > 0 ? (
              <>
                {blackList.map((list, index)=>{
                  return(
                    <SettingList data={list} key={index}>
                      <button className="add">등록</button>
                    </SettingList>
                    )
                })}
              </>
            ) : (
              <>
                <div className="noResult">검색된 결과가 없습니다.</div> 
              </>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Settingblack
