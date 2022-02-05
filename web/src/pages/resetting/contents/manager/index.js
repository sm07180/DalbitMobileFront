import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import Tabmenu from '../../components/Tabmenu.js'

import '../../style.scss'
import './manager.scss'

const tabmenu = ['관리', '등록']  

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
            <section className="managerWrap">
              {managerList.length > 0 ? (
                <>
                  {managerList.map((item, index)=>{
                    const {nickNm, memId, profImg} = item
                    return(
                      <ListRow photo={profImg.thumb80x80} key={index}>
                        <div className="listInfo">
                          <div className="listItem">
                            <GenderItems/>
                            <span className="nickNm">{nickNm}</span>
                          </div>
                          <div className="listItem">
                            <span className="memId">{memId}</span>
                          </div>
                        </div>
                        <button>해제</button>
                      </ListRow>
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
            <section className="searchWrap"></section>
            <section className="counterWrap">
              <div>검색 결과<span>1</span></div>
            </section>
          </>
        )}
        
      </div>
    </div>
  )
}

export default SettingManager
