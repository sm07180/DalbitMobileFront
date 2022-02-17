import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Hybrid, isAndroid, isHybrid} from "context/hybrid";
import {Context} from "context";
import {PHOTO_SERVER} from "context/config";

import Api from "context/api";
import qs from "query-string";
import Utility from "components/lib/utility";
import useDidMountEffect from "common/hook/useDidMountEffect";

import Header from "components/ui/header/Header";
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'

import PopupPrivacy from './components/PopupPrivacy'
import PopupTerms from './components/PopupTerms'

import './style.scss'

const SocialSignUp = () => {
  const context = useContext(Context)
  const {webview, redirect} = qs.parse(location.search);
  const history = useHistory();

  const [popup, setPopup] = useState(false);
  const [btnActive, setBtnActive] = useState(false);
  const [popupVal, setPopupVal] = useState("")

  let snsInfo = qs.parse(location.search);
  if (_.hasIn(snsInfo, 'nickNm')) {
    snsInfo = {...snsInfo, nickNm: snsInfo.nickNm.replace(/(\s*)/g, '')}
  }
  if (_.hasIn(snsInfo, 'profImgUrl') && snsInfo.profImgUrl.includes('http://')) {
    snsInfo = {...snsInfo, profImgUrl: snsInfo.profImgUrl.replace('http://', 'https://')}
  }

  const [signForm, setSignForm] = useState({
    phoneNum:"",
    requestNum:"",
    CMID:"",
    nickName:"",
    password:"",
    passwordCheck:"",
    memType : "p",
    profImgUrl :"",
    ...snsInfo
  })

  const nicknameCheckRef = useRef(null);
  const [checkNickNameValue, setCheckNickNameValue] = useState({
    check:false,
    message:"닉네임을 2자이상 입력해주세요."
  });
  const onFocus = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.add('focus')
  }
  const onBlur = (e) => {
    const targetClassName = e.target.parentNode
    targetClassName.classList.remove('focus')
  }
  const onChange = (e) => {
    const { value, name } = e.target;
    setSignForm({
      ...signForm,
      [name]: value
    });
  };

  useDidMountEffect(()=>{
    checkNickName();
  },[signForm.nickName]);
  const checkNickName = () =>{
    Api.nickName_check({params: {nickNm: signForm.nickName}}).then(res=>{
      if (res.result === 'success' && res.code === '1') {
        document.getElementById('nickNameInputItem').classList.add("success");
        document.getElementById('nickNameInputItem').classList.remove("error");
        nicknameCheckRef.current.innerHTML = res.message;
        setCheckNickNameValue({check: true, message: res.message});
      } else if (res.result === 'fail') {
        if (res.code === '0') {
          document.getElementById('nickNameInputItem').classList.add("error");
          document.getElementById('nickNameInputItem').classList.remove("success");
          nicknameCheckRef.current.innerHTML = res.message;
          setCheckNickNameValue({check: false, message: res.message});
        }else{
          //fixme 문구수정
          document.getElementById('nickNameInputItem').classList.add("error");
          document.getElementById('nickNameInputItem').classList.remove("success");
          nicknameCheckRef.current.innerHTML = res.message;
          setCheckNickNameValue({check: false, message: res.message});
        }
      }
    });
  }
  const uploadSingleFile = (e) => {
    let reader = new FileReader()
    if (e.target.files.length === 0) return null
    const file = e.target.files[0]
    const fileName = file.name
    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop()
    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png']
      return list.includes(ext)
    }
    if (!extValidator(fileExtension)) {
      return context.action.alert({
        msg: 'jpg, png 이미지만 사용 가능합니다.'
      })
    }
    //파일을 배열 버퍼로 읽는 최신 약속 기반 API
    reader.readAsArrayBuffer(file)
    //오리엔테이션 뽑아내는 함수
    function getOrientation(buffer) {
      var view = new DataView(buffer)
      if (view.getUint16(0, false) !== 0xffd8) {
        return {
          buffer: view.buffer,
          orientation: -2
        }
      }
      var length = view.byteLength,
        offset = 2
      while (offset < length) {
        var marker = view.getUint16(offset, false)
        offset += 2
        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            return {
              buffer: view.buffer,
              orientation: -1
            }
          }
          var little = view.getUint16((offset += 6), false) === 0x4949
          offset += view.getUint32(offset + 4, little)
          var tags = view.getUint16(offset, little)
          offset += 2
          for (var i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              const orientation = view.getUint16(offset + i * 12 + 8, little)
              view.setUint16(offset + i * 12 + 8, 1, little)
              return {
                buffer: view.buffer,
                orientation
              }
            }
          }
        } else if ((marker & 0xff00) !== 0xff00) {
          break
        } else {
          offset += view.getUint16(offset, false)
        }
      }
      return {
        buffer: view.buffer,
        orientation: -1
      }
    }
    reader.onload = function () {
      if (reader.result) {
        const originalBuffer = reader.result
        const {buffer, orientation} = getOrientation(originalBuffer)
        const blob = new Blob([buffer])
        //createObjectURL 주어진 객체를 가리키는 URL을 DOMString으로 반환합니다
        const originalCacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(file)
        const cacheURL = (window.URL || window.webkitURL || window || {}).createObjectURL(blob)
        const img = new Image()
        img.src = cacheURL
        img.onload = async () => {
          const limitSize = 1280
          if (img.width > limitSize || img.height > limitSize) {
            img.width = img.width / 5
            img.height = img.height / 5
          }
          const encodedDataAsBase64 = drawAdjustImage(img, orientation)
          uploadImageToServer(encodedDataAsBase64)
        }
      }
    }
  }
  async function uploadImageToServer(imgData) {
    const {result, data} = await Api.image_upload({
      data: {
        dataURL: imgData,
        uploadType: 'profile'
      }
    })
    if (result === 'success') {
      setSignForm({
        ...signForm,
        profImgUrl: data.path
      })
    } else {
      context.action.alert({
        msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.'
      })
    }
  }

  useEffect(() => {
    if (signForm.profImgUrl.includes('https://')) {
      uploadImageToServer(signForm.profImgUrl)
    }
  }, [signForm.profImgUrl])

  useEffect(() => {
    //Facebook,Firebase 이벤트 호출
    try {
      fbq('track', 'Lead')
      firebase.analytics().logEvent('Lead')
      kakaoPixel('114527450721661229').participation()
    } catch (e) {}
  }, [])

  //1. 회원가입
  async function signUp() {
    const nativeTid = context.nativeTid == null || context.nativeTid == 'init' ? '' : context.nativeTid
    const {result, data, message} = await Api.member_join({
      data: {
        memType: signForm.memType, memId: signForm.memId, memPwd: signForm.password, nickNm: signForm.nickName,
        birth: '', term1: 'y', term2: 'y', term3: 'y', term4: 'y', term5: 'y',
        profImg: signForm.profImgUrl, profImgRacy: 3, nativeTid: nativeTid, os: context.customHeader.os
      }
    })
    if (result === 'success') {
      //Facebook,Firebase 이벤트 호출
      addAdsData();
      context.action.alert({
        callback: () => {
          //애드브릭스 이벤트 전달
          if (data.adbrixData != '' && data.adbrixData != 'init') {
            Hybrid('adbrixEvent', data.adbrixData)
          }
          loginFetch()
        },
        msg: '회원가입 기념으로 달 1개를 선물로 드립니다.\n달라 즐겁게 사용하세요.'
      })
    } else {
      context.action.alert({
        msg: message
      })
      context.action.updateLogin(false)
    }
  }
  //3. 로그인
  async function loginFetch() {
    const nowRoomNo = sessionStorage.getItem("room_no");
    const loginInfo = await Api.member_login({
      data: {
        memType: signForm.memType,
        memId: signForm.memId,
        room_no: nowRoomNo === null || nowRoomNo === undefined ? "" : nowRoomNo,
      }
    })

    if (loginInfo.result === 'success') {
      const {memNo} = loginInfo.data
      context.action.updateToken(loginInfo.data)
      const profileInfo = await Api.profile({params: {memNo}})
      if (profileInfo.result === 'success') {
        if (isHybrid()) {
          if (webview && webview === 'new') {
            Hybrid('GetLoginTokenNewWin', loginInfo.data)
          } else {
            Hybrid('GetLoginToken', loginInfo.data)
          }
        }
        if (redirect) {
          const decodedUrl = decodeURIComponent(redirect)
          return (window.location.href = decodedUrl)
        }
        context.action.updateProfile(profileInfo.data)
        return history.push('/event/recommend_dj2')
      }
    } else if (loginInfo.result === 'fail') {
      context.action.alert({title: '로그인 실패', msg: `${loginInfo.message}`})
    }

  }
  //2. 애드브릭스
  const addAdsData = async () => {
    const firebaseDataArray = [
      { type : "firebase", key : "CompleteRegistration", value : {} },
      { type : "adbrix", key : "CompleteRegistration", value : {} },
    ];
    kakaoPixel('114527450721661229').completeRegistration()
    Hybrid('eventTracking', {service :  firebaseDataArray})
  }

  //약관동의 체크유무
  const checkSelectAll = () => {
    const checkboxes = document.querySelectorAll('input[name="checkList"]');
    const checked = document.querySelectorAll('input[name="checkList"]:checked');
    const selectAll = document.querySelector('input[name="checkListAll"]');

    if (checkboxes.length === checked.length) {
      selectAll.checked = true;
      setBtnActive(true)
    } else {
      selectAll.checked = false;
      setBtnActive(false)
    }
  }

  //약관동의 전체선택
  const selectAll = (e) => {
    const checkboxes = document.querySelectorAll('input[name="checkList"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked
    })
    if (e.target.checked) {
      setBtnActive(true)
    } else {
      setBtnActive(false)
    }
  }

  // 팝업 띄우기
  const popupOpen = (val) => {
    setPopup(true);
    setPopupVal(val)
  }

  return (
    <>
      <div id='signPage'>
        <Header type="back"/>
        <section className='signField'>
          <div className='title'>
            <h2>{`소셜 로그인 정보를\n입력해주세요.`}</h2>
          </div>

          <div className="profileUpload">
            <label htmlFor="profileImg">
              <div className='uploadImg' style={{backgroundImage: `url(${PHOTO_SERVER}${signForm.profImgUrl})`}}/>
              <span>클릭 이미지 파일 추가</span>
            </label>
            <input type="file" id="profileImg" accept="image/jpg, image/jpeg, image/png" onChange={uploadSingleFile}/>
          </div>

          <div className='inputWrap'>
            <div className={`inputItems`} id={'nickNameInputItem'}>
              <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
                <input type="text" name={"nickName"} placeholder="최대 20자까지 입력" value={signForm.nickName}
                      onChange={onChange} autoComplete="off" maxLength={20}/>
              </div>
              <p className='textLog' ref={nicknameCheckRef} />
            </div>
          </div>

          <div className='agree'>
            <div className='agreeTitle'>이용 약관 동의</div>
            <div className="agreeWrap">
              <div className="agreeListAll">
                <label className="inputLabel">
                  <input type="checkbox" className="blind" name="checkListAll" onChange={selectAll}/>
                  <span className="checkIcon"/>
                  <p className="checkinfo">네, 모두 동의합니다.</p>
                </label>
              </div>
              <div className='agreeListWrap'>
                <div className="agreeList">
                  <label className="inputLabel">
                    <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                    <span className="checkIcon"/>
                    <p className="checkinfo">(필수) 만 14세 이상입니다.</p>
                  </label>
                </div>
                <div className="agreeList">
                  <label className="inputLabel">
                    <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                    <span className="checkIcon"/>
                    <p className="checkinfo">(필수) 이용약관</p>
                    <button className='policyBtn' onClick={() => popupOpen("terms")}>보기</button>
                  </label>
                </div>
                <div className="agreeList">
                  <label className="inputLabel">
                    <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                    <span className="checkIcon"/>
                    <p className="checkinfo">(필수) 개인정보 취급 방침</p>
                    <button className='policyBtn' onClick={() => popupOpen("privacy")}>보기</button>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <SubmitBtn text="완료" onClick={signUp}/>
        </section>
      </div>
      {
        popup &&
        <LayerPopup setPopup={setPopup}>
          <div className='popTitle'>{popupVal === "terms" ? "이용약관" : "개인정보 취급 방침"}</div>
          <div className='popContent'>
            {popupVal=== "terms" ?
              <PopupTerms/>
              :
              <PopupPrivacy/>
            }
          </div>
        </LayerPopup>
      }
    </>
    
  );
};

