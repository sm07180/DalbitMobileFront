import React, {useState} from 'react';
import './style.scss'
import Api from "context/api";

import qs from "query-string";
import {Hybrid, isAndroid, isHybrid} from "context/hybrid";
import Utility from "components/lib/utility";
import {Context} from "context";
import {useHistory} from "react-router-dom";
import Header from "components/ui/header/Header";
import InputItems from "components/ui/inputItems/inputItems";
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

const SocialSignUp = (props) => {
  const [uploadImg, setUploadImg] = useState("");

  const onFocus = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.add('focus')
  }
  const onBlur = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.remove('focus')
  }

  const profileImgUpload = (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
      setUploadImg(reader.result)
    }
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
            <div className='uploadImg' style={{backgroundImage: `url(${uploadImg})`}}></div>
            <span>클릭 이미지 파일 추가</span>
          </label>
          <input type="file" id="profileImg" accept="image/jpg, image/jpeg, image/png" onChange={profileImgUpload}/>
        </div>

        <div className='inputWrap'>
          <InputItems type="text">
            <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
              <input type="text" id="nickNm" name="nickNm" placeholder="소셜닉네임" autoComplete="off" maxLength={20}/>
            </div>
          </InputItems>
        </div>
        <SubmitBtn text="완료" onClick={() => {
          console.log("다음")
        }}/>
      </section>
    </div>
  );
};

export default SocialSignUp;