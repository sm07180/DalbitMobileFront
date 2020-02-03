import React, {useState} from 'react'
import {WIDTH_MOBILE} from 'context/config'
import styled from 'styled-components'

export default props => {
  const [SelectInfo, setselectInfo] = useState(props.Info)
  const arraySelect = SelectInfo.map((item, index) => {
    const {id, selectUrl, option1, option2, option3} = item
    return (
      <Select name="" bg={selectUrl} key={index}>
        <Option value="">{option1}</Option>
        <Option value="">{option2}</Option>
        <Option value="">{option3}</Option>
      </Select>
    )
  })
  return <>{arraySelect}</>
}

const Select = styled.select`
  width: 136px;
  height: 40px;
  border: solid 1px #8556f6;
  background: url(${props => props.bg}) no-repeat center right;
  appearance: none;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: #8556f6;
  padding: 10px 0px 10px 15px;
  box-sizing: border-box;
  margin-left: 5px;
  transform: skew(-0.03deg);
  @media (max-width: ${WIDTH_MOBILE}) {
    width: calc(50% - 4px);
    margin: 18px 8px 0px 0px;
  }
  &:nth-of-type(2) {
    @media (max-width: ${WIDTH_MOBILE}) {
      margin: 18px 0px 0px 0px;
    }
  }
`
const Option = styled.option`
  font-size: 16px;
  letter-spacing: -0.4px;
  color: #8556f6;
`