export default SocialSignUp;


//캔버스로 그려서 dataurl 로 뽑아내는 함수
function drawAdjustImage(img, orientation) {
  const cnvs = document.createElement('canvas')
  const ctx = cnvs.getContext('2d')
  let dx = 0
  let dy = 0
  let dw
  let dh
  let deg = 0
  let vt = 1
  let hr = 1
  let rad
  let sin
  let cos
  cnvs.width = orientation >= 5 ? img.height : img.width
  cnvs.height = orientation >= 5 ? img.width : img.height
  switch (orientation) {
    case 2: // flip horizontal
      hr = -1
      dx = cnvs.width
      break
    case 3: // rotate 180 degrees
      deg = 180
      dx = cnvs.width
      dy = cnvs.height
      break
    case 4: // flip upside down
      vt = -1
      dy = cnvs.height
      break
    case 5: // flip upside down and rotate 90 degrees clock wise
      vt = -1
      deg = 90
      break
    case 6: // rotate 90 degrees clock wise
      deg = 90
      dx = cnvs.width
      break
    case 7: // flip upside down and rotate 270 degrees clock wise
      vt = -1
      deg = 270
      dx = cnvs.width
      dy = cnvs.height
      break
    case 8: // rotate 270 degrees clock wise
      deg = 270
      dy = cnvs.height
      break
  }
  rad = deg * (Math.PI / 180)
  sin = Math.sin(rad)
  cos = Math.cos(rad)
  ctx.setTransform(cos * hr, sin * hr, -sin * vt, cos * vt, dx, dy)
  dw = orientation >= 5 ? cnvs.height : cnvs.width
  dh = orientation >= 5 ? cnvs.width : cnvs.height
  ctx.drawImage(img, 0, 0, dw, dh)
  return cnvs.toDataURL('image/jpeg', 1.0)
}