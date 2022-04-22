import React, {useContext, useEffect, useState} from 'react'
import {Context} from 'context'
import Api from 'context/api'
import {useHistory} from 'react-router-dom'
import Header from 'components/ui/new_header.js'
import './package.scss'

const packageEventWrite = () => {
  const history = useHistory()
  const context = useContext(Context)

  //state
  const [deligate, setDeligate] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [postCode, setPostCode] = useState('') //우번편호
  const [address, setAddress] = useState('') // 주소
  const [detailAdress, setDetailAdress] = useState('') // 상세주소
  const [device, setDevice] = useState('')
  const [contents, setContents] = useState('')

  async function stateCheck() {
    const res = await Api.getPackageEventStateCheck({})
    if (res.result === 'success') {
      if (res.data.isOk === 0) {
        //참여불가능
        context.action.alert({
          msg: `<div class="packageEventAlertColor">지원신청을 위해서는 방송시간이<br/>10시간 이상이어야 합니다.<br/><span >누적 방송 시간 : ${res.data.airTimeStr}</span></div>`,
          callback: () => {
            history.push('/')
          }
        })
      }
    } else {
      if (!context.token.isLogin) {
        context.action.alert({
          msg: res.message,
          callback: () => {
            history.push({
              pathname: '/login',
              state: {
                state: 'event/package'
              }
            })
          }
        })
      } else {
        context.action.alert({
          msg: res.message,
          callback: () => {
            history.push('/')
          }
        })
      }
    }
  }

  async function packageEventUpload() {
    const res = await Api.getPackageEventWrite({
      name: name,
      phone: phone,
      postCode: postCode,
      address_1: address,
      address_2: detailAdress,
      device: device,
      contents: contents
    })
    const {result} = res
    if (result === 'success') {
      context.action.alert({
        msg: '작성 완료되었습니다.',
        callback: () => {
          history.push('/')
        }
      })
    } else {
      context.action.alert({
        msg: res.message,
        callback: () => {}
      })
    }
  }

  const handleChange = (event) => {
    const element = event.target
    const {value} = event.target
    if (value.length > 1000) {
      return
    }
    setDevice(value)
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
      remsg: '신청하시겠습니까?',
      msg: '웹캠 지원 신청서 작성을 완료한 뒤에는 신청 내용 수정이 불가능합니다.',

      //콜백처리
      callback: () => {
        packageEventUpload()
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

    if (postCode === '') {
      context.action.alert({
        msg: '주소를 검색해주세요.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }

    if (address === '') {
      context.action.alert({
        msg: '주소를 검색해주세요.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }

    if (detailAdress === '') {
      context.action.alert({
        msg: '상세 주소를 입력해주세요.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }

    if (device === '') {
      context.action.alert({
        msg: '보유장비 내용을 입력해주세요.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }

    if (contents === '') {
      context.action.alert({
        msg: '방송 소개 내용을 입력해주세요.',
        callback: () => {
          context.action.alert({visible: false})
        }
      })
      return
    }

    confirm()
  }
  function checkDeligate() {
    if (name !== '' && phone !== '' && device !== '' && contents !== '' && address !== '' && detailAdress !== '') {
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

  const closeDaumPostCode = () => {
    const element_layer = document.getElementById('layer')
    element_layer.style.display = 'none'
  }

  const searchAddr = (e) => {
    const element_layer = document.getElementById('layer')

    new window['daum'].Postcode({
      oncomplete: (data) => {
        setPostCode(data.zonecode)
        setAddress(data.address)
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
    var width = 300 //우편번호서비스가 들어갈 element의 width
    var height = 500 //우편번호서비스가 들어갈 element의 height
    var borderWidth = 2 //샘플에서 사용하는 border의 두께
    const element_layer = document.getElementById('layer')
    const closeBtn = document.getElementById('layer__close')
    // 위에서 선언한 값들을 실제 element에 넣는다.
    // 위에서 선언한 값들을 실제 element에 넣는다.
    // element_layer.style.width = width + 'px';
    element_layer.style.height = height + 'px'
    element_layer.style.border = borderWidth + 'px solid'
    // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
    element_layer.style.left = ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth + 'px'
    element_layer.style.top =
      ((window.screen.height || document.documentElement.clientHeight) - height) / 2 - borderWidth - 50 + 'px'
    closeBtn.style.right = ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth - 20 + 'px'
    closeBtn.style.top = ((window.screen.height || document.documentElement.clientHeight) - height) / 2 - borderWidth - 50 + 'px'
  }

  useEffect(() => {
    checkDeligate()
  }, [name, phone, postCode, address, detailAdress, device, contents])

  useEffect(() => {
    stateCheck()
  }, [])

  return (
    <div id="packageEvent">
      <Header title="신청서 작성" />
      <div className="subContent gray">
        <div id="layer">
          <button id="layer__close" onClick={closeDaumPostCode}>
            X
          </button>
        </div>

        <div className="packageItem">
          <p className="subTitle">이름(실명)</p>
          <input type="text" onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요." />
        </div>
        <div className="packageItem">
          <p className="subTitle">휴대폰번호</p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhone(e)}
            placeholder="'-'를 뺀 숫자만 입력하세요."
            maxLength="11"
          />
        </div>
        <div className="packageItem disabled">
          <p className="subTitle">우편번호</p>
          <input type="text" placeholder="주소 검색을 해주세요." disabled value={postCode} />
          <button className="addressBtn" onClick={(e) => searchAddr(e)}>
            주소검색
          </button>
        </div>

        <div className="packageItem disabled">
          <p className="subTitle">주소</p>
          <input type="text" value={address} placeholder="자동 입력됩니다." disabled={true} />
        </div>
        <div className="packageItem">
          <p className="subTitle">상세주소</p>
          <input type="text" placeholder="상세주소를 입력해주세요" onChange={(e) => setDetailAdress(e.target.value)} />
        </div>

        <h3 className="title">
          보유 장비
          <span>
            <em>{device.length}</em> / 1000
          </span>
        </h3>
        <div className="packageItem">
          <textarea
            onChange={handleChange}
            maxLength="1000"
            placeholder="보이는라디오 방송을 진행하기 위해 보유하고
계신 PC 장비 스펙을 알려주세요."></textarea>
        </div>

        <h3 className="title">
          방송 소개
          <span>
            <em>{contents.length}</em> / 1000
          </span>
        </h3>
        <div className="packageItem">
          <textarea
            maxLength="1000"
            onChange={handleChange2}
            placeholder="보이는라디오를 통해 진행하고 싶은 DJ님의 방에 대해
          자세히 설명 해주세요. (최대 1,000자)"></textarea>
        </div>

        <button className={`button ${deligate ? 'button--on' : ''}`} onClick={alertDeligate}>
          작성 완료
        </button>
      </div>
    </div>
  )
}

export default packageEventWrite
