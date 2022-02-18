import React, {useState} from 'react'

// global components
// components
// contents
// css
import './checkList.scss'

const CheckList = (props) => {
  const {text,name,children, index, code, beforeCode, setBeforeCode} = props
  const [btnActive,setBtnActive] = useState(false)
  
  const onCheckSelect = () => {
    setBtnActive(!btnActive)
  }

  const getChecked = (selectedCode, code) => {
    let checkFlag = false;
    let splitCode = selectedCode.split("|");
    for (let i = 0; i < splitCode.length; i++){
      if (splitCode[i] === code){
        checkFlag = true;
      }
    }
    return checkFlag;
  }

  const cutChecked = (selectedCode, code) => {
    let splitCode = selectedCode.split("|");
    for (let i = 0; i < splitCode.length; i++){
      if (splitCode[i] === code){
        splitCode.splice(i, 1);
      }
    }
    return splitCode.join("|") === "" ? '0' : splitCode.join("|");
  }

  return (
    <>
      <div className="infoCheckList">
        <label className="inputLabel">
          <input type="checkbox" className="blind" checked={beforeCode && getChecked(beforeCode, code)} onChange={(e) => {
            let curCode = beforeCode;
            if (curCode === "0"){
              setBeforeCode(`${code}`);
            } else {
              getChecked(beforeCode, code) ? setBeforeCode(cutChecked(beforeCode, code)) : setBeforeCode(`${curCode}|${code}`);
            }
          }}/>
          <span className="checkIcon"></span>
          <p className="checkInfo">{text}</p>
          {children}
        </label>
      </div>
    </>
  )
}

CheckList.defaultProps = {
  onClick:()=>{}
}
export default CheckList
