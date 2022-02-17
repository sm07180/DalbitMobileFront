import React, {useContext, useEffect, useState} from 'react'
import {Context} from 'context'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import Header from 'components/ui/new_header.js'

import Message from 'pages/common/message'
import Popup from 'pages/common/popup'
import SelectBox from 'components/ui/selectBox'

import './checkwrite.scss'
import qs from 'query-string'
import plusImg from './static/btn_plus.png'
import minusImg from './static/btn_minus.png'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

let subSelect1 = ''
let subSelect2 = ''
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()

  const [deligate, setDeligate] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [broadcast1, setBroadcast1] = useState('')
  const [broadcast2, setBroadcast2] = useState('')
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [already, setalready] = useState('')
  const [toggleCheck, setToggleCheck] = useState({})

  const context = useContext(Context)

  const [select1, setSelect1] = useState('')
  const [selectSub1, setSelectsub1] = useState('')

  const [select2, setSelect2] = useState('')
  const [selectSub2, setSelectsub2] = useState('')

  const [moreList, setMorelist] = useState(false)
  const parameter = qs.parse(location.search)

  //update
  function update(mode) {
    // console.log('---')
    switch (true) {
      case mode.onChange !== undefined:
        //console.log(JSON.stringify(changes))
        break
    }
  }

  async function specialdjUpload() {
    const res = await Api.event_specialdj_upload({
      data: {
        name: name,
        phone: phone,
        broadcast_time1: Broadcast1,
        broadcast_time2: Broadcast2, //없어도됨
        title: title, // 방송소개
        contents: contents, // 내가 스페셜 DJ가 된다면?
        select_year: parameter.select_year,
        select_month: parameter.select_month
      }
    })
    const {result, data} = res
    if (result === 'success') {
      setTimeout(() => {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: '작성 완료되었습니다.',
          callback: () => {
            // history.goBack()
            history.push('/')
            // history.push({
            //   pathname: "",
            //   state: {
            //     a: "",
            //     b: ""
            //   }
            // })
          }
        }))
      })
    } else {
      setTimeout(() => {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: res.message,
          callback: () => {
          }
        }))
      })
    }
  }
  if (toggleCheck.already === 1) {
    window.history.back()
  }

  {
    toggleCheck.airtime === 0 || toggleCheck.broadcast === 0 || toggleCheck.like === 0 ? window.history.back() : ''
  }

  const Broadcast1 = select1 + ' ~ ' + subSelect1
  const Broadcast2 = select2 + ' ~ ' + subSelect2

  const handleChange = (event) => {
    const element = event.target
    const {value} = event.target
    if (value.length > 1000) {
      return
    }
    setTitle(value)
  }

  const handleChange2 = (event) => {
    const element = event.target
    const {value} = event.target
    if (value.length > 1000) {
      return
    }
    setContents(value)
  }

  function confirm() {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      remsg: '신청하시겠습니까?',
      msg: '스페셜DJ 신청서 작성을 완료한 뒤에는 신청 내용 수정이 불가능합니다.',

      //콜백처리
      callback: () => {
        specialdjUpload()
      },
      //캔슬콜백처리
      cancelCallback: () => {
      }
    }))
  }

  function alertDeligate() {
    if (name === '') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '이름을 입력해주세요.',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
      return
    }
    if (phone === '') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '휴대폰 번호를 입력해주세요.',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
      return
    }
    if (select1 === '') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '방송시작시간을 선택해주세요.',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
      return
    }
    if (subSelect1 === '') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '방송종료시간을 선택해주세요.',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
      return
    }

    if (title === '') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '방송 소개에 작성된 내용이 없습니다.<br/>자신의 방송에 대한 소개를 작성해주세요.',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
      return
    }

    if (contents === '') {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '내가 스페셜 DJ가 된다면? 내용이 없습니다.<br/>자신의 방송에 대한 소개를 작성해주세요.',
        callback: () => {
          dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        }
      }))
      return
    }

    confirm()
  }

  function checkDeligate() {
    if (name !== '' && phone !== '' && title !== '' && contents !== '') {
      setDeligate(true)
    } else {
      setDeligate(false)
    }
  }

  const handlePhone = (e) => {
    if (e.target.value.toString().length > 15) {
    } else if (isNaN(e.target.value)) {
    } else {
      setPhone(e.target.value.trim())
    }
  }

  const goBack = () => {
    window.history.back()
  }

  const goHome = () => {
    history.push('/')
  }

  useEffect(() => {
    checkDeligate()
  }, [name, phone, title, contents, broadcast1])

  function moreButton() {
    return (
      <>
        <div className="selectBottom">
          <div className="list__selectBox list__selectBox--bottom">
            <div className="slectBox">
              <SelectBox
                className="specialdjSelect"
                boxList={selectlist.slice(0, selectlist.length - 1)}
                onChangeEvent={(e) => setSelect2(e)}
              />
            </div>
            <div className="slectLine">~</div>
            <div className="slectBox">
              <SelectBox
                boxList={nextSelect2}
                className="specialdjSelect"
                onChangeEvent={(e) => setSelectsub2(e)}
                block={select2 === ''}
              />
            </div>
            <button onClick={() => setMorelist(!moreList)}>
              <img src={minusImg} alt="삭제" className="moerButtonSize" />
            </button>
          </div>
        </div>

        <b className="selctNotice">주 방송시간은 최대 2개까지 선택 가능합니다.</b>
      </>
    )
  }

  const nextSelect1 = (() => {
    if (select1 === '') return selectlist
    else {
      const idx = selectlist.findIndex((item) => item.value === select1)

      const selectOption = selectlist.slice(idx + 1)

      subSelect1 = selectOption[0].value

      // console.log(`selectSubChange1`, selectSubChange1)
      // selectSubChange1 = selop[0].value
      return selectlist.slice(idx + 1)
    }
  })()

  const nextSelect2 = (() => {
    if (select2 === '') return selectlist
    else {
      const idx = selectlist.findIndex((item) => item.value === select2)
      const selectOption2 = selectlist.slice(idx + 1)
      subSelect2 = selectOption2[0].value
      return selectlist.slice(idx + 1)
    }
  })()

  return (
    <div className="specialdj">
      <Popup {...props} />
      <Message {...props} />

      <Header title="신청서 작성" />

      <div className="checkWrite">
        <div className="list list--top">
          <div className="list__inpuText">
            <p>이름(실명)</p>
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요." maxLength="4" />
          </div>
        </div>
        <div className="list list--bottom">
          <div className="list__inpuText">
            <p>휴대폰번호</p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhone(e)}
              placeholder="'-'를 뺀 숫자만 입력하세요."
              maxLength="11"
            />
          </div>
        </div>

        <div className="list__title">주 방송시간</div>
        <div className="list__margin">
          <div className="list__selectBox list__selectBox--top">
            <div className="slectBox">
              <SelectBox
                className="specialdjSelect"
                boxList={selectlist.slice(0, selectlist.length - 1)}
                onChangeEvent={(id) => {
                  setSelect1(id)
                }}
              />
            </div>
            <div className="slectLine">~</div>
            <div className="slectBox">
              <SelectBox
                boxList={nextSelect1}
                className="specialdjSelect"
                onChangeEvent={(id) => {
                  subSelect1 = id
                  // setSelectsub1(id)
                }}
                block={select1 === ''}
                testName="select222"
              />
            </div>
            <button className="list__plusButton" onClick={() => setMorelist(!moreList)}>
              {moreList === true ? (
                <img src={minusImg} alt="삭제" className="moerButtonSize" />
              ) : (
                <img src={plusImg} alt="추가" className="moerButtonSize" />
              )}
            </button>
          </div>
        </div>
        {moreList ? moreButton() : <></>}

        <div className="list__box">
          <div className="list__title">
            방송 소개
            <div className="list__textNumber">
              <b>{title.length}</b>/1,000
            </div>
          </div>
          <textarea
            className="list__textarea"
            onChange={handleChange}
            maxLength="1000"
            placeholder="DJ님의 방송에 대해 자세히 설명해 주세요.&#10;(최대 1,000자)"></textarea>
        </div>
        <div className="list__box">
          <div className="list__title">
            내가 스페셜 DJ가 된다면?!
            <div className="list__textNumber">
              <b>{contents.length}</b>/1,000
            </div>
          </div>
          <textarea
            className="list__textarea"
            onChange={handleChange2}
            placeholder="DJ님의 방송에 대해 자세히 설명해 주세요. &#10;(최대 1,000자)"
            maxLength="1000"></textarea>

          <button
            className={`button ${deligate ? 'button--on' : ''}`}
            // onClick={() => specialdjUpload()}
            onClick={alertDeligate}>
            작성 완료
          </button>
        </div>
      </div>
    </div>
  )
}

