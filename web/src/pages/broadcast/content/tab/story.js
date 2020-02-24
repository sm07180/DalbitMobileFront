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
    // console.log('## ccc :', console.log(Object.keys(context.customHeader)))
    console.log('## bbb :', console.log(Object.keys(context)))

    for (let key in context.customHeader) {
      //   console.log('## customeHeader :', 'key:' + key, 'value:', context.customHeader[key])
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
    console.log('## context : ', context)
    // console.log('## useEffect : ', _include(context, context.customHeader))
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
        <div className="noticeInput">
          <textarea onChange={handleChangeInput} maxLength={100}>
            {/* {NoticeData.notice} */}
          </textarea>
          <Counter>{count} / 100</Counter>
        </div>
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

  & .noticeInput {
    position: relative;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: #f5f5f5;
    border-radius: 10px;
    & textarea {
      display: block;
      border: none;
      appearance: none;
      width: 100%;
      min-height: 140px;
      background-color: #f5f5f5;
      color: #424242;
      font-size: 16px;
      transform: skew(-0.03deg);
      resize: none;
      outline: none;
    }
  }
`

const Counter = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: block;
  color: #bdbdbd;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: -0.3px;
  transform: skew(-0.03deg);
`
