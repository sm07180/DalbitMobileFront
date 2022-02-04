import React, {useState, useEffect} from 'react'

// global components
import '../style.scss'

const TextArea = (props) => {
  const { max, list, setList, select, setSelect } = props;
  const [valueCount, setValueCount] = useState(0);
  const [textvalue, setTextValue] = useState("");
  const [textareaState, setTextareaState] = useState("default");

  const textChange = (e) => {
    let textVal = e.target.value;
    if(textVal.length > max) {      
      e.target.value = e.target.value.substr(0, max);
    } else {      
      setValueCount(textVal.length);
      setTextValue(textVal);
    } 
  }

  const focusIn = () => {
    setTextareaState("focus")
  }

  const focusOut = () => {
    setTextareaState("default")
  }
  
  const disable = () => {
    setTextareaState("disable")
  }

  const submit = () => {
    if(list.length < 3){
      document.querySelector('textarea[name="textarea"]').value = "";
      setValueCount(0);
      setList(list.concat(textvalue))
    } else {
      disable();
    }    
  }

  const removeList = () => {
    let textAreaValue = document.querySelector('textarea[name="textarea"]').value;
    let selectIndex = list.indexOf(textAreaValue);
    setList(list.splice(selectIndex));

    document.querySelector('input[name="radioBox"]:checked').parentNode.parentNode.remove();
    document.querySelector('textarea[name="textarea"]').value = "";    
    
    setSelect({
      state: false,
      val: "",
    });

  }
  
  useEffect(() => {
    document.querySelector('textarea[name="textarea"]').value = select.val;
  }, [select])

  return (
    <div className='inputTextArea'>
      <div className={`textSection ${textareaState && textareaState}`}>
        <textarea
          placeholder='내용을 입력해주세요.'
          onChange={textChange}
          onBlur={focusOut}
          onFocus={focusIn}
          name='textarea'
        />
        <div className='textCount'>
          <span>{valueCount}</span>
          <span>/{max}</span>
        </div>
      </div>
      <div className='btnSection'>
        <div className='leftBtn'>
          {select.state && <button className='deleteBtn'onClick={removeList}>삭제</button>}
        </div>
        <div className='rightBtn'>
          {select.state && <button className='cancelBtn'>취소</button>}          
          <button className={`submitBtn ${valueCount > 0 && "active"}`} onClick={submit}>등록</button>
        </div>
      </div>
    </div>
  )
}

export default TextArea
