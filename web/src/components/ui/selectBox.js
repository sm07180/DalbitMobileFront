import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

export default props => {
  const {boxList, onChangeEvent, inlineStyling} = props
  const [selectedIdx, setSelectedIdx] = useState(0)

  const selectBoxList = value => {
    onChangeEvent(value)
  }

  if (boxList === undefined) {
    throw new Error("Need a box list in select box -> exam: ([{value: '', text: ''}....])")
  } else if (onChangeEvent === undefined) {
    throw new Error('Need a on change event function')
  }

  return (
    <SelectBoxWrap style={inlineStyling ? inlineStyling : {}}>
      <Selected>{boxList[selectedIdx].text}</Selected>
      <SelectListWrap>
        {boxList.map((instance, index) => {
          return (
            <div className="box-list" key={index} onClick={() => selectBoxList(instance.value)}>
              {instance.text}
            </div>
          )
        })}
      </SelectListWrap>
    </SelectBoxWrap>
  )
}

const SelectListWrap = styled.div`
  border: 1px solid #8556f6;
  border-top: none;

  .box-list {
    padding: 11px 10px;
    color: #757575;
    font-size: 16px;
    background-color: #fff;
    box-sizing: border-box;

    &:hover {
      color: #8556f6;
      background-color: #f8f8f8;
    }
  }
`

const Selected = styled.div`
  width: 136px;
  padding: 11px 10px;
  box-sizing: border-box;
  border: 1px solid #8556f6;
  font-size: 16px;
  color: #8556f6;
`

const SelectBoxWrap = styled.div`
  position: absolute;
  cursor: pointer;
`
