import React, {useEffect, useState} from 'react'

import '../invite.scss'

const SnsPromotion = () => {
 
  return (
    <div id="snsPromotion">
        <div className='snsContent'>
            <div className='logo'>
                <img src="https://image.dalbitlive.com/common/logo/logo.png" alt="dalla 로고"/>
            </div>
            <div className='text'>
                <strong>초대 코드</strong>를 사용해 달라에 가입하고<br/>
                <strong>최대 100만원</strong> 받아가세요!
            </div>
            <div className='method'>
                <span>① 달라를 연다</span>
                <span>② 초대인의 초대코드를 입력한다</span>
                <span>③ 더 많은 혜택을 누린다!</span>
            </div>
            <button className={`copyBtn`}>
              <span className='codeText'>EfD39z</span>
              <span className='btnName'>초대코드 복사하기</span>
            </button>
        </div>
        <button className='appDownload'>
            <img src="https://image.dalbitlive.com/event/invite/appDownload.png" alt="앱 다운로드"/>
        </button>
    </div>
  )
}

export default SnsPromotion
