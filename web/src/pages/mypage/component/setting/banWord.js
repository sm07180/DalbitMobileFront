/**
 * @file /mypage/component/banWord.js
 * @brief 마이페이지 방송설정 - 금지어 설정
 **/
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

//context
import Api from 'context/api'
import _ from 'lodash'
import {COLOR_MAIN} from 'context/color'
import {WIDTH_MOBILE, WIDTH_TABLET_S} from 'context/config'

import useChange from 'components/hooks/useChange'
// svg
import BlackPlusIcon from '../black_plus.svg'
import BackIcon from '../black_plus.svg'

import './index.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //state
  const [word, setWord] = useState(false)
  const [list, setList] = useState(false)
  const [buttonState, setButtonState] = useState(false)
  //hooks
  const {changes, setChanges, onChange} = useChange({onChange: -1})
  //-----------------------------------------------------------------------------
  //function

  async function fetchWrite(type) {
    let words = []
    word.forEach((item, index) => {
      if (_.hasIn(changes, `word${index}`)) {
        words = words.concat(changes[`word${index}`])
      } else {
        words = words.concat([item])
      }
    })

    let banWords = ''
    let wordIndex = 0
    words.forEach((item, index) => {
      if (item == false) return
      if (!wordIndex) {
        banWords = `${item}`
      } else {
        banWords = `${banWords}|${item}`
      }
      wordIndex++
    })
    if (banWords == '' && type != 'remove')
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: `금지어를 입력해주세요.`
      }))
    const res = await Api.mypage_banword_write({
      data: {
        banWord: banWords
      }
    })
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      if (res.data.banWordCnt) {
        setWord(res.data.banWord.split('|'))
      } else {
        setWord(false)
      }
      setChanges([''])
      if (!(type == 'remove')) {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: res.message
        }))
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: res.message
      }))
    }
  }

  async function fetchList() {
    const res = await Api.mypage_banword_list({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      if (res.data.banWordCnt) {
        setWord(res.data.banWord.split('|'))
      } else {
        setWord(false)
        setChanges([''])
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: res.message
      }))
    }
  }
  const focusState = (index) => {
    setButtonState(index)
  }
  const createList = () => {
    return word.map((item, index) => {
      return (
        <div className="input-wrap" key={index}>
          <input
            type="text"
            maxLength="12"
            name={`word${index}`}
            onChange={onChange}
            onClick={() => focusState(index)}
            value={_.hasIn(changes, `word${index}`) ? changes[`word${index}`] : word[index]}
          />
          {buttonState !== index && word[index] !== '' && (
            <button
              onClick={() => {
                removeInput(index)
              }}>
              삭제
            </button>
          )}
          {(buttonState === index || word[index] === '') && (
            <button
              className="save_btn"
              onClick={() => {
                writeValidate()
              }}>
              저장
            </button>
          )}
        </div>
      )
    })
  }

  const addInput = () => {
    setWord(word.concat(''))
    setButtonState(false)
  }

  const removeInput = (index) => {
    dispatch(setGlobalCtxMessage({
      type: "confirm",
      msg: `금지어를 삭제하시겠습니까?`,
      callback: () => {
        let words = word
        let splice = words.splice(index, 1)
        setWord([...words])
        if (_.hasIn(changes, `word${index}`)) {
          delete changes[`word${index}`]
          setChanges({...changes})
        }
        fetchWrite('remove')
      }
    }))
  }

  const writeValidate = () => {
    fetchWrite()
    setButtonState(false)
  }

  //-----------------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    fetchList()
  }, [])

  //-----------------------------------------------------------------------------
  return (
    <Content>
      {!word && (
        <button
          className="ban-add-btn"
          onClick={() => {
            setWord([''])
          }}>
          금지어 추가
          <span></span>
        </button>
      )}

      {word && createList()}
      {word && word.length < 100 && (
        <div className="btn-wrap">
          <button
            className="white"
            onClick={() => {
              addInput()
            }}>
            금지어 추가
            <a></a>
          </button>
        </div>
      )}
      <p className="info">∙ &nbsp;금지어는 한 단어당 최대 12자 이내</p>
      <p className="info">∙ &nbsp;최대 100개까지 설정 가능</p>
    </Content>
  )
}

const Content = styled.div`
  padding: 0 16px;
  .input-wrap {
    display: flex;
    padding: 0 8px 0 16px;
    align-items: center;
    justify-content: space-between;
    border-radius: 12px;
    border: solid 1px #e0e0e0;
    background-color: #ffffff;
    height: 44px;
    input {
      width: calc(100% - 50px);
      padding: 0px 0px;
      height: 32px;
      border-right: 0;
      color: #424242;
    }
    button {
      display: block;
      width: 46px;
      height: 32px;
      background: #fff;
      color: #000;
      font-size: 16px;
      border-radius: 8px;
      border: solid 1px #757575;
    }
    .save_btn {
      color: #fff;
      border: solid 1px #757575;
      background-color: #757575;
    }
  }
  .input-wrap + .input-wrap {
    margin-top: 4px;
  }

  .ban-add-btn {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 44px;
    padding: 0 15px;
    border: solid 1px #e0e0e0;
    border-radius: 12px;
    background-color: #f5f5f5;
    color: #000;
    font-size: 16px;
    line-height: 44px;
    text-align: center;
    > span {
      margin-left: 3px;
      width: 24px;
      height: 24px;
      background: url(${BlackPlusIcon});
    }
  }

  p.info {
    position: relative;
    margin-top: 16px;
    padding-left: 8px;
    color: #757575;
    font-size: 12px;
    letter-spacing: -0.3px;
    transform: skew(-0.03deg);
  }
  p.info + p.info {
    margin-top: 2px;
  }

  .btn-wrap {
    margin-top: 4px;
    text-align: center;
    width: 100%;
    button {
      display: inline-block;
      max-width: 160px;
      font-size: 16px;
      line-height: 44px;
      &.white {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        background: #fff;
        color: #000;
        height: 44px;
        border-radius: 12px;
        border: solid 1px #e0e0e0;
        background-color: #f5f5f5;
        > a {
          display: block;
          width: 24px;
          height: 24px;
          margin-left: 2px;
          background: url(${BackIcon});
        }
      }
      &.purple {
        border: 1px solid ${COLOR_MAIN};
        background: ${COLOR_MAIN};
        color: #fff;
      }
    }

    button + button {
      margin-left: 8px;
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    p.info {
      font-size: 12px;
      letter-spacing: -0.5px;
    }
    .btn-wrap {
      button {
        font-size: 16px;
      }
    }
    .input-wrap {
      input {
        font-size: 14px;
        font-weight: 600;
      }
      button {
        font-size: 14px;
      }
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    .btn-wrap {
      button {
        max-width: 100%;
      }
    }
  }
`

// import React, {useState, useEffect} from 'react'

// function BanWord() {

//   const [tab, setTab] = useState(0);

//   useEffect(() => {

//   }, [])
//   return (
//     <div id="banwordWrap">
//       <div className="buttonWrap">
//         <button>개별</button>
//         <button>통합</button>
//       </div>
//     </div>
//   )
// }

// export default React.memo(BanWord)
