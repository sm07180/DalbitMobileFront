import React, {useState, useEffect} from 'react'

import './checkBox.scss'

const CheckBox = (props) => {
  const {name, check, text, returnCheck, necessary} = props

  const [checked, setChecked] = useState(check);

  const toggleCheck = (e) => {
    console.log(e.checked);
    if(e.checked) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }

  useEffect(() => {
    returnCheck(checked); // checked 값을 반환해서 부모component에서 조작 가능하게 하기 위함
  }, [checked])

  return (
    <label className="checkLabel">
      <input type="checkbox" name={name} onChange={(e) => {toggleCheck(e.currentTarget)}} className={checked ? 'on' : 'off'}
       checked={checked} />
      <span className="checkText">{text}</span>
      {
        necessary &&
        <span className='necessary'/>
      }
    </label>
  )
}

CheckBox.defaultProps = {
  type: 'text',
  check: false,
}

export default CheckBox
