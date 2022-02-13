import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
// global components
import Header from 'components/ui/header/Header'
import InputItems from 'components/ui/inputItems/inputItems'
// components
import TopSwiper from '../../components/topSwiper'
// contents

import './profileEdit.scss'

const ProfileEdit = () => {
  const history = useHistory()
  //context
  const context = useContext(Context)
  const {token, profile} = context
  
  const swiperParams = {
    slidesPerView: 'auto',
    spaceBetween: 8,
  }

  // 페이지 시작
  return (
    <div id="profileEdit">
      <Header title={'프로필 수정'} type={'back'}>
        <button className='saveBtn'>저장</button>
      </Header>
      <section className='topSwiper'>
        {true ? 
          <TopSwiper data={profile} />
          :
          <div className="nonePhoto">
            <i><img src="https://image.dalbitlive.com/mypage/dalla/coverNone.png" alt="" /></i>
          </div>
        }
      </section>
      <section className="insertPhoto">
        <div className="insertBtn">
          <div className="photo">
            <img src={profile && profile.profImg && profile.profImg.thumb100x100} alt="" />
            <button><img src="https://image.dalbitlive.com/mypage/dalla/addPhotoBtn.png" alt="" /></button>
          </div>
        </div>
        <div className="coverPhoto">
          <div className="title">커버사진 <small>(최대 10장)</small></div>
          <Swiper {...swiperParams}>
            <div>
              <label>
                <img src={profile && profile.profImg && profile.profImg.thumb100x100} alt="" />
                <button className="cancelBtn"></button>
              </label>
            </div>
            <div>
              <label>
                <img src={profile && profile.profImg && profile.profImg.thumb100x100} alt="" />
                <button className="cancelBtn"></button>
              </label>
            </div>
            <div>
              <div className='empty'>+</div>
            </div>
            <div>
              <div className='empty'>+</div>
            </div>
            <div>
              <div className='empty'>+</div>
            </div>
          </Swiper>
        </div>
      </section>
      <section className="editInfo">
        <InputItems title={'닉네임'}>
          <input type="text" maxLength="15" placeholder={profile.nickNm} />
          <button className='inputDel'></button>
        </InputItems>
        <InputItems title={'UID'}>
          <input type="text" placeholder={profile.memId} disabled />
        </InputItems>
        <InputItems title={'비밀번호'}>
          <input type="password" maxLength="20" placeholder='' />
          <button className='inputChange'>변경</button>
        </InputItems>
        <div className="inputItems">
          <div className="title">성별</div>
          <ul className="selectMenu">
            <li className='active'>남성</li>
            <li>여성</li>
          </ul>
          <ul className="selectMenu">
            <li className='active fixGender'>남성</li>
          </ul>
        </div>
        <InputItems title={'프로필 메시지'} type={'textarea'}>
          <textarea rows="4" maxLength="100" placeholder='입력해주세요.'></textarea>
          <div className="textCount">0/100</div>
        </InputItems>
      </section>
    </div>
  )
}

export default ProfileEdit
