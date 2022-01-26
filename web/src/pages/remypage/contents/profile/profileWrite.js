import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
// components
// contents
// css
import './profileWrite.scss'

const ProfileWrite = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context

  // 페이지 시작
  return (
    <div id="profileWrite">
      <Header title={'글쓰기'} type={'back'}>
        <button className='cancel'>취소</button>
        <div className="buttonGroup">
          <button className='addBtn active'>등록</button>
          <button className='editBtn'>수정</button>
        </div>
      </Header>
      <section className='writeWrap'>
        <textarea maxLength={1000} placeholder='작성하고자 하는 글의 내용을 입력해주세요.'></textarea>
        <div className="textCount"><span>0</span> / 1000</div>
        <div className="writeGnb">
          <button className='insertPicture'>사진등록</button>
          <button className='insertFix active'>상단고정</button>
        </div>
      </section>
    </div>
  )
}

export default ProfileWrite
