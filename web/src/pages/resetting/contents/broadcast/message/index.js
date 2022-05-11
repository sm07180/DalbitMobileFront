import React, {useState, useEffect, useReducer, useContext} from 'react'

import Api from 'context/api'

// global components
import Header from 'components/ui/header/Header'

import './message.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const Message = () => {
  const [messageList, setMessageList] = useState([]);
  const [btnActive, setBtnActive] = useState(false);

  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //퀵 메시지 조회
  const fetchData = async () => {
    const res = await Api.member_broadcast_shortcut({method: 'GET'})
    if (res.result === 'success') {setMessageList(res.data.list);}
  }

  //퀵 메시지 수정
  const fetchEditData = async (e) => {
    const idx = e.currentTarget.dataset.idx;
    const res = await Api.member_broadcast_shortcut({method: "POST", data: {...messageList[idx]}})
    if(res.result === "success") {
      dispatch(setGlobalCtxMessage({type:'toast',msg: "퀵 메시지를 저장하였습니다."}));
      setBtnActive(false);
    }else {
      dispatch(setGlobalCtxMessage({type:'toast',msg: res.message}));
    }
  }

  //내용값 가져오기
  const valueChange = (e) => {
    let val = e.target.value;
    let index = parseInt(e.currentTarget.dataset.idx)
    if(val !== "") {setBtnActive(index)}
    setMessageList(messageList.map((v) => {v.text = e.target.value; return v;}));
  }

  //명령값 가져오기
  const titleChange = (e) => {
    let val = e.target.value;
    let index = parseInt(e.currentTarget.dataset.idx)
    if(val !== "") {setBtnActive(index);}
    setMessageList(messageList.map((v) => {v.order = e.target.value; return v;}));
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 페이지 시작
  return (
    <div id="message">
      <Header position={'sticky'} title={'퀵 메시지'} type={'back'}/>
      <div className='subContent'>
        <p className='topText'>명령어는 2글자, 내용은 최대 200글자까지 입력 가능</p>
        <div className='listWrap'>
          {messageList.map((item, index) => {
            return (
              <div className='list' key={index}>
                <div className='listHead'>
                  <div className='titleWrap'>
                    <span className='listIndex'>{item.orderNo}</span>
                    <span className='listTitle'>퀵 메시지</span>
                  </div>
                  <button className={`saveBtn ${btnActive === index && 'active'}`} data-idx={index} onClick={fetchEditData}>저장</button>
                </div>
                <div className='listContent'>
                  <div className='listRow'>
                    <div className='category'>명령어</div>
                    <input type="text" className='inputText' name="order" data-idx={index} onChange={titleChange} defaultValue={item.order}/>
                  </div>
                  <div className='listRow'>
                    <div className='category'>내용</div>
                    <input type="text" className='inputText' name="text" data-idx={index} onChange={valueChange} defaultValue={item.text}/>
                  </div>
                </div>
              </div>
            )
          })
          }
        </div>
      </div>
    </div>
  )
}

export default Message;
