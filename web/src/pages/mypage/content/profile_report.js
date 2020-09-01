import React, {useEffect, useState, useContext, useRef} from 'react'
//styled
import styled from 'styled-components'
//context
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'

// import CloseBtn from '../../menu/static/ic_closeBtn.svg'
const CloseBtn = 'https://image.dalbitlive.com/images/common/ic_close_m@2x.png'
import 'styles/layerpopup.scss'

export default (props) => {
  //context------------------------------------------
  const context = useContext(Context)
  const ctx = useContext(Context)
  //pathname
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props
  const myProfileNo = ctx.profile.memNo
  let history = useHistory()
  //state
  const [select, setSelect] = useState('')
  const [active, setActive] = useState(false)
  const [allFalse, setAllFalse] = useState(false)
  const [reportReason, setReportReason] = useState('')
  //api
  const fetchData = async () => {
    const res = await Api.member_declar({
      data: {
        memNo: urlrStr,
        reason: select,
        cont: reportReason
      }
    })
    if (res.result === 'success') {
      //console.log(res)
      context.action.alert({
        callback: () => {
          context.action.updateMypageReport(false)
        },
        msg: profile.nickNm + '님을 신고 하였습니다.'
      })
    } else {
      // console.log(res)
      context.action.alert({
        callback: () => {
          context.action.updateMypageReport(false)
        },
        msg: '이미 신고한 회원 입니다.'
      })
    }

    return
  }
  const BTNInfo = [
    {
      title: '프로필 사진',
      id: 1
    },
    {
      title: '음란성',
      id: 2
    },
    {
      title: '광고 및 상업성',
      id: 3
    },
    {
      title: '욕설 및 비방성',
      id: 4
    },
    {
      title: '기타',
      id: 5
    }
  ]
  //셀렉트function-----------------------------------
  const handleSelectChange = (event) => {
    const value = event.target.value
    const indexs = event.target.id
    if (value === '프로필 사진') {
      setSelect(1)
    } else if (value === '음란성') {
      setSelect(2)
    } else if (value === '광고 및 상업성') {
      setSelect(3)
    } else if (value === '욕설 및 비방성') {
      setSelect(4)
    } else if (value === '기타') {
      setSelect(5)
    }
  }
  //신고하기버튼 벨리데이션 function-----------------------
  const SubmitBTNChange = () => {
    if (select != '') {
      setActive(true)
    }
  }
  const SubmitClick = () => {
    if (select != '') {
      fetchData()
    }
  }
  useEffect(() => {
    SubmitBTNChange()
  })
  //리포트클로즈
  const closePopup = () => {
    context.action.updateMypageReport(false)
  }
  //버튼map
  const Reportmap = BTNInfo.map((live, index) => {
    const {title, id} = live
    return (
      <button
        value={title}
        onClick={(event) => handleSelectChange(event)}
        className={`btn__list ${select === id ? 'on' : ''}`}
        key={index}
        id={id}>
        {title}
      </button>
    )
  })
  //close
  const reportChange = (e) => {
    const {value} = e.target
    if (value.length > 100) return
    setReportReason(value)
  }
  const validateReport = () => {
    if (select === '') {
      context.action.alert({
        callback: () => {},
        msg: '신고 사유를 선택해주세요.'
      })
    }
    if (select !== '' && reportReason.length < 10) {
      context.action.alert({
        callback: () => {},
        msg: '신고 사유를 10자 이상 입력해주세요.'
      })
    }
  }
  useEffect(() => {
    window.onpopstate = (e) => {
      context.action.updateMypageReport(false)
    }
  }, [])
  //------------------------------------------------------------
  return (
    <div id="mainLayerPopup" onClick={closePopup}>
      <div className="popup popup-report">
        <div className="popup__wrap">
          <div className="popbox active">
            <div className="popup__box popup__text">
              <div className="popup__inner" onClick={(e) => e.stopPropagation()}>
                <div className="popup__title popup__title--sub">
                  <h3 className="h3-tit">신고</h3>
                  <p className="desc">*허위 신고는 제제 대상이 될 수 있습니다.</p>
                  <button className="close-btn close-btn--sub" onClick={() => closePopup()}>
                    <img src={CloseBtn} alt="닫기" />
                  </button>
                </div>
                <div className="inner">
                  {Reportmap}
                  <div className="reportWrap__textareaWrap">
                    <textarea
                      value={reportReason}
                      onChange={reportChange}
                      className="reportWrap__textarea"
                      placeholder="상세한 신고 내용을 기재해주세요.허위 신고는 제제 대상이 될 수 있습니다. (최하 10글자 이상)"
                    />
                    <span className="reportWrap__textareaCount">{reportReason.length} / 100</span>
                  </div>
                  <div className="btnWrap">
                    <button className="btn__cancel" onClick={closePopup}>
                      취소
                    </button>

                    {active === true && reportReason.length > 9 ? (
                      <button className={`btn__ok ${active === true ? 'on' : ''}`} onClick={() => SubmitClick()}>
                        확인
                      </button>
                    ) : (
                      <button className="btn__ok" onClick={validateReport}>
                        확인
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
//----------------------------------------
const BTN = styled.button`
  display: block;
  width: 100%;
  margin-top: 4px;
  border: 1px solid #bdbdbd;
  border-radius: 10px;
  padding: 8px 0;
  color: #616161;
  font-size: 14px;
  transform: skew(-0.03deg);
  outline: none;
  &.on {
    border: 1px solid ${COLOR_MAIN};
    color: ${COLOR_MAIN};
    font-weight: 600;
  }
`
const SubmitBTN = styled.button`
  display: block;
  width: calc(50% - 4px);
  margin-top: 12px;
  padding: 12px 0;
  border-radius: 10px;
  background-color: #bdbdbd;
  font-size: 16px;
  color: #fff;
  letter-spacing: -0.4px;
  :first-child {
    background-color: #fff;
    border: solid 1px ${COLOR_MAIN};
    color: ${COLOR_MAIN};
  }
  &.on {
    background-color: ${COLOR_MAIN};
  }
`
