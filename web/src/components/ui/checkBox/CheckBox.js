import React, {useState, useEffect} from 'react'

import './checkBox.scss'

const CheckBox = (props) => {
  const {name, check, text, returnCheck, necessary} = props

  const [checked, setChecked] = useState(check);

  const toggleCheck = (e) => {
    if(e.checked) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }

  useEffect(() => {
    if(returnCheck){
      returnCheck(checked); // checked 값을 반환해서 부모component에서 조작 가능하게 하기 위함
    }
  }, [checked])

  return (
    <label className="checkLabel">
      <input type="checkbox" name={name} onChange={(e) => {toggleCheck(e.currentTarget)}} className={checked ? 'on' : 'off'}
       checked={checked} />
      <span className="checkText">{text}</span>
      {
        necessary && // necessary 필수항목 표시 여부
        <span className='necessary'/> // 만약 "[필수]" 처럼 텍스트가 들어가야 한다면 각 페이지의 SCSS에서 after or before의 content:"[필수]" 등을 이용하여 내용전달할것!
      }
    </label>
  )
}

CheckBox.defaultProps = {
  name: 'checkList',
  check: false,
}

export default CheckBox
