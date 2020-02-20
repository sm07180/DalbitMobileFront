import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Navi from './navibar'
import {LButton} from 'pages/broadcast/content/tab/bot-button'
import {Context} from 'context'

const arr = [{a: 'aaa'}, {b: 'bbb'}, {c: 'ccc'}, {d: 'ddd'}]

const el = [{c: 'aaa'}, {b: 'bbb'}, {a: 'ccc'}, {f: 'fff'}]

export default props => {
  //----------------------------------------------- declare start
  const [text, setText] = useState('')
  const [count, setCount] = useState(0)
  const context = useContext(Context)
  //----------------------------------------------- func start

  const handleChangeInput = event => {
    const {value, maxLength} = event.target
    console.log('# value', value)
    console.log('# count', count)

    setCount(value.length)
    setText(value)
  }

  const _include = (obj, el) => {
    let objArr = []
    let flag = false

    if (context.customHeader.abcd != undefined) {
      alert('true')
    } else {
      alert('false')
    }

    obj.forEach(data => {
      objArr.push(Object.keys(data).toString())
    })

    el.forEach(data => {
      if (objArr.includes(Object.keys(data).toString()) === true) {
        flag = true
      } else {
        flag = false
      }
    })
    return flag
  }

  useEffect(() => {
    console.log('## useEffect : ', _include(arr, el))
    console.log('## context : ', context.customHeader.qwerqwer)
  }, [])
  //----------------------------------------------- components start
  return (
    <Container>
      <Navi title={'사연'} />
      <Main>
        <div className="notice">
          <p>* 사연을 등록하면 DJ에게 사연이 전달 됩니다.</p>
          <p>채팅창에 쓰기 어려운 내용을 등록해보세요.</p>
        </div>
        <TextInputArea>
          <div className="textWrap">
            <textarea maxLength={100} onChange={handleChangeInput} value={text} />
          </div>
          <div className="count">{count}/100</div>
        </TextInputArea>
      </Main>
      <LButton title={'등록하기'} />
    </Container>
  )
}

//----------------------------------------------- styled start

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 368px;
`
const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 312px;
  align-items: center;

  & .notice {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 68px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.14;
    letter-spacing: -0.35px;
    text-align: left;
    color: #616161;
  }
`

const TextInputArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 180px;
  border-radius: 10px;
  background: #f5f5f5;
  /* align-items: center; */
  /* justify-content: center; */
  align-items: flex-end;

  & > .textWrap > textarea {
    width: 90%;
    height: 78%;
    resize: none;
    background: #f5f5f5;
    padding-top: 14px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.25;
    letter-spacing: -0.4px;
    text-align: left;
    color: #424242;
  }

  & > .textWrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  & > .count {
    display: flex;
    width: 70px;
    height: 30px;
    align-items: flex-start;
    justify-content: center;

    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.35px;
    color: #bdbdbd;
  }
`
