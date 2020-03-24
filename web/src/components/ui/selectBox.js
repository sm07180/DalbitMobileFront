import React from 'react'
import styled from 'styled-components'

export default props => {
  const {boxList, onChangeEvent} = props

  const selectBoxList = value => {
    onChangeEvent(value)
  }

  if (boxList === undefined) {
    throw new Error('Need a box list in select box')
  }

  return (
    <SelectBox>
      {boxList.map((value, index) => {
        return (
          <div className="box-list" onClick={() => selectBoxList(value)}>
            {value}
          </div>
        )
      })}
    </SelectBox>
  )
}

const SelectBox = styled.div`
  position: absolute;
  width: 136px;
  padding: 11px;
  box-sizing: border-box;

  .box-list {
    color: #757575;

    &:hover {
      color: #8556f6;
      background-color: #f8f8f8;
    }
  }
`
