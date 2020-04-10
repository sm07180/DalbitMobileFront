/**
 * @file /mypage/component/banWord.js
 * @brief 마이페이지 방송설정 - 금지어 설정
 **/
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import _ from 'lodash'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

import useChange from 'components/hooks/useChange'

export default props => {
  //-----------------------------------------------------------------------------
  //contenxt
  const context = useContext(Context)

  //state
  const [word, setWord] = useState(false)
  const [list, setList] = useState(false)

  //hooks
  const {changes, setChanges, onChange} = useChange({onChange: -1})

  //-----------------------------------------------------------------------------
  //function

  async function fetchWrite(type) {
    console.log('당황스럽네;삭제가왜안돼')
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
      return context.action.alert({
        msg: `금지어를 입력해주세요.`
      })
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
        context.action.alert({
          msg: res.message
        })
      }
    } else {
      context.action.alert({
        msg: res.message
      })
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
      context.action.alert({
        msg: res.message
      })
    }
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
            value={_.hasIn(changes, `word${index}`) ? changes[`word${index}`] : word[index]}
          />
          <button
            onClick={() => {
              removeInput(index)
            }}>
            삭제
          </button>
        </div>
      )
    })
  }

  const addInput = () => {
    setWord(word.concat(''))
  }

  const removeInput = index => {
    context.action.confirm({
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
    })
  }

  const writeValidate = () => {
    fetchWrite()
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
        </button>
      )}

      {word && createList()}

      <p className="info">금지어는 최대 12자 이내로만 등록 가능합니다.</p>
      <p className="info">채팅 금지어 (최대 100개)를 직접 설정 하실 수 있습니다.</p>

      {word && (
        <div className="btn-wrap">
          <button
            className="white"
            onClick={() => {
              addInput()
            }}>
            추가
          </button>
          <button
            className="purple"
            onClick={() => {
              writeValidate()
            }}>
            저장
          </button>
        </div>
      )}
    </Content>
  )
}

const Content = styled.div`
  margin-top: 16px;

  .input-wrap {
    display: flex;
    input {
      width: calc(100% - 102px);
      padding: 0 12px;
      border: 1px solid #e0e0e0;
      border-right: 0;
      color: #424242;
      line-height: 48px;
    }
    button {
      flex-basis: 102px;
      background: #bdbdbd;
      color: #fff;
      font-size: 16px;
    }
  }
  .input-wrap + .input-wrap {
    margin-top: 20px;
  }

  .ban-add-btn {
    position: relative;
    width: 100%;
    padding: 0 15px;
    border: 1px dashed #e0e0e0;
    color: ${COLOR_MAIN};
    font-size: 14px;
    line-height: 56px;
    text-align: left;
    &:after,
    &:before {
      display: block;
      position: absolute;
      border-radius: 2px;
      background: ${COLOR_MAIN};
      content: '';
    }
    &:before {
      top: 19px;
      right: 24px;
      width: 2px;
      height: 18px;
    }
    &:after {
      top: 27px;
      right: 16px;
      width: 18px;
      height: 2px;
    }
  }

  p.info {
    position: relative;
    margin-top: 40px;
    padding-left: 8px;
    color: #bdbdbd;
    font-size: 14px;
    line-height: 20px;
    transform: skew(-0.03deg);
    &:before {
      display: block;
      position: absolute;
      left: 0px;
      top: 7px;
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background: #dbdbdb;
      content: '';
    }
  }
  p.info + p.info {
    margin-top: 0;
  }

  .btn-wrap {
    margin-top: 20px;
    text-align: center;
    button {
      display: inline-block;
      max-width: 160px;
      width: calc(50% - 4px);
      font-size: 16px;
      line-height: 48px;

      &.white {
        border: 1px solid ${COLOR_MAIN};
        background: #fff;
        color: ${COLOR_MAIN};
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
    }
    .btn-wrap {
      button {
        font-size: 14px;
      }
    }
    .input-wrap {
      input {
        font-size: 14px;
      }
      button {
        font-size: 14px;
      }
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    .btn-wrap {
      button {
        max-width: calc(50% - 4px);
      }
    }
  }
`
