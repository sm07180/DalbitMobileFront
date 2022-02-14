import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'

// components
import Tabmenu from '../../components/tabmenu'
import FilterBtn from '../../components/FilterBtn'
import SettingList from '../../components/SettingList'

import '../../style.scss'
import './manager.scss'

const tabmenu = ['관리', '등록']
const filter = ['전체','닉네임','ID']

const SettingManager = () => {
  const [tabType, setTabType] = useState(tabmenu[0])
  const [managerList, setManagerList] = useState([])

  const getManagerList = () =>{
    Api.mypage_manager_list({}).then((res) =>{
      if (res.result === 'success'){
        setManagerList(res.data.list)
      }
    })
  }
  
  useEffect(() => {
    getManagerList()
  }, [])

  return (
    <div id="manager">
      <Header position={'sticky'} title={'매니저 관리'} type={'back'}/>
      <div className='subContent'>
        <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
        {tabType === tabmenu[0] ? (
          <>
            <section className="counterWrap">
              <div>등록 된 매니저<span>{managerList.length}</span></div>
            </section>
            <section className="listWrap">
              {managerList.length > 0 ? (
                <>
                  {managerList.map((item, index)=>{
                    return(
                      <SettingList data={item} key={index}>
                        <button className="delete">해제</button>
                      </SettingList>
                      )
                  })}
                </>
              ) : (
                <>
                  <div className="noResult">등록된 고정 매니저가 없습니다.</div> 
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
              {managerList.length > 0 ? (
                <>
                  {managerList.map((list, index)=>{
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
    </div>
  )
}

export default SettingManager
