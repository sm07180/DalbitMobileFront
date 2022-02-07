import React, {useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
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
        <div className="buttonGroup">
          <button className='insertFix active'>상단고정</button>
        </div>
      </Header>
      <section className='writeWrap'>
        <textarea maxLength={1000} placeholder='작성하고자 하는 글의 내용을 입력해주세요.'></textarea>
        <div className="textCount"><span>0</span> / 1000</div>
        <div className="insertGroup">
          <div className="title">사진 첨부<span>(최대 1장)</span></div>
          {true ?
          <label>
            <input type="file" className='blind' />
            <button className='insertBtn'>+</button>
          </label>
          : 
          <label>
            <div className="insertPicture"></div>
            <button></button>
          </label>
          }
          <SubmitBtn text="등록" />
        </div>
      </section>
    </div>
  )
}

export default ProfileWrite
