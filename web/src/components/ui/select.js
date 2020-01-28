import React, {useState} from 'react'

export default props => {
  const [SelectInfo, setselectInfo] = useState(props.Info)
  return (
    <>
      <select name="">
        <option value="">{SelectInfo.option1}</option>
        <option value="">{SelectInfo.option2}</option>
        <option value="">{SelectInfo.option3}</option>
      </select>
    </>
  )
}
