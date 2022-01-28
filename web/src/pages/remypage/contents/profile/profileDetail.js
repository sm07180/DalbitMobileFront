import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
// components
// contents
// css
import './profileDetail.scss'

const ProfileDetail = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context

  // 페이지 시작
  return (
    <div id="profileDetail">
      <Header type={'back'}>
        <div className="buttonGroup">
          <button className='more'>더보기</button>
        </div>
      </Header>
      <section className='detailWrap'>
        <div className="detail">
          <ListRow photo={profile.profImg.thumb50x50}>
            <div className="listContent">
              <div className="nick">{profile.nickNm}</div>
              <div className="time">3시간전</div>
            </div>
          </ListRow>
          <div className="text">
          일주년 일부 방송 끝!
          신년이기도 하고 1일이라 바쁘신 분들도 많으실텐데
          와주신 모든 분들 너무 감사합니다!  
          내일 오후에는 정규 시간, 룰렛으로  만나요 : )

          *1/2 수정되엉ㅆ따 
          </div>
          <div className="info">
            <i className='like'></i>
            <span>123</span>
            <i className='comment'></i>
            <span>321</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfileDetail
