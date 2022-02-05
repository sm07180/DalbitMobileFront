import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

// global components
import Header from 'components/ui/header/Header'
import InputItems from 'components/ui/inputItems/InputItems'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
// contents
// css
import '../style.scss'

const LoginForm = () => {
  const history = useHistory()
  const [btnActive, setBtnActive] = useState(false)
  const [slidePop, setSlidePop] = useState(false)

  const signPop = () => {
    setSlidePop(true)
    setBtnActive(false)
  }

  const checkSelectAll = () => {
    const checkboxes = document.querySelectorAll('input[name="checkList"]');
    const checked = document.querySelectorAll('input[name="checkList"]:checked');
    const selectAll = document.querySelector('input[name="checkListAll"]');
    
    if(checkboxes.length === checked.length)  {
      selectAll.checked = true;
      setBtnActive(true)
    }else {
      selectAll.checked = false;
      setBtnActive(false)
    }
  }
  
  const selectAll = (e) => {
    const checkboxes = document.querySelectorAll('input[name="checkList"]');  
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked
    })
    if(e.target.checked) {
      setBtnActive(true)
    } else {
      setBtnActive(false)
    }
  }

  const onClick = () => {
    history.push('/signup');
  };

  return (
    <div id='loginPage'>
      <Header title="로그인" type="back" />
      <section className="loginForm">
        <InputItems>
          <input type="number" placeholder="휴대폰 번호"/>
        </InputItems>
        <InputItems>
          <input
            type="password"
            placeholder="비밀번호"
          />
        </InputItems>
        <SubmitBtn text="로그인" />
        <div className="linkWrap">  
          <div className="linkText" onClick={signPop}>회원가입</div>          
          <div className="linkText">비밀번호 재설정</div>
        </div>
      </section>
      {slidePop &&
        <PopSlide setPopSlide={setSlidePop}> 
          <div className='title'>이용약관동의</div>
          <div className="agreeWrap">
						<div className="agreeListAll">
              <label className="inputLabel">
                <input type="checkbox" className="blind" name="checkListAll" onChange={selectAll}/>
                <span className="checkIcon"></span>
                <p className="checkinfo">네, 모두 동의합니다.</p>
              </label>
						</div>
            <div className='agreeListWrap'>
              <div className="agreeList">
                <label className="inputLabel">
                  <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                  <span className="checkIcon"></span>
                  <p className="checkinfo">(필수) 만 14세 이상입니다.</p>
                </label>
              </div>
              <div className="agreeList">
                <label className="inputLabel">
                  <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                  <span className="checkIcon"></span>
                  <p className="checkinfo">(필수) 이용약관</p>
                  <button className='policyBtn'>보기</button>
                </label>
              </div>
              <div className="agreeList">
                <label className="inputLabel">
                  <input type="checkbox" className="blind" name="checkList" onChange={checkSelectAll}/>
                  <span className="checkIcon"></span>
                  <p className="checkinfo">(필수) 개인정보 취급 방침</p>
                  <button className='policyBtn'>보기</button>
                </label>
              </div>
            </div>						
					</div>
          <SubmitBtn text="다음" state={!btnActive && 'disabled'} onClick={onClick}/>
        </PopSlide>      
      }
    </div>
  )
}

export default LoginForm