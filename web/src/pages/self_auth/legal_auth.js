import React, {useContext, useState, useRef} from 'react'
import styled from 'styled-components'
import Api from 'context/api'

//context
import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'

//layout
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

//static
import icNotice from './static/ic_notice.svg'
import icArrow from './static/ico_selectdown_g_s.svg'
import icFemale from './static/ico_female.svg'
import icMale from './static/ico_male.svg'
import icCheckOff from './static/ico-checkbox-off.svg'
import icCheckOn from './static/ico-checkbox-on.svg'

//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  //state
  const [agreeTerm, setAgreeTerm] = useState('1825')
  const [name, setName] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [phoneCorp, setPhoneCorp] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [gender, setGender] = useState('')
  const [nation, setNation] = useState('0')
  const [term1, setTerm1] = useState(false)
  const [term2, setTerm2] = useState(false)

  //formData
  const [formState, setFormState] = useState({
    tr_cert: '',
    tr_url: '',
    tr_add: ''
  })

  const authFormRef = useRef();

  //본인인증 모듈 호출
  function authRequest(res) {
    var KMCIS_window
    var UserAgent = navigator.userAgent
    /* 모바일 접근 체크*/

    // 모바일일 경우 (변동사항 있을경우 추가 필요)
    if (
      UserAgent.match(
        /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i
      ) != null ||
      UserAgent.match(/LG|SAMSUNG|Samsung/) != null
    ) {
      authFormRef.current.target = ''
    } else {
      KMCIS_window = window.open(
        '',
        'KMCISWindow',
        'width=425, height=690, resizable=0, scrollbars=no, status=0, titlebar=0, toolbar=0, left=435, top=250'
      )

      if (KMCIS_window == null) {
        context.action.alert({
          msg:
            ' ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.'
        })
      }
      authFormRef.current.target = 'KMCISWindow'
    }
    authFormRef.current.action = 'https://www.kmcert.com/kmcis/web/kmcisReq.jsp'
    authFormRef.current.submit()
  }

  //인증 요청
  async function authReq() {
    const res = await Api.self_auth_req({
      data: {
        pageCode: '4',
        authType: '1',
        agreeTerm: agreeTerm,
        name: name,
        phoneNo: phoneNo,
        phoneCorp: phoneCorp,
        birthDay: birthDay,
        gender: gender,
        nation: nation
      }
    })
    if (res.result == 'success' && res.code == 0) {
      //alert(JSON.stringify(res, null, 1))
      setFormState({
        tr_cert: res.data.tr_cert,
        tr_url: res.data.tr_url,
        tr_add: res.data.tr_add
      })
      authRequest()
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  function calcAge(birth) {
    const currentYear = new Date().getFullYear() + 1
    const birthYear = birth.slice(0, 4)

    return currentYear - birthYear
  }

  //인증 요청 버튼 벨리데이션
  function authClick() {
    if (name.length === 0) {
      return context.action.alert({msg: '보호자 성명을 입력해 주세요.'})
    }
    const namePattern = /^[가-힣]{2,5}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/
    if (!namePattern.test(name)) {
      return context.action.alert({msg: '보호자 성명을 확인해 주세요.'})
    }

    if (gender.length === 0) {
      return context.action.alert({msg: '성별을 입력해 주세요.'})
    }

    if (birthDay.length === 0) {
      return context.action.alert({msg: '생년월일을 입력해 주세요.'})
    }

    const birthPattern = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/
    if (!birthPattern.test(birthDay)) {
      return context.action.alert({msg: '생년월일을 확인해 주세요.'})
    }

    if (calcAge(birthDay) < 20) {
      return context.action.alert({msg: '법정대리인(보호자)은 20세 이상이어야만 동의 가능합니다.'})
    }

    if (phoneCorp.length === 0) {
      return context.action.alert({msg: '통신사 정보를 확인해 주세요.'})
    }

    if (phoneNo.length === 0) {
      return context.action.alert({msg: '휴대폰 번호를 입력해 주세요.'})
    }

    const phonePattern = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    if (!phonePattern.test(phoneNo)) {
      return context.action.alert({msg: '휴대폰 번호를 확인해 주세요.'})
    }

    if (!term1) {
      return context.action.alert({msg: '법정대리인(보호자)는 상세내용 확인에 대해 동의하셔야 환전 신청이 가능합니다.'})
    }

    if (!term2) {
      return context.action.alert({msg: '법정대리인(보호자)는 개인정보 수집 및 이용에 동의하셔야 환전 신청이 가능합니다.'})
    }

    authReq()
  }

  const goBack = () => {
    // props.history.push(`/mypage/${context.profile.memNo}/wallet`)
    context.action.updateWalletIdx(1)
    window.history.back()
  }

  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <Header title="미성년자 법정대리인(보호자)동의 신청" goBack={goBack} />
      <Content>
        <p className="txt">
          부모 또는 지정후견인의 동의를 위해 <br />
          <strong>주민등록 등본</strong> 또는 <strong>가족관계 증명서</strong>를 첨부하여 주셔야 <br />
          법정대리인(보호자) 동의가 인정됩니다.
        </p>

        <h5>동의 기간 선택</h5>
        <div className="input-wrap">
          <div className="title">동의 기간</div>
          <div className="input">
            <select onChange={(e) => setAgreeTerm(e.target.value)}>
              <option value="1825">5년</option>
              <option value="1095">3년</option>
              <option value="365">1년</option>
              <option value="180">6개월</option>
              <option value="90">3개월</option>
            </select>
          </div>
          <p className="info" style={{paddingTop: '8px'}}>
            <img src={icNotice} />
            선택한 기간 동안 환전 동의가 유효하고 환전 서비스 이용 시 <br />
            법정대리인(보호자)의 동의를 다시 받을 필요는 없습니다.
          </p>
        </div>

        <h5>법정대리인(보호자) 정보</h5>

        <div className="input-wrap">
          {/* <p className="info" style={{paddingBottom: '8px'}}>
            <img src={icNotice} />
            법정대리인(보호자)은 20세 이상이어야만 동의 가능합니다.
          </p> */}
          <div className="title">보호자 이름</div>
          <div className="input">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <div className="input-wrap">
          <div className="title">성별</div>
          <div className="input">
            <div className="btn2-wrap">
              <button
                className={`male ${gender === '0' && 'on'}`}
                onClick={() => {
                  setGender('0')
                }}>
                남자
              </button>
              <button
                className={`female ${gender === '1' && 'on'}`}
                onClick={() => {
                  setGender('1')
                }}>
                여자
              </button>
            </div>
          </div>
        </div>
        <div className="input-wrap">
          <div className="title">생년월일</div>
          <div className="input">
            <input
              type="number"
              pattern="\d*"
              placeholder="8자 숫자만 입력"
              value={birthDay}
              onChange={(e) => {
                if (e.target.value.length < 9) setBirthDay(e.target.value)
              }}
            />
          </div>
        </div>
        <div className="input-wrap">
          <div className="title">통신사</div>
          <div className="input">
            <div className="btn6-wrap">
              <button
                className={`${phoneCorp === 'SKT' && 'on'}`}
                onClick={() => {
                  setPhoneCorp('SKT')
                }}>
                SKT
              </button>
              <button
                className={`${phoneCorp === 'KTF' && 'on'}`}
                onClick={() => {
                  setPhoneCorp('KTF')
                }}>
                KTF
              </button>
              <button
                className={`${phoneCorp === 'LGT' && 'on'}`}
                onClick={() => {
                  setPhoneCorp('LGT')
                }}>
                LGT
              </button>
              <button
                className={`${phoneCorp === 'SKM' && 'on'}`}
                onClick={() => {
                  setPhoneCorp('SKM')
                }}>
                SKM
                <br />
                (알뜰폰)
              </button>
              <button
                className={`${phoneCorp === 'KTM' && 'on'}`}
                onClick={() => {
                  setPhoneCorp('KTM')
                }}>
                KTM
                <br />
                (알뜰폰)
              </button>
              <button
                className={`${phoneCorp === 'LGM' && 'on'}`}
                onClick={() => {
                  setPhoneCorp('LGM')
                }}>
                LGM
                <br />
                (알뜰폰)
              </button>
            </div>
          </div>
        </div>
        <div className="input-wrap">
          <div className="title">휴대폰 번호</div>
          <div className="input">
            <input
              type="number"
              pattern="\d*"
              placeholder="- 없이 숫자만 입력"
              value={phoneNo}
              onChange={(e) => {
                if (e.target.value.length < 12) setPhoneNo(e.target.value)
              }}
            />
          </div>
        </div>
        <div className="input-wrap">
          <div className="title">내외국인</div>
          <div className="input">
            <div className="btn2-wrap">
              <button
                className={`${nation === '0' && 'on'}`}
                onClick={() => {
                  setNation('0')
                }}>
                내국인
              </button>
              <button
                className={`${nation === '1' && 'on'}`}
                onClick={() => {
                  setNation('1')
                }}>
                외국인
              </button>
            </div>
          </div>
        </div>

        <div
          className="checkbox"
          onClick={() => {
            setTerm1(!term1)
          }}>
          <img src={term1 ? icCheckOn : icCheckOff} />
          <label>
            <span>[필수]</span> 본인은 위 동의서의 내용을 상세히 읽고 이해하여 이에 동의합니다.
          </label>
        </div>
        <div
          className="checkbox"
          onClick={() => {
            setTerm2(!term2)
          }}>
          <img src={term2 ? icCheckOn : icCheckOff} />
          <label>
            <span>[필수]</span> 법정대리인(보호자) 개인 정보 수집 및 이용에 동의합니다.
          </label>
        </div>

        <p className="txt">
          법정대리인(보호자) 개인 정보 수집 및 이용에 대한 안내
          <br />
          1) 수집하는 개인 정보 항목 : 보호자 이름, 성별, 생년월일
          <br />
          2) 이용목적 : 법정대리인 환전 승인에 대한 동의
        </p>

        <button className="confirm-button" onClick={authClick}>
          동의합니다
        </button>
      </Content>
      <form ref={authFormRef} name="authForm" method="post" id="authForm" target="KMCISWindow">
        <input type="hidden" name="tr_cert" id="tr_cert" value={formState.tr_cert} readOnly />
        <input type="hidden" name="tr_url" id="tr_url" value={formState.tr_url} readOnly />
        <input type="hidden" name="tr_add" id="tr_add" value={formState.tr_add} readOnly />
      </form>
    </Layout>
  )
}
//---------------------------------------------------------------------

