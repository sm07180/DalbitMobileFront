import React, {useState, useEffect, useContext} from 'react'

// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'

import '../../style.scss'
import './forbid.scss'
import useChange from "components/hooks/useChange";
import Toast from "components/ui/toast/Toast";
import _ from 'lodash'
import {Context} from "context";
import Api from "context/api";

const SettingForbid = () => {
  const context = useContext(Context)
  const [word, setWord] = useState(false)
  const [button, setButton] = useState("삭제");
  const [focus, setFocus] = useState(false);
  const [buttonState, setButtonState] = useState(false)
  const {changes, setChanges, onChange} = useChange({onChange: -1})
  const [toast, setToast] = useState({state : false, msg : ""});

  const toastMessage = (text) => {
    setToast({state: true, msg : text})
    setTimeout(() => {
      setToast({state: false})
    }, 3000)
  }

  async function fetchWrite(type) {
    let words = []
    word.forEach((item, index) => {
      if (_.hasIn(changes, `word${index}`)) {
        words = words.concat(changes[`word${index}`])
        console.log(changes[`word${index}`])
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

  const writeValidate = () => {
    fetchWrite()
    setButtonState(false)
  }

  const focusState = (e) => {
    const index = parseInt(e.currentTarget.dataset.value);
    console.log(index);
    setButtonState(index);
    setButton("저장");
  }

  const removeInput = (e) => {
    const index = e.currentTarget.dataset.index
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

  const focusChange = () => {
    setFocus(!focus);
  }

  const blurChange = () => {
    setFocus(!focus);
  }

  const createList = () => {
    return word.map((item, index) => {
      return(
        <div className="inputItems" key={index}>
          <label className={`inputBox ${(buttonState === index && focus) ? "focus" : "" }`} onFocus={focusChange} onBlur={blurChange}>
            <input type="text" name={`word${index}`} defaultValue={_.hasIn(changes, `word${index}`) ? changes[`word${index}`] : word[index]}
                   onClick={focusState} data-value={index} onChange={onChange}
            />
          </label>
          {(buttonState !== index && word[index] !== "") ? (<button type="button" className="inputBtn" data-index={index} onClick={removeInput}>삭제</button>)
            : (buttonState === index || word[index] === "") && (<button type="button" className="inputBtn" onClick={writeValidate}>저장</button>)
          }
        </div>
      )
    })
  }

  const addInput = () => {
    setWord(word.concat(""));
    setButtonState(false);
  }

  const onClick = () => {
    setWord([""]);
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div id="forbid">
      <Header position={'sticky'} title={'금지어 관리'} type={'back'}/>
      <div className="subContent">
        <section className="inputWrap">
          {!word && <SubmitBtn text={'금지어 추가 +'} onClick={onClick}/>}
          {word && createList()}
          {word && word.length < 100 && <SubmitBtn text={'금지어 추가 +'} onClick={addInput}/>}
        </section>
        <section className="noticeInfo">
          <h3>유의사항</h3>
          <p>금지어는 한 단어당 최대 12자 이내</p>
          <p>최대 100개까지 설정 가능</p>
        </section>
      </div>
      {toast.state &&
        <Toast msg={toast.msg}/>
      }
    </div>
  )
}

export default SettingForbid
