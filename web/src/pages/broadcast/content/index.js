/**
 * @file chat.js
 * @brief 채팅
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, COLOR_MAIN} from 'context/config'
//context
import {Context} from 'pages/live/store'
//hooks
import useChange from 'components/hooks/useChange'
//components
import Api from 'context/api'

//
export default props => {
  //console.log(props.Info[0].category)
  const [Radio, setRadio] = useState('every')
  const [Radio2, setRadio2] = useState('일상/챗')
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(0)

  const handleChange = event => {
    const element = event.target
    const {value} = event.target
    if (value.length > 20) {
      return
    }
    setCount(element.value.length)
  }
  const handleChange2 = event => {
    const element = event.target
    const {value} = event.target
    if (value.length > 100) {
      return
    }
    setCount2(element.value.length)
  }
  //---------------------------------------------------------------------
  const names2 = ['일상/챗', '고민/사연', '노래방', '건강', '먹방', '책/힐링', '기타', '공포', '연애/오락', '스포츠', '성우', 'ASMR', '노래/연주', '요리']

  const listItem = names2.map((name1, index) => (
    <RadioBoxS key={index}>
      <input id={name1} checked={Radio2 === `${name1}`} type="radio" value={name1} onChange={() => setRadio2(`${name1}`)} />
      <label htmlFor={name1}>{name1}</label>
    </RadioBoxS>
  ))
  // 이미지 업로드 관련
  //useState
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState(null)
  function uploadSingleFile(e) {
    setFile(e.target.files[0])
    setUrl(URL.createObjectURL(e.target.files[0]))
  }
  useEffect(() => {
    // console.log(file)
    // console.log(url)
  }, [uploadSingleFile])
  //---------------------------------------------------------------------
  //context
  //hooks
  const {changes, setChanges, onChange} = useChange(update, {
    onChange: -1,
    entryType: 0,
    os: 3,
    roomType: 1,
    welcomMsg: '하이',
    bgImg: '/temp/2020/02/03/10/20200203102802930921.jpg',
    title: '프론트엔드'
  })
  //useState
  const [fetch, setFetch] = useState(null)
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.broad_create({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    }
    console.log(res)
    setFetch(res.data)
  }
  //update
  function update(mode) {
    switch (true) {
      case mode.onChange !== undefined:
        //console.log(JSON.stringify(changes))
        break
    }
  }
  /**
   *
   * @returns
   */
  useEffect(() => {
    //방송방 리스트
  }, [])
  //---------------------------------------------------------------------
  return (
    <>
      <Content>
        <Header>
          <h1>방송설정</h1>
        </Header>

        <Wrap>
          <BroadDetail>
            <JoinProhibit>
              <h2>입장제한</h2>
              <RadioBox value={Radio} className={Radio === 'every' ? 'on' : 'off'}>
                <input id="every" checked={Radio === 'every'} value="every" onChange={() => setRadio('every')} type="radio" />
                <label htmlFor="every">모두 입장</label>
              </RadioBox>

              <RadioBox value={Radio} className={Radio === 'fan' ? 'on' : 'off'}>
                <input id="fan" checked={Radio === 'fan'} value="fan" onChange={() => setRadio('fan')} type="radio" />
                <label htmlFor="fan">팬 만 입장</label>
              </RadioBox>
              <RadioBox value={Radio} className={Radio === 'upper20' ? 'on' : 'off'}>
                <input id="upper20" checked={Radio === 'upper20'} value="upper20" onChange={() => setRadio('upper20')} type="radio" />
                <label htmlFor="upper20">20세이상</label>
              </RadioBox>
            </JoinProhibit>
            <BroadSubject>
              <h2>방송주제</h2>
              <SubjectWrap>{listItem}</SubjectWrap>
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
                      <span>사진등록</span>
                      <Icon></Icon>
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
                fetchData({data: changes})
              }}>
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
  /* min-height: 500px; */
  margin: 0px auto 0 auto;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
`

const JoinProhibit = styled.div`
  width: 100%;

  transform: skew(-0.03deg);
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  & h2 {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.17;
    letter-spacing: -0.45px;
  }

  & input {
    appearance: none;
  }
  & label {
    float: left;
    width: 100%;
    height: 50px;

    line-height: 50px;
    text-align: center;
  }
  & input:checked + label {
    color: #8556f6;
  }
`

const RadioBox = styled.div`
  position: relative;
  width: 33.3333333333333333333333333333333333333333%;
  float: left;
  margin: 26px -1px 50px 0px;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  &.on {
    z-index: 55;
    border: 1px solid #8556f6;
  }
`

const BroadSubject = styled.div`
  width: 100%;
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
const RadioBoxS = styled.div`
  display: inline-block;
  height: 40px;
  margin-right: 10px;
  margin-bottom: 10px;
  &:after {
    display: block;
    clear: both;
    content: '';
  }
  & input {
    appearance: none;
  }
  & label {
    float: left;
    border: 1px solid #e0e0e0;
    border-radius: 50px;
    padding: 10px 20px;
    box-sizing: border-box;
    transform: skew(-0.03deg);
  }
  & input:checked + label {
    border: 1px solid #8556f6;
    color: #8556f6;
  }
  &:nth-of-type(4n) {
    margin-right: 0;
  }
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
  color: #bdbdbd;
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
  width: 48px;
  height: 48px;
  background: url('http://www.hwangsh.com/img/camera.png') no-repeat center / cover;
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
  background-color: #8556f6;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  line-height: 50px;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);
`
