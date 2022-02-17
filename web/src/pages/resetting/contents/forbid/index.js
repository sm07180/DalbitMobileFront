import React, {useState, useEffect, useContext} from 'react'

// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import InputItems from 'components/ui/inputItems/InputItems'

import '../../style.scss'
import './forbid.scss'
import useChange from "components/hooks/useChange";
import API from "context/api";
import Toast from "components/ui/toast/Toast";

const SettingForbid = () => {
  const [forbidList, setForbidList] = useState([]);
  const [word, setWord] = useState(false);
  const [list, setList] = useState(false);
  const [button, setButton] = useState(false);
  const {change, setChange, onChange} = useChange({onChange: -1});
  const [toast, setToast] = useState({
    state : false,
    msg : ""
  });

  const toastMessage = (text) => {
    setToast({state: true, msg : text})

    setTimeout(() => {
      setToast({state: false})
    }, 3000)
  }

  const fetchAddData = async (type) => {
    let words = []
    word.forEach((item, idx) => {
      if(_.hasIn(change, `word${idx}`)) {
        words = words.concat(change[`word${index}`])
      } else {
        words = words.concat([item]);
      }
    })
    let banWords;
    let wordIndex = 0;
    words.forEach((item) => {
      if(item == false) return
      if(!wordIndex) {
        banWords = `${item}`
      } else {
        banWords = `${banWords}|${item}`
      }
      wordIndex++
    })
    if(banWords === "" && type !== "remove") {
      toastMessage("금지어를 입력해주세요.")
    }
    const res = await API.mypage_banword_write({
      data: {
        banWord: banWords
      }
    })
    if(res.result === "success") {
      console.log(res);
    }
  }

  const fetchData = async () => {
    const res = await API.mypage_banword_list({})
    if(res.result === "success") {
      setForbidList(res.data)
      console.log(res);
      if(res.data.banWordCnt) {
        setWord(res.data.banWord.split("|"))
      } else {
        setWord(false);
        setChange([""]);
      }
    } else {
      toastMessage(res.message);
    }
  }

  const removeForbid = (e) => {
    let words = word;
    const index = e.currentTarget.dataset;
    setWord([...words]);
    if(_.hasIn(change, `word${index}`)) {
      delete change[`word${index}`];
      setChange({...change});
    }
    fetchAddData("remove");
  }

  const writeValidate = () => {
    fetchAddData();
    setButton(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div id="forbid">
      <Header position={'sticky'} title={'금지어 관리'} type={'back'}/>
      <div className="subContent">
            <section className="inputWrap">
              <InputItems type={'text'} button={'삭제'} >
                <input type="text" />
              </InputItems>
              <InputItems type={'text'} button={'저장'}>
                <input type="text" />
              </InputItems>
              <SubmitBtn text={'금지어 추가 +'}/>
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
