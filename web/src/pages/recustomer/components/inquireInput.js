import React, {useState, useEffect, useContext} from 'react'

const InquireInput = (props) => { 
  const {title, type, required, placeholder} = props;
  const [focus, setFocus] = useState(false)
  const [option, setOption] = useState(false)
  const [optionValue, setOptionValue] = useState("")
  const [textareaDefaultValue, setTextareaDefaultValue] = useState("")

  // type="text" 일때 사용
  const focusOn = () => {
    setFocus(true)
  }
  const focusOff = () => {
    setFocus(false)    
  }
  // type="select" 일때 사용
  const optionContral = () => {
    setOption(!option)    
  }
  const valueSelect = (e) => {
    setOptionValue(e.currentTarget.innerText)
    setOption(false)    
  }
  // type="textArea" 일때 사용
  const textareaFocusIn = () => {
  setTextareaDefaultValue(placeholder);
  }
  const textareaFocusOut = (e) => {
    const textAreaValue = e.target.value;
    if(textAreaValue === textareaDefaultValue) {
      setTextareaDefaultValue("");
    }
  }

  return (
    <>
      <div className='inquireSection'>
        <div className={`inquireTitle ${required ? "required" : ""}`}>{title}</div>
        <div className={`inquireInput ${focus ? "focus" : ""}`}>
          { type === "text" &&
            <input type="text"
              placeholder={placeholder}
              onFocus={focusOn}
              onBlur={focusOff}
            />
          }
          { type === "select" &&
            <div className="inquireSelect">
              <button className={`label ${optionValue !== "" ? "active" : ""}`} onClick={optionContral}>{optionValue !== "" ? optionValue : placeholder}</button>
              {option &&
                <ul className="optionList">
                  <li className="optionItem" onClick={valueSelect}>회원정보</li>
                  <li className="optionItem" onClick={valueSelect}>방송</li>
                  <li className="optionItem" onClick={valueSelect}>청취</li>
                  <li className="optionItem" onClick={valueSelect}>결제</li>
                  <li className="optionItem" onClick={valueSelect}>건의</li>
                  <li className="optionItem" onClick={valueSelect}>장애/버그</li>
                  <li className="optionItem" onClick={valueSelect}>선물/아이템</li>
                  <li className="optionItem" onClick={valueSelect}>기타</li>
                </ul>
              }
            </div>
          }
          { type === "textArea" &&
            <textarea
             placeholder={placeholder}
             maxLength="2000"
             onFocus={textareaFocusIn}
             onBlur={textareaFocusOut}
             defaultValue={textareaDefaultValue}
            />
          }  
        </div>
      </div>
    </>
  )
}

export default InquireInput
