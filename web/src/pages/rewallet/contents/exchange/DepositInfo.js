import React, {useState, useEffect,useContext} from 'react'
import {Context} from 'context'

// global components
import InputItems from 'components/ui/inputItems/inputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import CheckList from '../../components/CheckList'

const DepositInfo = (props) => {
  //context
  const context = useContext(Context)
  const {profile} = context

  const onClickFileBtn = () => {
    console.log('test');
  }
  
  return (
    <>
      <form className="formBox">
        <div className="listRow">
          <div className="title">예금주</div>
          <InputItems>
            <input type="text" placeholder=""/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">은행</div>
          <InputItems>
            <div className="select">은행선택</div>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">계좌번호</div>
          <InputItems>
            <input type="num" placeholder=""/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">주민등록번호</div>
          <div className="inputGroup">
            <InputItems>
              <input type="num" maxLength={6} autoComplete="off" placeholder='앞 6자리'/>
            </InputItems>
            <span className='line'>-</span>
            <InputItems>
              <input type="password" maxLength={7} autoComplete="off" placeholder='뒤 7자리'/>
            </InputItems>
          </div>
        </div>
        <div className="listRow">
          <div className="title">휴대폰 번호</div>
          <InputItems>
            <input type="num" placeholder=""/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">우편번호</div>
          <InputItems button='주소검색'>
            <input type="num" placeholder=""/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">주소</div>
          <InputItems>
            <input type="text" value="4층 여보야" placeholder=""/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">상세주소</div>
          <InputItems>
            <input type="text" placeholder='상세주소를 입력'/>
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">신분증사본</div>
          <InputItems button="찾아보기" onClick={onClickFileBtn}>
            <div className="value"></div>
            <input type="file" className='blind' />
          </InputItems>
        </div>
        <div className="listRow">
          <div className="title">통장사본</div>
          <InputItems button="찾아보기" onClick={onClickFileBtn}>
            <div className="value">220121.jpg</div>
            <input type="file" className='blind' />
          </InputItems>
        </div>
        <div className="privacyBox">
          <CheckList text="개인정보 수집 동의" name="privacy">
            <sup>[필수]</sup>
          </CheckList>
          <p>회사는 환전의 목적으로 회원 동의 하에 관계 법령에서 정하는 바에 따라 개인정보를 수집할 수 있습니다. (수집된 개인정보는 확인 후 폐기 처리 합니다.)</p>
        </div>
        <SubmitBtn text="환전 신청하기" state="disabled" />
      </form>
    </>
  )
}

export default DepositInfo