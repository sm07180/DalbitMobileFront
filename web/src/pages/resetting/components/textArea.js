import React, {useState, useEffect, useContext} from 'react'

// global components
import InputItems from '../../../components/ui/inputItems/InputItems';
// css
import './textArea.scss'
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const TextArea = (props) => {
  const { max, list, type, setList, select, setSelect, fetchAddData, fetchDeleteData, fetchModifyData } = props;
  const [valueCount, setValueCount] = useState(0);
  const [textvalue, setTextValue] = useState("");
  const [textareaState, setTextareaState] = useState("");

  const textChange = (e) => {
    let textVal = e.target.value;
    const idx = e.currentTarget.dataset.idx;
    if(textVal.length > max) {
      e.target.value = e.target.value.substr(0, max);
    } else {
      if(type === "방송 공지") {
        setValueCount(textVal.length);
        setTextValue(textVal);
        if(list[0]?.conts) {
          setSelect({state: true, val: textVal, index: idx});
        } else {
          setSelect({...select, val: textVal})
        }
      } else {
        setValueCount(textVal.length);
        setTextValue(textVal);
        setSelect({...select, val: textVal});
      }
    }
  }

  const disable = () => {
    setTextareaState("disable")
  }

  const submit = () => {
    if(type === "방송 공지") {
      if(list.length < 1) {
        setList(list.concat(textvalue));
        setTextValue("");
        setValueCount(0);
        fetchAddData();
      } else {
        dispatch(setGlobalCtxMessage({type:'toast',msg: "더 이상 추가하실 수 없습니다."}));
      }
    } else {
      if(list.length < 3){
        setList(list.concat(textvalue))
        setTextValue("");
        setValueCount(0);
        fetchAddData();
      } else {
        dispatch(setGlobalCtxMessage({type:'alert',msg: "더 이상 추가하실 수 없습니다."}))
      }
    }
  }

  const submitEdit = () => {
    fetchModifyData();
    setSelect({state: false, val: "", index: -1});
    setList(list.splice(select.index));
  }

  const removeList = () => {
    fetchDeleteData();
    setSelect({state: false, val: "", index: -1,});
    setValueCount(0);
    setList(list.splice(select.index));
  }

  const resetList = () => {
    if(type === "방송 공지") {
      setSelect({state: false, val: list[0]?.conts ? list[0]?.conts : "", index: -1});
    } else {
      setSelect({state: false, val: "", index: -1});
    }
  }

  useEffect(() => {
    if(type==="방송 공지" && list[0]?.conts) {
      setSelect({...select, val: list[0]?.conts, index: list[0]?.auto_no})
      setValueCount(list[0]?.conts.length);
    }
  }, [list]);

  return (
    <div className={`inputTextArea ${textareaState}`}>
      <InputItems type="textarea">
        {type === "방송 공지" ?
          <textarea rows="5" placeholder="내용을 입력해주세요." data-idx={list[0]?.auto_no} onChange={textChange} value={select.val === "" ? "" : select.val} />
          :
          <input type="text" placeholder={list.length === 3 ? "더 이상 추가하실 수 없습니다." : '내용을 입력해주세요.'} onChange={textChange} value={select.val === "" ? "" : select.val}/>
        }
        <div className='textCount'>
          <span>{valueCount}</span>
          <span>/{max}</span>
        </div>
      </InputItems>
      <div className='btnSection'>
        <div className='leftBtn'>
          {type === "방송 공지" && list.length > 0 ?
            <button className="deleteBtn" onClick={removeList}>삭제</button>
            : select.state &&
            <button className="deleteBtn" onClick={removeList}>삭제</button>
          }
        </div>
        <div className='rightBtn'>
          {type === "방송 공지" && list.length > 0 ?
            <button className='deleteBtn' onClick={resetList}>취소</button>
            : select.state &&
            <button className='deleteBtn' onClick={resetList}>취소</button>
          }
          {type === "방송 공지" && list.length > 0 ?
            <button className={`submitBtn ${valueCount > 0 && "active"}`} onClick={submitEdit}>수정</button>
            : type === "방송 공지" && list.length === 0 ?
              <button className={`submitBtn ${valueCount > 0 && "active"}`} onClick={submit}>등록</button>
              : select.index === -1 ?
                <button className={`submitBtn ${valueCount > 0 && "active"}`} onClick={submit}>등록</button>
                :
                <button className={`submitBtn ${valueCount > 0 && "active"}`} onClick={submitEdit}>수정</button>
          }
        </div>
      </div>
    </div>
  )
}

export default TextArea;
