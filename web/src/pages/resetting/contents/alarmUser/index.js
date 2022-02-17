import React, {useState, useEffect, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import moment from 'moment'

import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
import GenderItems from 'components/ui/genderItems/GenderItems'

import '../../style.scss'
import './alarmUser.scss'

const SettingAlarm = () => {
  const [pushMembers, setPushMembers] = useState([])

  const fetchData = () =>{
    Api.getPushMembers({}).then((res) =>{
      if (res.result === 'success'){
        console.log(res);
        setPushMembers(res.data.list)
      }
    })
  }
  const regData = moment(pushMembers.regDt).format('YYYY년 MM월 DD일')
  
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div id="alarmUser">
      <Header position={'sticky'} title={'알림 받기 설정 회원 관리'} type={'back'}/>
      <section className="listWrap">
        {pushMembers.length > 0 ? (
          pushMembers.map((data, index)=>{
            const {nickNm, profImg, regDt, memNo} = data
            return(
              <ListRow photo={profImg.thumb80x80} key={index}>
                <div className="listInfo">
                  <div className="listItem">
                    <GenderItems/>
                    <span className="nickNm">{nickNm}</span>
                  </div>
                  <div className="listItem">
                    <span className="regDt">설정일 : {regData}</span>
                  </div>
                </div>
                <button className="delete">해제</button>
              </ListRow>
            )
          })
        ) : (
          <>
            <div className="noResult">등록한 회원이 없습니다.</div>
          </>
        )}
      </section>
      <section className="noticeInfo">
        <h3>유의사항</h3>
        <p>팬으로 등록하지 않고도 🔔 알림받기를 설정하여 선택한 회원의 방송시작 알림을 받을 수 있습니다.</p>
      </section>
    </div>
  )
}

export default SettingAlarm
