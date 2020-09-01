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
    console.log('back')
    history.goBack()
    // context.action.updateMypageReport(false)
  }
  //버튼map
  const Reportmap = BTNInfo.map((live, index) => {
    const {title, id} = live
    return (
      <BTN value={title} onClick={(event) => handleSelectChange(event)} className={select === id ? 'on' : ''} key={index} id={id}>
        {title}
      </BTN>
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
  //
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
                    <SubmitBTN onClick={closePopup}>취소</SubmitBTN>

                    {active === true && reportReason.length > 9 ? (
                      <SubmitBTN className={active === true ? 'on' : ''} onClick={() => SubmitClick()}>
                        확인
                      </SubmitBTN>
                    ) : (
                      <SubmitBTN onClick={validateReport}>확인</SubmitBTN>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <FixedBg className={allFalse === true ? 'on' : ''}>
    //   <div className="wrapper">
    //     <button className="fake" onClick={() => CancelBtn()}>
    //       닫기
    //     </button>
    //     <Container>
    //       <button className="closeBtn-layer" onClick={() => CancelBtn()}></button>
    //       <div className="reportTitle"></div>
    //       <h2>신고</h2>
    //       <p>*허위 신고는 제제 대상이 될 수 있습니다.</p>

    //       {Reportmap}
    //       <div className="reportWrap__textareaWrap">
    //         <textarea
    //           value={reportReason}
    //           onChange={reportChange}
    //           className="reportWrap__textarea"
    //           placeholder="상세한 신고 내용을 기재해주세요.허위 신고는 제제 대상이 될 수 있습니다. (최하 10글자 이상)"
    //         />
    //         <span className="reportWrap__textareaCount">{reportReason.length} / 100</span>
    //       </div>
    //       <div className="btnWrap">
    //         <SubmitBTN onClick={CancelBtn}>취소</SubmitBTN>

    //         {active === true && reportReason.length > 9 ? (
    //           <SubmitBTN className={active === true ? 'on' : ''} onClick={() => SubmitClick()}>
    //             확인
    //           </SubmitBTN>
    //         ) : (
    //           <SubmitBTN onClick={validateReport}>확인</SubmitBTN>
    //         )}
    //       </div>
    //     </Container>
    //   </div>
    // </FixedBg>
  )
}
//----------------------------------------
//styled
const FixedBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 24;
  .wrapper {
    z-index: -1;
    width: 100vw;
    height: 100vh;
    position: relative;
  }
  &.on {
    display: none;
  }
  .btnWrap {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .close {
    display: block;
    position: absolute;
    top: -36px;
    right: -6px;
    width: 36px;
    height: 36px;
    background: url(${IMG_SERVER}/images/common/ic_close_m@2x.png) no-repeat center center / cover;
  }
  .fake {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
  }
`
const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 12px;
  width: 83.33%;
  height: auto;
  display: flex;
  margin: 0 auto;

  background-color: #fff;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  & h2 {
    margin-top: 14px;
    color: #424242;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
    & > span {
      color: ${COLOR_MAIN};
    }
  }
  & p {
    margin: 12px 0 16px 0;
    color: #616161;
    font-size: 14px;
    letter-spacing: -0.35px;
    text-align: left;
    transform: skew(-0.03deg);
  }

  .reportWrap {
    width: 100%;
    &__textareaWrap {
      width: 100%;
      position: relative;
      margin-top: 12px;
    }
    &__textarea {
      width: 100%;
      font-size: 14px;
      color: #424242;
      min-height: 120px;
      padding: 12px;
      box-sizing: border-box;
      border-radius: 12px;
      background-color: #f5f5f5;
      outline: none;
      border: none;
      resize: none;
      &::placeholder {
        font-family: inherit;
        color: #626262;
        text-align: justify;
      }
    }
    &__textareaCount {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 12px;
      color: #bdbdbd;
    }
  }
`
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
