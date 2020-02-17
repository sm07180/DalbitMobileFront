/**
 * @file chat.js
 * @brief 채팅
 */
import React, {useMemo, useEffect, useContext, useState, useCallback} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, COLOR_MAIN} from 'context/config'
//context
//import {Context} from 'pages/live/store'
import {Context} from 'context'
//hooks
import useChange from 'components/hooks/useChange'
//components
import Api from 'context/api'
//etc
import getDecibel from 'components/lib/getDecibel.js'
import {getAudioDeviceCheck} from 'components/lib/audioFeature.js'

export default props => {
  const context = useContext(Context)
  //context
  //hooks-usechange
  const {changes, setChanges, onChange} = useChange(update, {
    onChange: -1,
    entryType: 0,
    roomType: '01',
    bgImgRacy: 3,
    welcomMsg: '',
    bgImg: '',
    title: ''
  })

  //update
  function update(mode) {
    // console.log('---')
    switch (true) {
      case mode.onChange !== undefined:
        //console.log(JSON.stringify(changes))
        break
    }
  }
  //makeRadio
  const makeRadio = () => {
    const info = ['모두입장', ' 팬만 입장', '20세이상']
    return info.map((list, index) => {
      return (
        <JoinRadio
          className={index == changes.entryType ? 'on' : ''}
          key={index}
          onClick={() => {
            setChanges({...changes, entryType: index})
          }}>
          {list}
        </JoinRadio>
      )
    })
  }
  const makeRadios = () => {
    const info = ['일상/챗', ' 연애/오락', '노래/연주', '고민/사연', '책/힐링', '스포츠', 'ASMR', '노래방', '건강', '공포', '먹방', '성우', '요리', '기타']
    let leadingZeros = (n, digits) => {
      var zero = ''
      n = n.toString()
      if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++) zero += '0'
      }
      return zero + n
    }

    return info.map((list, index) => {
      let idx = leadingZeros(index, 2)
      return (
        <SubjectRadio
          className={idx == changes.roomType ? 'on' : ''}
          key={index}
          onClick={() => {
            setChanges({...changes, roomType: idx})
          }}>
          {list}
        </SubjectRadio>
      )
    })
  }

  //글자수제한
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(0)

  const handleChange = event => {
    const element = event.target
    const {value} = event.target
    if (value.length > 20) {
      return
    }
    setCount(element.value.length)
    setChanges({...changes, title: value})
  }
  const handleChange2 = event => {
    const element = event.target
    const {value} = event.target
    if (value.length > 100) {
      return
    }
    setCount2(element.value.length)
    setChanges({...changes, welcomMsg: value})
  }

  // 이미지 업로드 관련
  //useState
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState(null)

  function uploadSingleFile(e) {
    // setFile(e.target.files[0])
    // setUrl(URL.createObjectURL(e.target.files[0]))

    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])

    reader.onload = function() {
      if (reader.result) {
        setUrl(reader.result)
        setChanges({...changes, bgImg: reader.result})
      } else {
      }
    }
  }
  //validation
  const [BActive, setBActive] = useState(false)
  useEffect(() => {
    let value = false
    if (changes.welcomMsg.length > 10 && changes.welcomMsg.length < 101) {
      if (changes.welcomMsg.length > 0 && changes.title.length < 21) {
        if (changes.bgImg !== '') {
          value = true
        }
      }
    }
    setBActive(value)
  }, [changes])

  //---------------------------------------------------------------------
  //context

  //useState
  const [fetch, setFetch] = useState(null)
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const resUpload = await Api.image_upload({
      data: {
        file: '',
        dataURL: obj.bgImg,
        imageURL: '',
        uploadType: 'bg'
      }
    })
    if (resUpload) {
      if (resUpload.result === 'success' || resUpload.code == 0) {
        setChanges({...changes, bgImg: resUpload.data.path})

        const res = await Api.broad_create({
          data: {
            roomType: changes.roomType,
            title: changes.title,
            bgImg: resUpload.data.path,
            bgImgRacy: 3,
            welcomMsg: changes.welcomMsg,
            notice: '',
            entryType: changes.entryType
          }
        })
        console.table(res)
        setFetch(res.data)
        if (res) {
          if (res.code == 0) {
            console.log(res)
            props.history.push('/broadcast/' + res.data.roomNo, res.data)
          } else {
            console.warn(res.message)
          }
        }
      } else {
        //Error발생시
        console.log('방생성실패')
      }
    }
  }

  /**
   * volume state
   */
  const {mediaHandler} = context
  const [audioVolume, setAudioVolume] = useState(0)
  const [audioSetting, setAudioSetting] = useState(false)
  const [audioPass, setAudioPass] = useState(false)
  const [drawId, setDrawId] = useState(null)

  if (mediaHandler && !audioSetting) {
    setAudioSetting(true)
    ;(async () => {
      const device = await getAudioDeviceCheck()

      if (!device) {
        context.action.updatePopup('CAST')
      } else {
        const audioStream = await navigator.mediaDevices
          .getUserMedia({audio: true})
          .then(result => result)
          .catch(e => e)
        if (!audioStream) {
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext
        const audioCtx = new AudioContext()

        const audioSource = audioCtx.createMediaStreamSource(audioStream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 1024
        audioSource.connect(analyser)

        let timeOutId = null
        const volumeCheck = () => {
          const db = getDecibel(analyser)
          timeOutId = setTimeout(() => {
            setAudioVolume(0)
          }, 2000)

          if (db !== audioVolume) {
            clearTimeout(timeOutId)
            setAudioVolume(db)
            if (!audioPass) {
              setAudioPass(true)
            }
          }
        }
        if (!drawId) {
          setDrawId(setInterval(volumeCheck))
        }
      }
    })()
  }

  useEffect(() => {
    return () => {
      clearInterval(drawId)
    }
  }, [drawId])

  /*
   *
   * @returns
   */

  //---------------------------------------------------------------------
  return (
    <>
      <Content>
        <Header>
          <h1>방송설정</h1>
        </Header>

        <Wrap>
          <BroadDetail>
            <MicCheck>
              <h2>마이크 연결상태</h2>
              <VolumeWrap>
                <MicIcon></MicIcon>
                <MicVolumeBTN></MicVolumeBTN>
                <BarWrap>
                  <MicVolumeONBar
                    style={{
                      width: `${audioVolume}%`
                    }}></MicVolumeONBar>
                </BarWrap>
              </VolumeWrap>
            </MicCheck>
            <JoinProhibit>
              <h2>입장제한</h2>
              {makeRadio()}
            </JoinProhibit>
            <BroadSubject>
              <h2>방송주제</h2>
              <SubjectWrap>{makeRadios()}</SubjectWrap>
            </BroadSubject>
            <PictureRegist>
              <h2>사진 등록</h2>
              <ProfileUpload imgUrl={url}>
                <label htmlFor="profileImg">
                  <div className={url ? 'on' : 'off'}>
                    <div></div>
                  </div>
                  <UploadWrap className={url ? 'on' : 'off'}>
                    <IconWrapper>
                      <Icon className={url ? 'on' : 'off'}></Icon>
                    </IconWrapper>
                  </UploadWrap>
                </label>
                <input
                  type="file"
                  id="profileImg"
                  accept=".gif, .jpg, .png"
                  onChange={e => {
                    uploadSingleFile(e)
                  }}
                />
              </ProfileUpload>
            </PictureRegist>
            <BroadTitle>
              <h2>방송 제목</h2>
              <div>
                <input onChange={handleChange} maxLength="20" placeholder="제목을 입력해주세요 (20자 이내)" />
                <Counter>{count} / 20</Counter>
              </div>
            </BroadTitle>
            <BroadWelcome>
              <h2>인사말</h2>
              <div>
                <textarea
                  onChange={handleChange2}
                  maxLength="100"
                  placeholder="청취자가 방송방에 들어올 때 자동 인사말을 입력해보세요.
                  (10 ~ 100자 이내)
                  "
                />
                <Counter>{count2} / 100</Counter>
              </div>
            </BroadWelcome>
            <CopyrightIcon></CopyrightIcon>
            <CreateBtn
              onClick={() => {
                if (!audioPass) {
                  return alert('오디오 인풋이 하나도 안되었습니다.')
                }
                fetchData({...changes})
              }}
              value={BActive}
              className={BActive === true && audioPass ? 'on' : ''}>
              방송하기
            </CreateBtn>
          </BroadDetail>
        </Wrap>
        {/* <section>{JSON.stringify(changes, null, 1)}</section> */}
      </Content>
    </>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  width: 100%;
`
const Header = styled.div`
  width: 100%;
  height: 110px;
  & h1 {
    color: #8556f6;
    font-size: 34px;
    font-weight: 800;
    line-height: 110px;
    letter-spacing: -0.85px;
    text-align: center;
  }
`
const Wrap = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 50px;
`
const BroadDetail = styled.div`
  width: 394px;
  margin: 0px auto 0 auto;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
`
const MicCheck = styled.div`
  width: 100%;
  & h2 {
    margin-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.17;
    letter-spacing: -0.45px;
  }
`
const VolumeWrap = styled.div`
  position: relative;
  width: 100%;
  height: 36px;
  margin-bottom: 40px;
  border-radius: 18px;
  background-color: #f5f5f5;
`
const MicIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #bdbdbd url('http://www.hwangsh.com/img/ic_mic.png') no-repeat center center / cover;
`
const MicVolumeBTN = styled.div``
const BarWrap = styled.div`
  position: absolute;
  top: 16px;
  left: 58.5px;
  width: 81.47%;
  height: 4px;
  border-radius: 50px;
  background-color: #bdbdbd;
`

const MicVolumeONBar = styled.div`
  /* width: ${props => props.volume}%; */
  width:0%;
  height: 100%;
  background-color: #fdad2b;
  border-radius: 50px;
  transition: ease-in 0.1s;
  &.on {
    width:100%;
  }
`

const JoinProhibit = styled.div`
  width: 100%;
  & h2 {
    margin-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.17;
    letter-spacing: -0.45px;
  }
`
const JoinRadio = styled.div`
  display: inline-block;
  position: relative;
  width: 33.333%;
  margin-left: -1px;
  padding: 16px 33px 16px 33px;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  color: #707070;
  font-size: 16px;
  transform: skew(-0.03deg);
  cursor: pointer;
  &.on {
    border: 1px solid #8556f6;
    color: #8556f6;
    z-index: 2;
  }
  &:focus {
    outline: none;
  }
`
const SubjectRadio = styled.div`
  display: inline-block;
  position: relative;
  padding: 11px 17px 11px 17px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  box-sizing: border-box;
  color: #707070;
  font-size: 16px;
  transform: skew(-0.03deg);
  cursor: pointer;
  &.on {
    border: 1px solid #8556f6;
    color: #8556f6;
    z-index: 2;
  }
  &:focus {
    outline: none;
  }
`

const BroadSubject = styled.div`
  width: 100%;
  margin-top: 40px;
  & h2 {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.45px;
  }
`
const SubjectWrap = styled.div`
  width: 100%;
  margin-top: 25px;
`

const PictureRegist = styled.div`
  width: 100%;
  margin-top: 50px;
  & h2 {
    position: relative;
    margin-bottom: 18px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.45px;
    &:after {
      position: absolute;
      bottom: 0;
      right: 0;
      content: '방송 배경 이미지를 등록해주세요.';
      color: #bdbdbd;
      font-size: 12px;
      line-height: 1.5;
      letter-spacing: -0.3px;
      transform: skew(-0.03deg);
    }
  }
`

const ProfileUpload = styled.div`
  width: 100%;
  position: relative;
  input {
    position: absolute;
    height: 0;
    width: 0;
  }
  div {
    width: 100%;
    height: 294px;
    background: url(${props => props.imgUrl}) no-repeat center center / cover;
  }
  div.on {
    img {
      display: none;
      background-color: none;
    }
  }
  label {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;

    div {
      width: 100%;
      height: 294px;
      background-color: #f5f5f5;
    }
  }
`
const UploadWrap = styled.span`
  display: block;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;

  transform: skew(-0.03deg);
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  &.on {
    height: 80px;
    background-color: rgba(0, 0, 0, 0.5);
  }
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  & span {
    float: left;
    line-height: 48px;
    font-size: 12px;
    letter-spacing: -0.3px;
  }
`
const IconWrapper = styled.span`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
const Icon = styled.em`
  float: left;
  width: 90px;
  height: 48px;
  background: url('http://www.hwangsh.com/img/came.png') no-repeat center / cover;
  &.on {
    background: url('http://www.hwangsh.com/img/cameraon.png') no-repeat center / cover;
  }
`
const BroadTitle = styled.div`
  position: relative;
  width: 100%;
  margin-top: 56px;
  & h2 {
    margin-bottom: 25px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.45px;
    transform: skew(-0.03deg);
  }
  & input {
    display: block;
    width: 100%;
    height: 50px;
    padding: 16px 0 16px 15px;
    box-sizing: border-box;
    background-color: #f5f5f5;
    color: #8556f6;
    font-size: 16px;
    line-height: 1.13;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
  }
`
const Counter = styled.span`
  position: absolute;
  right: 5px;
  bottom: 0;
  display: block;
  color: #bdbdbd;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: -0.3px;
  transform: skew(-0.03deg);
`
const BroadWelcome = styled.div`
  position: relative;
  width: 100%;
  margin-top: 56px;
  & h2 {
    margin-bottom: 25px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.45px;
    transform: skew(-0.03deg);
  }
  & textarea {
    display: block;
    border: none;
    appearance: none;
    width: 100%;
    height: 110px;
    font-family: NanumSquare;
    padding: 15px 40px 15px 15px;
    box-sizing: border-box;
    background-color: #f5f5f5;
    color: #424242;
    font-size: 14px;
    line-height: 1.43;
    transform: skew(-0.03deg);
    resize: none;
  }
`
const CopyrightIcon = styled.div`
  float: right;
  width: 102px;
  height: 16px;
  background: url('https://devimage.dalbitcast.com/images/api/copyright.png') no-repeat center center / cover;
  margin: 47px 0 15px 0;
`
const CreateBtn = styled.button`
  width: 100%;
  height: 50px;
  margin-bottom: 218px;
  outline: none;
  background-color: #bdbdbd;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  line-height: 50px;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);

  &.on {
    background-color: #8556f6;
    cursor: pointer;
  }
`
//-------------
const Pop = styled.button`
  display: block;
  width: 100%;
  background-color: skyblue;
  color: #fff;
  font-size: 14px;
  line-height: 42px;
  letter-spacing: -0.35px;
  cursor: pointer;
  transform: skew(-0.03deg);
`
