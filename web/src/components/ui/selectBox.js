import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

export default props => {
  const {boxList, onChangeEvent, inlineStyling} = props
  const [selectedIdx, setSelectedIdx] = useState(0)

  const selectBoxList = value => {
    onChangeEvent(value)
  }

  if (boxList === undefined) {
    throw new Error('Need a box list in select box')
  }

  return (
    <SelectBoxWrap style={inlineStyling ? inlineStyling : {}}>
      <Selected></Selected>
      {boxList.map((instance, index) => {
        return (
          <div className="box-list" key={index} onClick={() => selectBoxList(instance.value)}>
            {instance.text}
          </div>
        )
      })}
    </SelectBoxWrap>
  )
}

const Selected = styled.div`
  width: 136px;
  padding: 11px;
  box-sizing: border-box;
  border: 1px solid #8556f6;
  z-index: 100;
  cursor: pointer;

  .box-list {
    color: #757575;

    &:hover {
      color: #8556f6;
      background-color: #f8f8f8;
    }
  }
`

const SelectBoxWrap = styled.div`
  position: absolute;
`
