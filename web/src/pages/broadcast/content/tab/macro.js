import React, {useEffect, useState, useContext, useRef} from 'react'
import styled from 'styled-components'
import Navi from './navibar'
import {LButton} from './bot-button'
import Api from 'context/api'
import {BroadCastStore} from '../../store'
import {Context} from 'context'
import {Scrollbars} from 'react-custom-scrollbars'

export default props => {
  //------------------------------------------------------ declare start
  const [edit, setEdit] = useState(false)
  const [shortcut, setShortcut] = useState([])
  const store = useContext(BroadCastStore)
  const context = useContext(Context)
  const scrollbars = useRef(null)
  //------------------------------------------------------ func start

  //빠른 말 수정/저장
  async function updateShortcut(param) {
    const {orderNo, order, text} = param
    const res = await Api.member_broadcast_shortcut({
      data: {
        orderNo: orderNo,
        order: order,
        text: text,
        isOn: true
      },
      method: 'POST'
    })
    if (res.result === 'success') {
      context.action.alert({
        callback: () => {
          console.log('callback처리')
        },
        // title: '달빛라디오',
        msg: '빠른 말이 수정되었습니다.'
      })
      selectShortcut() // 빠른 말 수정 완료 후 조회
    }
  }

  //빠른 말 조회 (TEST)
  async function selectShortcut() {
    const res = await Api.member_broadcast_shortcut({
      method: 'GET'
    })

    if (res.result === 'success') {
      store.action.updateShortCutList(res.data)
      setShortcut(res.data)
    }
  }

  //진입 시 빠른 말 조회
  useEffect(() => {
    selectShortcut()
  }, [])

  useEffect(() => {}, [])
  //------------------------------------------------------ components start
  return (
    <Container>
      <Navi title={'빠른 말 설정'} prev={props.prev} _changeItem={props._changeItem} />
      {edit ? (
        <EditMain>
          {/* <Scrollbars ref={scrollbars} style={{height: '90%'}} autoHide> */}
          {shortcut.map((data, idx) => {
            return <MacroInput data={data} key={idx} _click={updateShortcut} _select={selectShortcut} />
          })}
          {/* </Scrollbars> */}
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
              {shortcut.map((data, idx) => {
                return (
                  <MacroLoop key={idx}>
                    <div className="key">{data.order}</div>
                    <div className="value">{data.text}</div>
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

const MacroInput = props => {
  //------------------------------------------------------ declare start
  const [text, setText] = useState('')
  const context = useContext(Context)
  //------------------------------------------------------ func start
  const handleChangeInput = param => {
    const {value, maxLength, name} = event.target
    let numberOfLines = (value.match(/\n/g) || []).length + 1
    if (numberOfLines === 5) {
      context.action.alert({
        callback: () => {
          console.log()
        },
        // title: '달빛라디오',
        msg: '입력 가능한 수를 초과했습니다.'
      })
    }
    setText(value)
  }

  const _update = (orderNo, order) => {
    let params = {
      orderNo: orderNo,
      order: order,
      text: text
    }
    props._click(params)
  }

  useEffect(() => {
    setText(props.data.text)
  }, [])

  //------------------------------------------------------ components start
  return (
    <React.Fragment>
      <div className="editTitle">
        <div>{props.data.order}</div>
        <SaveButton onClick={() => _update(props.data.orderNo, props.data.order)}>저장</SaveButton>
      </div>
      <TextArea onChange={handleChangeInput} maxLength={50} value={text} numerOf />
    </React.Fragment>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

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
    width: 20%;
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
    width: 75%;
    height: 40px;
    background-color: #f5f5f5;
    border-radius: 20px;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;

    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: -0.35px;
    color: #424242;
    padding: 10px 15px 10px 15px;
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
  overflow: hidden;
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
    margin-top: 15px;

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
const TextArea = styled.textarea`
  width: 100%;
  height: 136px;
  border-radius: 10px;
  background-color: #f5f5f5;
  margin-top: 6px;
  overflow: hidden;
`
