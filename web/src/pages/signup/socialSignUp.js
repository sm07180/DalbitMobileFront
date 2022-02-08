import React from 'react';
import './style.scss'
import Api from "context/api";

import qs from "query-string";
import {Hybrid, isAndroid, isHybrid} from "context/hybrid";
import Utility from "components/lib/utility";
import {Context} from "context";
import {useHistory} from "react-router-dom";
import Header from "components/ui/header/Header";


const SocialSignUp = (props) => {

  const onFocus = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.add('focus')
  }
  const onBlur = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.remove('focus')
  }

  return (
    <div id='signPage'>
      <Header type="back"/>
      <section className='signField'>
        <div className='title'>
          <h2>{`소셜 로그인 정보를\n입력해주세요.`}</h2>
        </div>

        <div className="profileUpload">
          <label htmlFor="profileImg">
            <div></div>
            <span>클릭 이미지 파일 추가</span>
          </label>
          <input type="file" id="profileImg" accept="image/jpg, image/jpeg, image/png"/>
        </div>

        <div className='inputWrap'>
          <div className={`inputItems`}>
            <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
              <input type="text" id="nickNm" name="nickNm" placeholder="소셜닉네임" autoComplete="off" maxLength={20}/>
            </div>
          </div>
        </div>
        <button type={"button"} className={`submitBtn`} onClick={() => {
          console.log("다음")
        }}>완료
        </button>
      </section>
    </div>
  );
};

export default SocialSignUp;