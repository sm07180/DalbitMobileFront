import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
// global components
import Header from 'components/ui/header/Header'
import GenderItems from 'components/ui/genderItems/GenderItems'
// components
import TopSwiper from '../../components/TopSwiper'
import InputItems from '../../components/InputItems'
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
              <div className="photo">
                <img src={profile && profile.profImg && profile.profImg.thumb100x100} alt="" />
              </div>
            </div>
            <div>
              <button>+</button>
            </div>
            <div>
              <button>+</button>
            </div>
            <div>
              <button>+</button>
            </div>
            <div>
              <button>+</button>
            </div>
            <div>
              <button>+</button>
            </div>
            <div>
              <button>+</button>
            </div>
            <div>
              <button>+</button>
            </div>
            <div>
              <button>+</button>
            </div>
            <div>
              <button>+</button>
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
        <div className="inputGroup">
          <InputItems title={'생년월일'}>
            <button className='inputChange'>변경</button>
          </InputItems>
          <InputItems title={'성별'}>
            <div className="innerBox">
              <GenderItems data={profile.gender} size={18} />
              {profile.gender === 'm' ? 
                <span className='text'>남자</span>
                :
                <span className='text'>여자</span>
              }
            </div>
          </InputItems>
        </div>
        <InputItems title={'프로필 메시지'} type={'textarea'}>
          <textarea rows="4" maxLength="100" placeholder='입력해주세요.'></textarea>
          <div className="textCount">0/100</div>
        </InputItems>
      </section>
      <section className="passwordEdit">
        <InputItems title={'휴대폰 번호'} button={'인증하기'}>
          <input type="tel" maxLength="15" placeholder='번호를 입력해주세요.' />
        </InputItems>
        <InputItems title={'인증번호'} button={'확인'}>
          <input type="text" maxLength="9" placeholder='인증번호를 입력해주세요.' />
        </InputItems>
        <InputItems title={'비밀번호'}>
          <input type="password" maxLength="9" placeholder='8~20자 영문/숫자/특수문자 중 2가지 이상 조합' />
        </InputItems>
        <InputItems title={'비밀번호 확인'}>
          <input type="password" maxLength="9" placeholder='비밀번호를 한번 더 입력해주세요.' />
        </InputItems>
      </section>
    </div>
  )
}

export default ProfileEdit
