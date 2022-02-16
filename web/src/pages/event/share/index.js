import React, {useEffect, useState, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import Api from 'context/api'

import Header from 'components/ui/header/Header'
import './share.scss'

const Share = () => {

  return (
    <div id="share">        
        <Header position={'sticky'} title={'이벤트'} type={'back'}/>
        <div className='content'>
            <div className='imageBox'>
                <img src='https://image.dalbitlive.com/event/dalla/7650/event_MainImg.png' alt="달라를 소개해달라" className='fullImage'/>
                <button className='noticeBtn'>유의사항</button>
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
                    <button className='eventBtn'>이미지 다운로드</button>
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
                </div>
            </div>
        </div>
    </div>
  )
}

export default Share
