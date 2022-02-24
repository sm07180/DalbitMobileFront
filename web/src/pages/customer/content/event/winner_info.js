import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Utility, {addComma} from 'components/lib/utility'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function WinnerInfo({state, formDispatch, WinnerInspection}) {
  const history = useHistory()
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [winnerCertifiInfo, setWinnerCertifiInfo] = useState({})
  const [emailFocusState, setEmailFocusState] = useState(false)
  const [addrFocusState, setAddrFocusState] = useState(false)

  const [selectFetching, setSelectFetching] = useState(null)
  const [formatFetching, setFormatFetching] = useState(null)

  const eventIdx = history.location.state.eventIdx
  const prizeIdx = history.location.state.prizeIdx
  const minorYn = history.location.state.minorYn
  const state_ = history.location.state.state_
  const memNo = globalState.token.memNo

  const closeDaumPostCode = () => {
    const element_layer = document.getElementById('layer')
    element_layer.style.display = 'none'
  }

  const searchAddr = (e) => {
    const element_layer = document.getElementById('layer')

    new window['daum'].Postcode({
      oncomplete: (data) => {
        formDispatch({type: 'winner_post_code', val: data.zonecode})
        formDispatch({type: 'winner_address_1', val: data.address})
        /* zonecode랑 address => 기존에 제공받는 Postcode함수 호출 후 받는 데이터에서 뽑아오는 것이기 때문에 */
        element_layer.setAttribute('style', 'display: none;')
      },
      width: '100%',
      height: '100%',
      maxSuggestItems: 5
    }).embed(element_layer)
    element_layer.style.display = 'block'
    initLayerPosition()
  }

  const initLayerPosition = () => {
    var width = 300 // 우편번호 서비스가 들어갈 element의 width
    var height = 500 // 우편번호 서비스가 들어갈 element의 height
    var borderWidth = 2 //샘플에서 사용하는 border의 두께
    const element_layer = document.getElementById('layer')
    const closeBtn = document.getElementById('layer__close')
    // 위에서 선언한 값들을 실제 element에 넣는다.
    // element_layer.style.width = width + 'px';
    element_layer.style.height = height + 'px'
    element_layer.style.border = borderWidth + 'px solid'
    // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
    element_layer.style.left = ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth + 'px'
    element_layer.style.top =
      ((window.screen.height || document.documentElement.clientHeight) - height) / 2 - borderWidth - 30 + 'px'
    closeBtn.style.right = ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth - 20 + 'px'
    closeBtn.style.top = ((window.screen.height || document.documentElement.clientHeight) - height) / 2 - borderWidth - 30 + 'px'
  }

  const uploadSingleFile = (e, idx) => {
    const target = e.currentTarget
    if (target.files.length === 0) return
    let reader = new FileReader()
    const file = target.files[0]
    const fileName = file.name

    const fileSplited = fileName.split('.')
    const fileExtension = fileSplited.pop().toLowerCase()

    const extValidator = (ext) => {
      const list = ['jpg', 'jpeg', 'png', 'PNG']
      return list.includes(ext)
    }
    if (!extValidator(fileExtension)) {
      dispatch(setGlobalCtxMessage({
        msg: 'jpg, png 이미지만 사용 가능합니다.',
      }))
      return
    }
    reader.readAsDataURL(target.files[0])
    reader.onload = async () => {
      if (reader.result) {
        const res = await Api.image_upload({
          data: {dataURL: reader.result, uploadType: 'eventWinner'}
        })
        if (res.result === 'success') {
          const arr = state.files.map((v, i) => {
            if (i === idx) {
              return {path: res.data.path, name: fileName}
            } else {
              return v
            }
          })
          formDispatch({type: 'file', val: arr})
        } else {
          dispatch(setGlobalCtxMessage({
            msg: '사진 업로드에 실패하였습니다.\n다시 시도해주세요.',
          }));
        }
      }
    }
  }

  const emailFocus = (e) => {
    setEmailFocusState(true)
  }
  const emailFocusOut = (e) => {
    setEmailFocusState(false)
  }
  const addrFocus = (e) => {
    setAddrFocusState(true)
  }
  const addrFocusOut = (e) => {
    setAddrFocusState(false)
  }

  async function winnerInfoSelectFn() {
    const {result, data, message} = await Api.winnerInfoSelect({
      data: {
        memNo: memNo,
        eventIdx: eventIdx,
        prizeIdx: prizeIdx
      }
    })
    console.log(data)
    if (result === 'success') {
      const files = [
        data['winner_add_file_1'] !== '' ? {name: data['winner_add_file_1_name'], path: data['winner_add_file_1']} : false,
        data['winner_add_file_2'] !== '' ? {name: data['winner_add_file_2_name'], path: data['winner_add_file_2']} : false
      ]
      const valueAble = {
        ...data,
        eventIdx,
        prizeIdx,
        files
      }

      setSelectFetching(valueAble)
    } else {
      dispatch(setGlobalCtxMessage({
        msg: message,
        callback: async () => {
          window.location.href='/'
        }
      }));
    }
  }

  async function winnerInfoFormatFn() {
    const {result, data, message} = await Api.winnerInfoFormat({})
    if (result === 'success') {
      setWinnerCertifiInfo(data)

      setFormatFetching({
        winner_name: data.mem_name,
        winner_phone: data.mem_phone,
        check: false
      })
    } else {
      dispatch(setGlobalCtxMessage({
        msg: message,
        callback: async () => {
          window.location.href='/'
        }
      }));
    }
  }

  useEffect(() => {
    if (!globalState.token.isLogin) history.push('/')
  }, [globalState.token])

  useEffect(() => {
    if (formatFetching !== null && selectFetching !== null) {
      formDispatch({
        type: 'init',
        val: {
          ...selectFetching,
          ...formatFetching
        }
      })
    }
  }, [formatFetching, selectFetching])

  useEffect(() => {
    winnerInfoFormatFn()
    winnerInfoSelectFn()
    window.scrollTo(0, 0)
  }, [])

  return (
    <div id="winnerInfo">
      <div id="layer">
        <button id="layer__close" onClick={closeDaumPostCode}>
          X
        </button>
      </div>

      <div className="inputForm__box default">
        <span className="formText">이름(실명)</span>
        <span className="infoText">{winnerCertifiInfo.mem_name}</span>
      </div>
      <div className="inputForm__box default">
        <span className="formText">휴대폰 번호</span>
        <span className="infoText">{winnerCertifiInfo.mem_phone}</span>
      </div>

      <div className={`inputForm__box input ${emailFocusState ? ' focus' : ''}`}>
        <label className="formText" htmlFor="emailInput">
          이메일
        </label>
        <input
          type="email"
          className="infoText"
          id="emailInput"
          onFocus={(e) => emailFocus(e)}
          onBlur={(e) => emailFocusOut(e)}
          onChange={(e) => formDispatch({type: 'winner_email', val: e.target.value})}
          value={state.winner_email}
          placeholder="이메일 주소를 입력해주세요."
        />
      </div>

      <div className="inputForm__box default">
        <div className="formText">우편번호</div>
        <label className="textLabel" onClick={(e) => searchAddr(e)}>
          <span className="textSpan">
            <input type="text" disabled={true} value={state.winner_post_code} placeholder="주소 검색을 해주세요." />
          </span>
          <span className="searchBox">주소검색</span>
        </label>
      </div>

      <div className="inputForm__box default">
        <span className="formText">주소</span>
        <input
          type="text"
          className="infoText"
          disabled={true}
          value={state.winner_address_1}
          placeholder="주소 검색 시 자동 입력됩니다."
        />
      </div>

      <div className={`inputForm__box input ${addrFocusState ? ' focus' : ''}`}>
        <label className="formText" htmlFor="addressInput">
          상세 주소
        </label>
        <input
          type="text"
          className="infoText"
          id="addressInput"
          value={state.winner_address_2}
          onFocus={(e) => addrFocus(e)}
          onBlur={(e) => addrFocusOut(e)}
          onChange={(e) => formDispatch({type: 'winner_address_2', val: e.target.value})}
          placeholder="상세 주소를 입력해주세요."
        />
      </div>

      <div className="inputForm__box default">
        <div className="formText">신분증 사본</div>
        <label htmlFor="id-upload" className="textLabel">
          <span>{state.files[0] !== false ? state.files[0].name : '등록해주세요.'}</span>
          <span className="searchBox">찾아보기</span>
        </label>
        <input id="id-upload" type="file" onChange={(e) => uploadSingleFile(e, 0)} />
      </div>

      <div className="descArea">※ 주민등록증, 운전면허증, 여권, 주민등록등본, 가족관계증명서 등</div>

      {minorYn === 1 && (
        <>
          <div className="inputForm__box default">
            <div className="formText">가족관계증명서</div>
            <label htmlFor="certi-upload" className="textLabel">
              <span>{state.files[1] !== false ? state.files[1].name : '등록해주세요.'}</span>
              <span className="searchBox">찾아보기</span>
            </label>
            <input id="certi-upload" type="file" onChange={(e) => uploadSingleFile(e, 1)} />
          </div>
          <div className="descArea">
            ※ 미성년자의 경우 인증받은 부모님의 실명이 기재된 가족관계증명서를 필수로 등록하셔야 합니다.
          </div>
        </>
      )}

      <div className="msgBox">
        추가 정보를 입력하시면 제세공과금 및 입금계좌 안내 <br /> SMS가 발송됩니다. 입금 확인 후 경품 발송이 진행됩니다.
      </div>

      <div className="inputForm__box prize">
        <span className="formText">경품명</span>
        <span className="infoText">{state.prize_name}</span>
      </div>
      <div className="inputForm__box prize">
        <span className="formText">제세공과금</span>
        <span className="infoText">{Utility.addComma(state.tax_amount)}</span>
      </div>
      <div className="inputForm__box prize">
        <span className="formText">입금은행/예금주</span>
        <span className="infoText">신한은행 / (주)여보야</span>
      </div>
      <div className="inputForm__box prize">
        <span className="formText">계좌번호</span>
        <span className="infoText">140-012-958220</span>
      </div>

      <div className="checkArea">
        <div>
          {' '}
          {/* div 태그 없으면 체크박스 모양이 망가져요 */}
          <DalbitCheckbox status={state.check} callback={() => formDispatch({type: 'check', val: !state.check})} />
        </div>
        <div className="checkText">
          <strong>개인정보 수집 및 이용 동의</strong>
          <p className="checkDescArea">
            회사는 이벤트 경품지급의 목적으로 회원 동의 하에 관계 법령에서 정하는 바에 따라 개인정보를 수집할 수 있습니다.
          </p>
        </div>
      </div>

      <div onClick={() => WinnerInspection({minorYn})}>
        {state.check === false && state_ === 0 && <button className="saveButton">저장하기</button>}
        {state.check === true && state_ === 0 && <button className="saveButton-active">저장하기</button>}
        {state.check === false && state_ === 1 && <button className="saveButton">수정하기</button>}
        {state.check === true && state_ === 1 && <button className="saveButton-active">수정하기</button>}
      </div>
    </div>
  )
}
