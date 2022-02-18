import React, {useEffect, useState, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import Api from 'context/api'

import LayerPopup from '../../../components/ui/layerPopup/LayerPopup'
import PopSlide from "../../../components/ui/popSlide/PopSlide";

import Header from 'components/ui/header/Header'
import './share.scss'

const Share = () => {
    const [popup, setPopup] = useState(false);
    const [popSlide, setPopSlide] = useState(false);
    const [certification, setCertification] = useState(false);
    const [urlInfo, setUrlInfo] = useState({
        url: "",
    })

    async function imageDownload() {
        // blob 형태로 들고 있어야 함.
        const res = await fetch('https://image.dalbitlive.com/event/dalla/7650/event_downloadImg.png');
        const blob = await res.blob();
    
        // anchor tag를 통해 다운 받는 방법
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.download = 'dallaEvent.png';
        link.innerHTML = 'download';
        link.click();
    }

    const onChange = (e) => {
        const { value, name } = e.target;
        setUrlInfo({[name]: value});
    };

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
        setPopSlide(true);
    }

    const popSlideClose = () => {
        setPopSlide(false);
    }

    const submitAction = () => {

        setPopSlide(false);
    }

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
                            <button className={`eventBtn ${certification ? "disable" : ""}`} onClick={popSlideOpen}>인증하기</button>
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
                            <li>한 회원 당 한 계정으로만 참여할 수 있습니다.</li>
                            <li>다수의 계정으로 중복 참여는 불가하지만 한 계정으로 중복 참여는 가능합니다.</li>
                            <li>상품은 이벤트 종료 후 일주일 안에 본인인증에 사용 하신 번호로 발송해드립니다.</li>
                            <li>도배 등의 행위는 재제 사유입니다.</li>
                            <li>상품이 품절될 경우 동일 가격대의 다른 상품으로 대체됩니다.</li>
                            <li>본 이벤트는 사전 고지 없이 변경 및 종료 될 수 있습니다.</li>
                        </ul>
                    </div>
                </LayerPopup>
            }
            {popSlide &&
                <PopSlide title="인증하기" setPopSlide={setPopSlide}>
                    <div className='shareUrl'>
                        <div className="inputBox" onFocus={onFocus} onBlur={onBlur}>
                            <input type="text" name={"url"} onChange={onChange} placeholder="게시글의 URL을 입력해주세요." autoComplete="off"/>
                        </div>
                        <p className='caution'>한 번 입력하면 수정이 불가능하니<br/>주의해주세요.</p>
                        <div className='btnWrap'>
                            <button className='cancelBtn' onClick={popSlideClose}>취소</button>
                            <button className={`submitBtn ${urlInfo.url === "" ? "disable" : ""}`} onClick={submitAction}>확인</button>
                        </div>
                    </div>
                </PopSlide>
            }
        </>
        
    ) 
}

export default Share
