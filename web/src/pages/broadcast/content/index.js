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
  //---------------------------------------------------------------------
  const names2 = ['일상/챗', '고민/사연', '노래방', '건강', '먹방', '책/힐링', '기타', '공포', '연애/오락', '스포츠', '성우', 'ASMR', '노래/연주', '요리']

  const listItem = names2.map((name1, index) => (
    <RadioBoxS key={index}>
      <input id={name1} checked={Radio2 === `${name1}`} type="radio" value={name1} onChange={() => setRadio2(`${name1}`)} />
      <label htmlFor={name1}>{name1}</label>
    </RadioBoxS>
  ))
  //useState
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState(null)
  //---------------------------------------------------------------------

  // 이미지 업로드 관련
  function uploadSingleFile(e) {
    setFile(e.target.files[0])
    setUrl(URL.createObjectURL(e.target.files[0]))
  }
  useEffect(() => {
    // console.log(file)
    // console.log(url)
  }, [uploadSingleFile])

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
        <button
          onClick={() => {
            fetchData({data: changes})
          }}>
          만들기
        </button>

        <BroadDetail>
          <JoinProhibit>
            <h2>입장제한</h2>
            <RadioBox>
              <input id="every" checked={Radio === 'every'} value="every" onChange={() => setRadio('every')} type="radio" />
              <label htmlFor="every">모두 입장</label>
            </RadioBox>

            <RadioBox>
              <input id="fan" checked={Radio === 'fan'} value="fan" onChange={() => setRadio('fan')} type="radio" />
              <label htmlFor="fan">팬 만 입장</label>
            </RadioBox>
            <RadioBox>
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
                  <img src="https://img-wishbeen.akamaized.net/plan/1444896672323_14798621115_2effb95565_k.jpg" />
                </div>
                <UploadWrap>
                  <IconWrapper>
                    <Icon></Icon>
                    <span>재 등록하기</span>
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
        </BroadDetail>
        <section>{JSON.stringify(changes, null, 1)}</section>
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
  height: 124px;
  background-color: #fff;
  & h1 {
    color: #8556f6;
    font-size: 34px;
    font-weight: 600;
    line-height: 124px;
    letter-spacing: -0.85px;
    text-align: center;
  }
`
const BroadDetail = styled.div`
  width: 394px;
  min-height: 500px;
  margin: 36px auto 0 auto;
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
    float: left;
    appearance: none;
    width: 24px;
    height: 24px;
    margin-right: 15px;
    background: url('http://hwangsh.com/img/ico-checkbox-off.png') no-repeat center center / contain;
    cursor: pointer;
  }
  & input:checked {
    background: url('http://hwangsh.com/img/ico-checkbox-on.png') no-repeat center center / contain;
  }
  & label {
    float: left;
    line-height: 24px;
    font-size: 16px;
    letter-spacing: -0.4px;
    text-align: center;
    cursor: pointer;
  }
  & input:checked + label {
    color: #8556f6;
  }
`

const RadioBox = styled.div`
  float: left;
  width: 33%;
  height: 24px;
  margin-top: 26px;
  margin-bottom: 50px;
  &:after {
    display: block;
    clear: both;
    content: '';
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
  margin-right: 7px;
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
  }
  & input:checked + label {
    border: 1px solid #8556f6;
    color: #8556f6;
  }
`
const PictureRegist = styled.div`
  width: 100%;
  margin-top: 60px;
  & h2 {
    margin-bottom: 18px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.45px;
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
    }
  }
  label {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;

    img {
      width: 100%;
      height: 294px;
    }
  }
`
const UploadWrap = styled.span`
  display: block;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
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
