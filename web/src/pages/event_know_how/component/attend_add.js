import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import {DEVICE_TYPE} from '../constant'

import uploadIcon from '../static/gallery_g.svg'
const DeviceArr = [
  {value: DEVICE_TYPE.DESKTOP, text: '데스크탑'},
  {value: DEVICE_TYPE.NOTEBOOK, text: '노트북/맥북'},
  {value: DEVICE_TYPE.AOS, text: '안드로이드폰'},
  {value: DEVICE_TYPE.IOS, text: '아이폰'},
  {value: DEVICE_TYPE.TABLET, text: '태블릿'}
]

function AttendAdd() {
  const history = useHistory()

  const [device, setDevice] = useState(-1)
  const [inspection, setInspection] = useState(false)

  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')

  const MakeDeviceWrap = () => {
    return DeviceArr.map((v, idx) => {
      return (
        <button
          key={idx}
          className={`${v.value === device && 'active'}`}
          onClick={() => {
            setDevice(v.value)
          }}>
          {v.text}
        </button>
      )
    })
  }

  useEffect(() => {
    if (title !== '' && contents !== '') setInspection(true)
    else setInspection(false)
  }, [title, contents])

  return (
    <>
      <div className="title_2">
        <h2>방송 노하우 이벤트</h2>
        <button
          onClick={() => {
            history.goBack()
          }}>
          닫기
        </button>
      </div>
      <div className="attendAddWrap">
        <div className="attendAddWrap__condition">
          <div className="attendAddWrap__commonTitle">
            <span>디바이스 선택</span>
            <span>본인의 방송 디바이스를 선택해주세요</span>
          </div>
          <div className="attendAddWrap__condition--buttons">{MakeDeviceWrap()}</div>
        </div>
        {device !== -1 && (
          <div className="attendAddWrap__inputWrap">
            <div className="attendAddWrap__inputWrap--additional">
              {device === DEVICE_TYPE.DESKTOP || device === DEVICE_TYPE.NOTEBOOK ? (
                <>
                  <div className="attendAddWrap__inputWrap--input">
                    <span>마이크</span>
                    <input type="text" placeholder="제품명을 입력해 주세요." />
                  </div>
                  <div className="attendAddWrap__inputWrap--input">
                    <span>믹서/오인페</span>
                    <input type="text" placeholder="제품명을 입력해 주세요." />
                  </div>
                  <span>∙ 믹서/오디오 인터페이스는 사용 중일 경우에만 입력</span>
                </>
              ) : (
                <>
                  <div className="attendAddWrap__inputWrap--input">
                    <span>기종</span>
                    <input type="text" placeholder="제품명을 입력해 주세요." />
                  </div>
                  <div className="attendAddWrap__inputWrap--input">
                    <span>외부 스피커</span>
                    <input type="text" placeholder="제품명을 입력해 주세요." />
                  </div>
                  <span>∙ 외부 스피커는 사용 중일 경우에만 입력</span>
                </>
              )}
            </div>
            <div>
              <div className="attendAddWrap__commonTitle">
                <span>노하우 제목</span>
                <span>{title.length}/30</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= 30) setTitle(e.target.value)
                }}
              />
            </div>
            <div>
              <div className="attendAddWrap__commonTitle">
                <span>노하우 내용</span>
                <span>{contents.length}/1,000</span>
              </div>
              <textarea
                type="text"
                value={contents}
                onChange={(e) => {
                  if (e.target.value <= 1000) setContents(e.target.value)
                }}
              />
            </div>
          </div>
        )}
        <div className="">
          <div className="attendAddWrap__commonTitle">
            <span>이미지 등록</span>
            <span>가로가 긴 이미지를 권장합니다. (최대 3장)</span>
          </div>
          <div className="attendAddWrap__imgWrap">
            <label htmlFor="img1" className="attendAddWrap__imgWrap--label">
              <span className="attendAddWrap__imgWrap--necessary">필수</span>
              <img src={uploadIcon} />
              <span className="attendAddWrap__imgWrap--uploadButton">사진등록</span>
            </label>
            <input type="file" id="img1" />
            <label htmlFor="img2" className="attendAddWrap__imgWrap--label">
              <img src={uploadIcon} />
              <span className="attendAddWrap__imgWrap--uploadButton">사진등록</span>
            </label>
            <input type="file" id="img2" />
            <label htmlFor="img3" className="attendAddWrap__imgWrap--label">
              <img src={uploadIcon} />
              <span className="attendAddWrap__imgWrap--uploadButton">사진등록</span>
            </label>
            <input type="file" id="img3" />
          </div>
        </div>
        <button className={`${inspection === true && 'active'}`}>등록하기</button>
      </div>
    </>
  )
}

export default React.memo(AttendAdd)