const Content = styled.div`
  padding: 24px 16px;
  .input-wrap + .checkbox {
    margin-top: 24px;
  }

  .checkbox + .txt {
    margin-top: 24px;
  }

  .checkbox {
    display: flex;
    align-items: end;
    img {
      padding-top: 2px;
      padding-right: 7px;
      width: 25px;
      height: 25px;
      box-sizing: content-box;
    }
    label {
      font-size: 13px;
      line-height: 22px;
      span {
        color: #e84d6f;
      }
    }
  }

  .checkbox + .checkbox {
    margin-top: 14px;
  }

  p.txt {
    font-size: 12px;
    line-height: 18px;
    color: #616161;
    strong {
      color: #000;
      font-weight: 600;
    }
  }

  h5 {
    margin-top: 30px;
    padding-bottom: 6px;
    font-size: 16px;
    line-height: 20px;
    color: ${COLOR_MAIN};
    border-bottom: 1px solid ${COLOR_MAIN};
  }

  p.info {
    font-size: 12px;
    color: #616161;
    line-height: 18px;
    letter-spacing: -0.4px;
    img {
      padding: 3px 3px 0 0;
      vertical-align: top;
    }
  }

  .input-wrap {
    display: flex;
    flex-wrap: wrap;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;

    .title {
      width: 90px;
      font-size: 14px;
      font-weight: 600;
      color: #000;
      line-height: 40px;
      height: 40px;
    }

    .input {
      flex: 1;
      select,
      input {
        width: 100%;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        border: 1px solid #bdbdbd;
        border-radius: 10px;
        background: #fff;
        text-indent: 12px;
      }

      select {
        background: url(${icArrow}) no-repeat right 5px center;
      }

      input {
        &::placeholder {
          color: #bdbdbd;
        }
      }
    }

    .info {
      width: 100%;
    }
  }

  .btn6-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    button {
      width: 32%;
      height: 40px;
      font-size: 14px;
      line-height: 16px;
      color: #000;
      border: 1px solid #bdbdbd;
      border-radius: 10px;

      &.on {
        border: 1px solid ${COLOR_MAIN};
        color: ${COLOR_MAIN};
      }
    }
    button:nth-child(-n + 3) {
      margin-bottom: 6px;
    }
  }

  .btn2-wrap {
    display: flex;
    border-radius: 10px;
    border: 1px solid #bdbdbd;
    button {
      position: relative;
      width: 50%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #000;

      &.on {
        z-index: 2;
        color: ${COLOR_MAIN};
        ::after {
          position: absolute;
          left: -1px;
          top: -1px;
          border-bottom-left-radius: 10px;
          border-top-left-radius: 10px;
          width: 100%;
          height: 40px;
          border: 1px solid ${COLOR_MAIN};
          content: '';
        }
      }
    }

    button + button {
      border-left: 1px solid #bdbdbd;
      &.on::after {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
      }
    }

    button.female {
      padding-right: 15px;
      background: url(${icFemale}) no-repeat right 32% center;
    }

    button.male {
      padding-right: 15px;
      background: url(${icMale}) no-repeat right 32% center;
    }
  }

  .confirm-button {
    width: 100%;
    margin-top: 30px;
    height: 44px;
    line-height: 44px;
    border-radius: 12px;
    font-weight: 600;
    color: #fff;
    background: ${COLOR_MAIN};
  }
`
