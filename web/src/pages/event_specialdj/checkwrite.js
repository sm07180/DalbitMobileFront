import SelectBox from 'components/ui/selectBox'
import Api from 'context/api'
import React, {useEffect, useState} from 'react'
import './checkwrite.scss'

export default () => {
  const [deligate, setDeligate] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [broadcast1, setBroadcast1] = useState('')
  const [broadcast2, setBroadcast2] = useState('')
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [checkPopup, setcheckPopup] = useState(false)

  const [moreList, setMorelist] = useState(false)

  async function specialdjUpload() {
    const res = await Api.event_specialdj_upload({
      data: {
        name: name,
        phone: phone,
        broadcast_time1: broadcast1,
        broadcast_time2: broadcast2, //없어도됨
        title: title,
        contents: contents
      }
    })
    const {result, data} = res
    if (result === 'success') {
      console.log(`aa`, res)
      console.log(`bb`, result)
      console.log(`cc`, data)
    } else {
      console.log(`11`, result)
      console.log(`22`, data)
      console.log(`33`, res)
    }
  }

  function checkDeligate() {
    if (name !== '' && phone !== '' && title !== '' && contents !== '' && broadcast_time1 !== '') {
      setDeligate(true)
    } else {
      setDeligate(false)
    }
  }

  // const name = (e) => {
  //   console.log()
  // }

  // console.

  useEffect(() => {
    checkDeligate()
    console.log(broadcast1)
  }, [name, phone, title, contents, broadcast1])

  // const {searching, coinType, walletData, returnCoinText, setWalletType, controllState} = props

  // const selectWalletTypeData = [
  //   {value: 0, text: '전체'},
  //   {value: 1, text: '구매'},
  //   {value: 2, text: '선물'},
  //   {value: 3, text: '교환'}
  // ]
  /*input event => 항상 onChange 이 함수는 첫번째 인자로 event 객체를 받는다
    이 event객체에서 사용할 것은 event.target이라는 객체로. 그안에있는 value값을 사용한다.
    이 value값은 사용자가 입력한 값이다.

    function submit() {

      document.getElementByiD("a").value == name
    }
    <input type="Text" id="a" />dfdshuifhsdufidshfui
    <button onClick="submit()"> 
  */

  // function timeCheck(str) {
  //   let color = 'red'
  //   let message = ''
  //   let src = speacialOff

  //   return (
  //     <div className={`checkList__talbeRight checkList__talbeRight--${color}`}>
  //       <p>{message}</p>
  //       <img src={src} />
  //     </div>
  //   )
  // }

  function moreButton() {
    return (
      <div className="list__selectBox">
        <div className="slectBox">
          <SelectBox
            className="specialdjSelect"
            boxList={selectlist}
            onChangeEvent={(e) => {
              setBroadcast1(e)
            }}
          />
        </div>
        <div className="slectLine">~</div>
        <div className="slectBox">
          <SelectBox
            boxList={selectlist}
            className="specialdjSelect"
            onChangeEvent={(e) => {
              setBroadcast2(e)
            }}
          />
        </div>
      </div>
    )
  }

  function morepopup() {
    return <>1</>
  }

  return (
    <div>
      <div className="morepopup"></div>

      <div className="checkWrite">
        <div>타이틀</div>
        <div className="list">
          <div className="list__title ">이름 (실명)</div>
          <div className="list__inpuText">
            <input type="text" onChange={(e) => setName(e.target.vlaue)} placeholder="이름을 입력하세요." />
          </div>
        </div>
        <div className="list list--bottom">
          <div className="list__title">휴대폰번호</div>
          <div className="list__inpuText">
            <input
              type="number"
              onChange={(e) => setPhone(e.target.value.replace('-', ''))}
              placeholder="'-'를 뺀 숫자만 입력하세요."
            />
          </div>
        </div>

        <div className="list__title">주 방송시간</div>

        <div className="list__selectBox">
          <div className="slectBox">
            <SelectBox
              className="specialdjSelect"
              boxList={selectlist}
              onChangeEvent={(e) => {
                setBroadcast1(e)
              }}
            />
          </div>
          <div className="slectLine">~</div>
          <div className="slectBox">
            <SelectBox
              boxList={selectlist}
              className="specialdjSelect"
              onChangeEvent={(e) => {
                setBroadcast2(e)
              }}
            />
          </div>
          <button className="list__plusButton" onClick={() => setMorelist(moreList ? false : true)}>
            추가
          </button>
        </div>
        {moreList ? moreButton() : ''}

        <div className="list__box">
          <div className="list__title list__title--marginTop">방송 소개</div>
          <textarea
            className="list__textarea"
            onChange={(e) => setTitle(e.target.vlaue)}
            placeholder="DJ님의 방송에 대해 자세히 설명해 주세요.&#10;(최대 1,000자)"></textarea>
          <div className="list__textNumber">0/1,000</div>
        </div>
        <div className="list__box">
          <div className="list__title">
            내가 스페셜 DJ가 된다면?! <span className="list__titleGray">(선택사항)</span>
          </div>
          <textarea
            className="list__textarea"
            onChange={(e) => setContents(e.target.vlaue)}
            placeholder="DJ님의 방송에 대해 자세히 설명해 주세요. &#10;(최대 1,000자)"
            maxLength="1000"></textarea>
          <div className="list__textNumber">0/1,000</div>
          <button className={`button ${deligate ? 'button--on' : ''}`} onClick={() => setcheckPopup(morepopup ? false : true)}>
            작성 완료
          </button>
        </div>
      </div>
    </div>
  )
}

const selectlist = [
  {value: 0, text: '선택'},
  {value: 0, text: '00:00'},
  {value: 1, text: '01:00'},
  {value: 2, text: '02:00'},
  {value: 3, text: '03:00'},
  {value: 4, text: '04:00'},
  {value: 5, text: '05:00'},
  {value: 6, text: '06:00'},
  {value: 7, text: '07:00'},
  {value: 8, text: '08:00'},
  {value: 9, text: '09:00'},
  {value: 10, text: '10:00'},
  {value: 11, text: '11:00'},
  {value: 12, text: '12:00'},
  {value: 13, text: '13:00'},
  {value: 14, text: '14:00'},
  {value: 15, text: '15:00'},
  {value: 16, text: '16:00'},
  {value: 17, text: '17:00'},
  {value: 18, text: '18:00'},
  {value: 19, text: '19:00'},
  {value: 20, text: '20:00'},
  {value: 21, text: '21:00'},
  {value: 22, text: '22:00'},
  {value: 23, text: '23:00'},
  {value: 24, text: '24:00'}
]