const selectlist = [
  {value: '', text: '선택'},
  {value: '00:00', text: '00:00'},
  {value: '00:30', text: '00:30'},
  {value: '01:00', text: '01:00'},
  {value: '01:30', text: '01:30'},
  {value: '02:00', text: '02:00'},
  {value: '02:30', text: '02:30'},
  {value: '03:00', text: '03:00'},
  {value: '03:30', text: '03:30'},
  {value: '04:00', text: '04:00'},
  {value: '04:30', text: '04:30'},
  {value: '05:00', text: '05:00'},
  {value: '05:30', text: '05:30'},
  {value: '06:00', text: '06:00'},
  {value: '06:30', text: '06:30'},
  {value: '07:00', text: '07:00'},
  {value: '07:30', text: '07:30'},
  {value: '08:00', text: '08:00'},
  {value: '08:30', text: '08:30'},
  {value: '09:00', text: '09:00'},
  {value: '09:30', text: '09:30'},
  {value: '10:00', text: '10:00'},
  {value: '10:30', text: '10:30'},
  {value: '11:00', text: '11:00'},
  {value: '11:30', text: '11:30'},
  {value: '12:00', text: '12:00'},
  {value: '12:30', text: '12:30'},
  {value: '13:00', text: '13:00'},
  {value: '13:30', text: '13:30'},
  {value: '14:00', text: '14:00'},
  {value: '14:30', text: '14:30'},
  {value: '15:00', text: '15:00'},
  {value: '15:30', text: '15:30'},
  {value: '16:00', text: '16:00'},
  {value: '16:30', text: '16:30'},
  {value: '17:00', text: '17:00'},
  {value: '17:30', text: '17:30'},
  {value: '18:00', text: '18:00'},
  {value: '18:30', text: '18:30'},
  {value: '19:00', text: '19:00'},
  {value: '19:30', text: '19:30'},
  {value: '20:00', text: '20:00'},
  {value: '20:30', text: '20:30'},
  {value: '21:00', text: '21:00'},
  {value: '21:30', text: '21:30'},
  {value: '22:00', text: '22:00'},
  {value: '22:30', text: '22:30'},
  {value: '23:00', text: '23:00'},
  {value: '23:30', text: '23:30'},
  {value: '24:00', text: '24:00'}
]
