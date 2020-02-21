import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Navi from './navibar'
import {LButton} from './bot-button'

const testData = [
  {
    macro: '인사',
    contents: '안녕하세요. ㅇㅇㅇ입니다. 잘부탁드립니다 :)'
  },
  {
    macro: '박수',
    contents: '👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏👏'
  },
  {
    macro: '감사',
    contents: '감ㅅr합니다^_^* ㅇㅇㅇ입니다. 잘부탁드립니다 :) 감ㅅr합니다^_^* 감ㅅr합니다^_^*'
  }
]
export default props => {
  //------------------------------------------------------ declare start
  const [edit, setEdit] = useState(false)
  //------------------------------------------------------ func start
  //------------------------------------------------------ components start
  return (
    <Container>
      <Navi title={'빠른 말 설정'} />
      {edit ? (
        <EditMain>
          <div className="editTitle">
            <div>인사</div>
            <SaveButton>저장</SaveButton>
          </div>
          <HelloTextArea maxLength={50} />
        </EditMain>
      ) : (
        <>
          <div className="title">최대 3개까지 빠른말 설정이 가능합니다.</div>
          <Main>
            <div className="subTitle">
              <div className="macro">명령어</div>
              <div className="contents">내용</div>
            </div>
            <MacroArea>
              {testData.map((data, idx) => {
                return (
                  <MacroLoop key={idx}>
                    <div className="key">{data.macro}</div>
                    <div className="value">{data.contents.substring(0, 9)}</div>
                  </MacroLoop>
                )
              })}
            </MacroArea>
          </Main>
          <ButtonArea>
            <LButton title={'수정하기'} background={'#8555f6'} clickEvent={() => setEdit(true)} />
          </ButtonArea>
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 520px;

  & > .title {
    display: flex;
    width: 100%;
    height: 36px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.71;
    letter-spacing: -0.35px;
    text-align: center;
    color: #616161;
    justify-content: center;
    align-items: flex-end;
  }
`
const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 200px;
  margin-bottom: 18px;

  & > .subTitle {
    display: flex;
    width: 100%;
    height: 40px;
    margin-top: 20px;

    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: -0.35px;
    color: #616161;
  }

  .macro {
    display: flex;
    width: 30%;
    height: 100%;
    justify-content: center;
    align-items: flex-start;
  }

  .contents {
    display: flex;
    width: 65%;
    height: 100%;
    justify-content: center;
    align-items: flex-start;
  }
`
const MacroArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 158px;

  .key {
    display: flex;
    width: 75px;
    height: 40px;
    background-color: #f5f5f5;
    border-radius: 20px;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: -0.35px;
    color: #424242;
  }

  .value {
    display: flex;
    width: 279px;
    height: 40px;
    background-color: #f5f5f5;
    border-radius: 20px;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: -0.35px;
    color: #424242;
  }
`

const MacroLoop = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`
const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  align-items: flex-start;
`

const EditMain = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: -0.35px;

  .editTitle {
    display: flex;
    width: 100%;
    justify-content: space-between;
    height: 30px;
    align-items: center;

    font-size: 16px;
    font-weight: 400;
    line-height: 1.25;
    letter-spacing: -0.4px;
  }

  & > textarea {
    display: block;
    border: none;
    appearance: none;
    resize: none;
    outline: none;
    padding: 20px 20px 20px 20px;

    font-size: 14px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: -0.35px;
    text-align: left;
  }
`
const SaveButton = styled.button`
  display: flex;
  width: 49px;
  height: 26px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.03;
  letter-spacing: -0.35px;
  color: #8555f6;
  background-color: #fff;
  border-color: #8555f6;
  border-style: solid;
  border-width: 1px;
  border-radius: 13px;
  justify-content: center;
  align-items: center;
`
const HelloTextArea = styled.textarea`
  width: 100%;
  height: 96px;
  border-radius: 10px;
  background-color: #f5f5f5;
  margin-top: 6px;
`
