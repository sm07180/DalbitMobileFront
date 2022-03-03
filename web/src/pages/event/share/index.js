import React, {useContext, useEffect, useRef, useState} from 'react'

import Header from 'components/ui/header/Header'

import LayerPopup from '../../../components/ui/layerPopup/LayerPopup'
import PopSlide, {closePopup} from "../../../components/ui/popSlide/PopSlide";

import './share.scss'
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "redux/actions/common";
import UseInput from "common/useInput/useInput";
import API from "context/api";
import Api from "context/api";
import {Context} from "context";
import {useHistory} from "react-router-dom";
import {isDesktop} from "lib/agent";
import {Hybrid, isHybrid} from "context/hybrid";
import {authReq} from "pages/self_auth";
import axios from "axios";

const Share = () => {
    const [popup, setPopup] = useState(false);
    const [urlInfo, setUrlInfo] = useState('')
    const commonPopup = useSelector(state => state.popup);
    const dispatch = useDispatch();
    const urlInputRef = useRef();
    const context = useContext(Context);
    const history = useHistory();
    const [isAuth, setIsAuth] = useState(false);

    async function imageDownload() {
      if(!isHybrid()) {
        axios.get(`https://photo.dalbitlive.com/fileDownload/event/202201011.png`, {responseType: 'arraybuffer'})
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
            if(url) {
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'https://photo.dalbitlive.com/fileDownload/event/202201011.png');
              document.body.appendChild(link);
              link.click();
              link.remove();
            }
          })
      }else {
        Hybrid('openUrl', 'https://photo.dalbitlive.com/fileDownload/event/202201011.png')
      }
    }

    const onFocus = (e) => {
        const targetClassName = e.target.parentNode;
        targetClassName.classList.add('focus');
    }
    const onBlur = (e) => {
        const targetClassName = e.target.parentNode;
        targetClassName.classList.remove('focus');
    }

    const popupOpen = () => {
      setPopup(true);
    }

    const popSlideOpen = () => {
      if (context?.token) {
        if(!context.token.isLogin) {
          history.push('/login')
        }else if(isAuth) {
          dispatch(setSlidePopupOpen());
        }else {
          Api.self_auth_check({}).then((res) => {
            if (res.result === 'success') {
              setIsAuth(true);
              dispatch(setSlidePopupOpen());
            }else {
              context.action.confirm({
                msg: `이벤트에 참여하기 위해 본인인증을 완료해 주세요.`,
                callback: () => {
                  authReq('12', context.authRef, context, '/event/share');
                }
              })
            }
          })
        }
      }
    }

    const popSlideClose = () => {
      setUrlInfo('');
      closePopup(dispatch);
    }

    /* 등록 api */
    const eventInsApi = () => {
      const {profile} = context;
      const memNo = profile.memNo;
      const loginMedia = isDesktop() ? 'w' : isHybrid() ? 's' : 'x'
      const insParam = {
        memNo,
        tailMemNo: memNo,
        tailMemId: profile.memId,
        tailMemSex: profile.gender,
        tailConts: urlInfo,
        tailLoginMedia: loginMedia,
      }
      API.shareTailIns(insParam).then(res => {
        const code = res.code;
        if(code === '0') {
          context.action.alert({
            msg: '등록이 완료되었습니다.'
          })
          popSlideClose();
        }else if(code === '-2') { // 이미 등록
          context.action.alert({
            msg: '이미 등록된 URL입니다.<br/>확인 후 다시 등록해주세요.'
          })
        }else { // 등록 실패
          context.action.alert({
            msg: res.message
          })
        }
      });
    }

    /* 등록 */
    const submitAction = () => {
      let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      if(regex.test(urlInfo)) {
        eventInsApi();
      }else {
        context.action.alert({
          msg: '유효하지 않은 URL 입니다.'
        })
      }
    }

    const urlInputValidator = (value) => {
      const spacePattern = /\s/g;
      return value.length <= 300 && !spacePattern.test(value);
    }

    useEffect(() => {
      Api.self_auth_check({}).then((res) => {
        if (res.result === 'success') {
          setIsAuth(true);
        }
      })
    }, []);

    return (
        <>
            <div id="share">        
                <Header position={'sticky'} title={'이벤트'} type={'back'}/>
                <div className='content'>
                    <div className='imageBox'>
                        <img src='https://image.dalbitlive.com/event/dalla/7650/event_MainImg.png' alt="달라를 소개해달라" className='fullImage'/>
                        <button className='noticeBtn' onClick={popupOpen}>유의사항</button>
                    </div>
                    <div className='step'>
                        <div className='stepTop'>
                            <span className='stepBox'>STEP1</span>
                        </div>
                        <div className='stepContent'>
                            <p className='stepText'>
                                아래의 <strong>이미지 다운로드</strong> 버튼을 클릭해<br/>
                                이미지를 저장한다!
                            </p>
                            <button className='eventBtn' onClick={imageDownload}>이미지 다운로드</button>
                        </div>
                    </div>
                    <div className='step'>
                        <div className='stepTop'>
                            <span className='stepBox'>STEP2</span>
                        </div>
                        <div className='stepContent'>
                            <p className='stepText'>
                                <strong>SNS(페이스북, 인스타그램)</strong>에<br/>
                                저장한 이미지와 함께 한줄평을 작성 후<br/>
                                <strong>#달라가달라졌다</strong> 해시태그와 함께글을 게시한다!<br/>
                                악플은 노노노~ (스위트걸 st.)
                            </p>
                        </div>
                    </div>
                    <div className='step'>
                        <div className='stepTop'>
                            <span className='stepBox'>STEP3</span>
                        </div>
                        <div className='stepContent'>
                            <p className='stepText'>
                                인증하기 버튼을 클릭해서<br/>
                                게시글의 URL을 남긴다! 끝!
                            </p>
                            <div className='stepTip'>
                                <div className='tipTitle'>꿀팁!</div>
                                <p className='tipText'>
                                    게시글에 친구 초대 이벤트에서 받은 <br/>
                                    내 친구 초대 코드까지 남긴다면..?
                                </p>
                            </div>
                            <button className="eventBtn" onClick={popSlideOpen}>인증하기</button>
                        </div>
                    </div>
                </div>
            </div>
            {
                popup &&
                <LayerPopup setPopup={setPopup}>
                    <div className='popTitle'>유의사항</div>
                    <div className='popContent'>
                        <ul className='noticeList'>
                            <li>상금은 제세공과금 없이 환전 가능한 “별”로 지급해드립니다.</li>
                            <li>기프티콘은 이벤트 종료 후 일주일 안에 본인인증에 사용 하신 번호로 발송해드립니다.</li>
                            <li>기프티콘이 품절될 경우 동일 가격대의 다른 상품으로 대체됩니다.</li>
                            <li>게시글을 삭제하거나 비공개 처리할 경우 당첨 제외됩니다.</li>
                            <li>비공개 계정으로는 참여할 수 없습니다.</li>
                            <li>게시글은 전체 공개로 게시해야 합니다.</li>
                            <li>본 이벤트는 사전 고지 없이 변경 및 종료 될 수 있습니다.</li>
                        </ul>
                    </div>
                </LayerPopup>
            }
            {commonPopup.commonPopup &&
                <PopSlide title="인증하기" closeCallback={() => {setUrlInfo('')}}>
                    <div className='shareUrl'>
                        <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
                          <UseInput name={"url"}
                                    placeholder="게시글의 URL을 입력해주세요."
                                    forwardedRef={urlInputRef}
                                    value={urlInfo}
                                    setValue={setUrlInfo}
                                    validator={urlInputValidator}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                          />
                        </div>
                        <p className='caution'>한 번 입력하면 수정이 불가능하니<br/>주의해주세요.</p>
                        <div className='btnWrap'>
                            <button className='cancelBtn' onClick={popSlideClose}>취소</button>
                            <button className={`submitBtn ${urlInfo === "" ? "disable" : ""}`} onClick={submitAction}>확인</button>
                        </div>
                    </div>
                </PopSlide>
            }
        </>
        
    ) 
}

export default Share
