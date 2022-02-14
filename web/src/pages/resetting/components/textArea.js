import React, {useState, useEffect} from 'react'

// global components
import InputItems from 'components/ui/inputItems/inputItems'
// css
import './textArea.scss'

const TextArea = (props) => {
  const { list, setList, select, setSelect } = props;
  const [valueCount, setValueCount] = useState(0);
  const [textvalue, setTextValue] = useState("");
  const [textareaState, setTextareaState] = useState("");

  let max = 20
  const textChange = (e) => {
    let textVal = e.target.value;
    if(textVal.length > max) {      
      e.target.value = e.target.value.substr(0, max);
    } else {      
      setValueCount(textVal.length);
      setTextValue(textVal);
    } 
  }
  
  const disable = () => {
    setTextareaState("disable")
  }

  const submit = () => {
    if(list.length < 3){
      setList(list.concat(textvalue))
      setTextValue("");
      setValueCount(0);
    } else {
      disable();
    }
  }

  const removeList = () => {
    setSelect({
      state: false,
      val: "",
      index:-1,
    });
    setList(list.splice(select.index));
  }
  
  useEffect(() => {
    console.log(list);
  }, [list])

  return (
    <div className={`inputTextArea ${textareaState}`}>
      <InputItems type="textarea">
        <input
          type="text"
          placeholder='내용을 입력해주세요.'
          onChange={textChange}
          value={textvalue}
        />
        <div className='textCount'>
          <span>{valueCount}</span>
          <span>/{max}</span>
        </div>
      </InputItems>
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
