import React, {useEffect, useState, useContext, useCallback} from 'react'
//styled
import styled from 'styled-components'
//context
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import {PROFILE_REPORT_TAB} from './constant'
import Caution from '../static/caution.png'

const CloseBtn = 'https://image.dallalive.com/images/api/close_w_l.svg'
import 'styles/layerpopup.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUserReport} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //pathname
  const {profile} = props
  let history = useHistory()
  //state
  const [select, setSelect] = useState('')
  const [active, setActive] = useState(false)
  const [pageType, setPageType] = useState(1)
  const [reportReason, setReportReason] = useState('')
  //api

  const setUserReport = (obj) => {
    dispatch(setGlobalCtxUserReport({...globalState.userReport, ...obj}));
  }

  async function fetchDataBlock() {
    const {message, result, code} = await Api.mypage_black_add({
      data: {
        memNo: globalState.userReport.targetMemNo
      }
    })
    if (result === 'success') {
      dispatch(setGlobalCtxMessage({
        type:"alert",
        callback: () => {
          setUserReport({state: false})
        },
        msg: message
      }))
    } else if (code === '-3') {
      dispatch(setGlobalCtxMessage({
        type:"alert",
        callback: () => {
          setUserReport({state: false})
        },
        msg: message
      }))
    } else if (code === 'C006') {
      dispatch(setGlobalCtxMessage({
        type:"alert",
        callback: () => {
          setUserReport({state: false})
        },
        msg: '이미 블랙리스트로 등록된\n회원입니다.'
      }))
    }
  }

  const fetchData = async () => {
    const res = await Api.member_declar({
      data: {
        memNo: globalState.userReport.targetMemNo,
        reason: select,
        cont: reportReason
      }
    })
    if (res.result === 'success') {
      //console.log(res)
      dispatch(setGlobalCtxMessage({
        type:"alert",
        callback: () => {
          setUserReport({state: false})
        },
        msg: globalState.userReport.targetNickName + '님을 신고 하였습니다.'
      }))
    } else {
      // console.log(res)
      dispatch(setGlobalCtxMessage({
        type:"alert",
        callback: () => {
          setUserReport({state: false})
        },
        msg: '이미 신고한 회원 입니다.'
      }))
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

  const tabChange = () => {
    if (pageType === PROFILE_REPORT_TAB.BLACK) {
      setPageType(PROFILE_REPORT_TAB.DECLARATION)
    } else {
      setPageType(PROFILE_REPORT_TAB.BLACK)
    }
  }

  //신고하기버튼 벨리데이션 function-----------------------
  const SubmitBTNChange = () => {
    if (select != '') {
      setActive(true)
    }
  }

  useEffect(() => {
    SubmitBTNChange()
  })
  //리포트클로즈
  const closePopup = () => {
    setUserReport({state: false})
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
      dispatch(setGlobalCtxMessage({
        type:"alert",
        callback: () => {},
        msg: '신고 사유를 선택해주세요.'
      }))
    }
    if (select !== '' && reportReason.length < 10) {
      dispatch(setGlobalCtxMessage({
        type:"alert",
        callback: () => {},
        msg: '신고 사유를 10자 이상 입력해주세요.'
      }))
    }

    if (reportReason.length >= 10 && select !== '') {
      fetchData()
    }
  }

  useEffect(() => {
    window.onpopstate = (e) => {
      setUserReport({state: false})
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
                  <h3 className="h3-tit popup__tab">
                    <button onClick={tabChange} className={pageType === PROFILE_REPORT_TAB.BLACK ? 'on' : ''}>
                      <i></i>
                      차단하기
                    </button>
                    <button onClick={tabChange} className={pageType === PROFILE_REPORT_TAB.DECLARATION ? 'on' : ''}>
                      <i></i>
                      신고하기
                    </button>
                  </h3>
                  <button className="close-btn close-btn--sub" onClick={() => closePopup()}>
                    <img src={CloseBtn} alt="닫기" />
                  </button>
                </div>
                <div className="inner">
                  {pageType === PROFILE_REPORT_TAB.DECLARATION ? (
                    <div className="declarationWrap">
                      {Reportmap}
                      <div className="reportWrap__textareaWrap">
                        <textarea
                          value={reportReason}
                          onChange={reportChange}
                          className="reportWrap__textarea"
                          placeholder="상세한 신고 내용을 기재해주세요.허위 신고는 제제 대상이 될 수 있습니다. (최하 10글자 이상)"
                        />
                      </div>
                      <span className="reportWrap__textareaCount">
                        <b>{reportReason.length}</b> / 100
                      </span>
                      <div className="btnWrap">
                        <button className="btn__cancel" onClick={closePopup}>
                          취소
                        </button>

                        <button
                          className={`btn__ok ${reportReason.length > 9 && select !== '' ? 'on' : ''}`}
                          onClick={() => validateReport()}>
                          확인
                        </button>
                      </div>
                    </div>
                  ) : (
                    pageType === PROFILE_REPORT_TAB.BLACK && (
                      <div className="blackWrap">
                        <div className="alertText">
                          <h3>{globalState.userReport.targetNickName}</h3>
                          <b>차단하시겠습니까?</b>

                          <img src={Caution} />

                          <span>
                            차단한 회원은 나의 방송이 보이지 않으며,
                            <br />
                            방송에 입장할 수 없습니다.
                          </span>

                          <p>
                            *차단한 회원은 마이페이지 &gt; 방송설정 &gt; 차단회원
                            <br /> 관리 페이지에서 확인할 수 있습니다.
                          </p>

                          <div className="buttonWrap">
                            <button onClick={closePopup}>취소</button>
                            <button onClick={fetchDataBlock}>확인</button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
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
