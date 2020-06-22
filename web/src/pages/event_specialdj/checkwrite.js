import SelectBox from 'components/ui/selectBox'
import {Context} from 'context'
import Api from 'context/api'
import Message from 'pages/common/message'
import Popup from 'pages/common/popup'
import React, {useContext, useEffect, useState} from 'react'
import './checkwrite.scss'
import closeBtn from './static/ic_back.svg'

export default (props) => {
  const [deligate, setDeligate] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [broadcast1, setBroadcast1] = useState('')
  const [broadcast2, setBroadcast2] = useState('')
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const context = useContext(Context)
  const globalCtx = useContext(Context)

  const [select1, setSelect1] = useState('')
  const [selectSub1, setSelectsub1] = useState('')

  const [select2, setSelect2] = useState('')
  const [selectSub2, setSelectsub2] = useState('')

  const [moreList, setMorelist] = useState(false)

  //update
  function update(mode) {
    // console.log('---')
    switch (true) {
      case mode.onChange !== undefined:
        //console.log(JSON.stringify(changes))
        break
    }
  }
  const Broadcast1 = select1 + ' ~ ' + selectSub1
  const Broadcast2 = select2 + ' ~ ' + selectSub2

  async function specialdjUpload() {
    const res = await Api.event_specialdj_upload({
      data: {
        name: name,
        phone: phone,
        broadcast_time1: Broadcast1,
        broadcast_time2: Broadcast2, //없어도됨
        title: changes.title, // 방송소개
        contents: changes.contents // 내가 스페셜 DJ가 된다면?
      }
    })
    const {result, data} = res
    if (result === 'success') {
    } else {
    }
  }

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
    context.action.confirm({
      msg: '작성한 내용으로 스페셜 DJ를 신청하시겠습니까?<br/>(신청 후 수정은 불가능합니다.)',
      //콜백처리
      callback: () => {
        specialdjUpload()
      },
      //캔슬콜백처리
      cancelCallback: () => {}
    })
  }

  function alertDeligate() {
    if (name === '') {
      context.action.alert({
        msg: '이름을 입력해주세요.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }
    if (phone === '') {
      context.action.alert({
        msg: '휴대폰 번호를 입력해주세요.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }
    if (Broadcast1 === '') {
      context.action.alert({
        msg: '방송시간을 선택해주세요.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }
    if (title === '') {
      context.action.alert({
        msg: '방송 소개에 작성된 내용이 없습니다.<br/>자신의 방송에 대한 소개를 작성해주세요.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }

    if (contents === '') {
      context.action.alert({
        msg: '내가 스페셜 DJ가 된다면? 내용이 없습니다.<br/>자신의 방송에 대한 소개를 작성해주세요..',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
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
    } else {
      setPhone(e.target.value)
    }
  }

  const goBack = () => {
    window.history.back()
  }

  useEffect(() => {
    checkDeligate()
  }, [name, phone, title, contents, broadcast1])

  function moreButton() {
    return (
      <div className="selectBottom">
        <div className="list__selectBox list__selectBox--bottom">
          <div className="slectBox">
            <SelectBox
              className="specialdjSelect"
              boxList={selectlist}
              onChangeEvent={(e) => {
                setSelect2(e)
              }}
            />
          </div>
          <div className="slectLine">~</div>
          <div className="slectBox">
            <SelectBox
              boxList={selectlist}
              className="specialdjSelect"
              onChangeEvent={(e) => {
                setSelectsub2(e)
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Popup {...props} />
      <Message {...props} />

      <div className="header">
        <h1 className="header__title">신청서 작성</h1>
        <img className="header__btnBack" src={closeBtn} onClick={goBack} />
      </div>

      <div className="checkWrite">
        <div className="list list--top">
          <div className="list__title ">이름 (실명)</div>
          <div className="list__inpuText">
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요." />
          </div>
        </div>
        <div className="list list--bottom">
          <div className="list__title">휴대폰번호</div>
          <div className="list__inpuText">
            <input
              type="number"
              onChange={(e) => setPhone(e.target.value.replace('-', ''))}
              onChange={(e) => handlePhone(e)}
              placeholder="'-'를 뺀 숫자만 입력하세요."
            />
          </div>
        </div>

        <div className="list__title">주 방송시간</div>
        <div className="list__margin">
          <div className="list__selectBox list__selectBox--top">
            <div className="slectBox">
              <SelectBox
                className="specialdjSelect"
                boxList={selectlist}
                onChangeEvent={(e) => {
                  setSelect1(e)
                }}
              />
            </div>
            <div className="slectLine">~</div>
            <div className="slectBox">
              <SelectBox
                boxList={selectlist}
                className="specialdjSelect"
                onChangeEvent={(e) => {
                  setSelectsub1(e)
                }}
              />
            </div>
            <button className="list__plusButton" onClick={() => setMorelist(moreList ? false : true)}>
              추가
            </button>
          </div>
        </div>
        {moreList ? moreButton() : ''}

        <div className="list__box">
          <div className="list__title list__title--marginTop">방송 소개</div>
          <textarea
            className="list__textarea"
            onChange={handleChange}
            maxLength="1000"
            placeholder="DJ님의 방송에 대해 자세히 설명해 주세요.&#10;(최대 1,000자)"></textarea>
          <div className="list__textNumber">{title.length}/1,000</div>
        </div>
        <div className="list__box">
          <div className="list__title">
            내가 스페셜 DJ가 된다면?! <span className="list__titleGray">(선택사항)</span>
          </div>
          <textarea
            className="list__textarea"
            onChange={handleChange2}
            placeholder="DJ님의 방송에 대해 자세히 설명해 주세요. &#10;(최대 1,000자)"
            maxLength="1000"></textarea>
          <div className="list__textNumber">{contents.length}/1,000</div>
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
  {value: '01:00', text: '01:00'},
  {value: '02:00', text: '02:00'},
  {value: '03:00', text: '03:00'},
  {value: '04:00', text: '04:00'},
  {value: '05:00', text: '05:00'},
  {value: '06:00', text: '06:00'},
  {value: '07:00', text: '07:00'},
  {value: '08:00', text: '08:00'},
  {value: '09:00', text: '09:00'},
  {value: '10:00', text: '10:00'},
  {value: '11:00', text: '11:00'},
  {value: '12:00', text: '12:00'},
  {value: '13:00', text: '13:00'},
  {value: '14:00', text: '14:00'},
  {value: '15:00', text: '15:00'},
  {value: '16:00', text: '16:00'},
  {value: '17:00', text: '17:00'},
  {value: '18:00', text: '18:00'},
  {value: '19:00', text: '19:00'},
  {value: '20:00', text: '20:00'},
  {value: '21:00', text: '21:00'},
  {value: '22:00', text: '22:00'},
  {value: '23:00', text: '23:00'},
  {value: '24:00', text: '24:00'}
]
