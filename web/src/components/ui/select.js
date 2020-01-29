import React, {useState} from 'react'
import styled from 'styled-components'

export default props => {
  const [SelectInfo, setselectInfo] = useState(props.Info)
  return (
    <>
      <Select name="" bg={SelectInfo.selectUrl}>
        <Option value="">{SelectInfo.option1}</Option>
        <Option value="">{SelectInfo.option2}</Option>
        <Option value="">{SelectInfo.option3}</Option>
      </Select>
    </>
  )
}

const Select = styled.select`
  width: 136px;
  height: 40px;
  border: solid 1px #8556f6;
  background: url(${props => props.bg}) no-repeat center right;
  appearance: none;
  font-size: 16px;
  letter-spacing: -0.4px;
  color: #8556f6;
  padding: 11px 0px 11px 15px;
  box-sizing: border-box;
`
const Option = styled.option`
  font-size: 16px;
  letter-spacing: -0.4px;
  color: #8556f6;
`
