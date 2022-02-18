import React, {useEffect, useState} from 'react'
import styled, {keyframes} from 'styled-components'
import {IMG_SERVER} from 'context/config'

export default props => {
  const {boxList, onChangeEvent, inlineStyling, className, type, controllState} = props
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [opened, setOpened] = useState(null)

  if (boxList === undefined) {
    throw new Error("Need a box list in select box -> exam: ([{value: '', text: ''}....])")
  } else if (onChangeEvent === undefined) {
    throw new Error('Need a on change event function')
  }

  const selectBoxList = (value, idx) => {
    onChangeEvent(value)
    setSelectedIdx(idx)

    setTimeout(() => {
      setOpened(false)
    }, 200)
  }

  const selectBlurEvent = () => {
    setOpened(false)
  }

  const selectedClassName = opened ? 'open' : ''
  const selectListClassName = opened !== null ? (opened ? 'open' : 'close') : 'init';

  useEffect(() => {
    return () => {}
  }, [])

  useEffect(() => {
    selectBoxList(boxList[0].value, 0)
  }, [controllState])

  return (
    <SelectBoxWrap style={inlineStyling ? inlineStyling : {}} className={className ? `wrapper ${className}` : 'wrapper'}>
      <Selected
        className={`options ${selectedClassName}`}
        tabIndex={0}
        onClick={() => setOpened(opened ? false : true)}
        onBlur={selectBlurEvent}>
        {boxList[selectedIdx].text}
      </Selected>
      <SelectListWrap className={selectListClassName}>
        {boxList.map((instance, index) => {
          if (type === 'remove-init-data' && index === 0) {
            return
          }
          return (
            <div
              className="box-list"
              key={index}
              onMouseDown={() => selectBoxList(instance.value, index)}
              >
              {instance.text}
            </div>
          )
        })}
      </SelectListWrap>
    </SelectBoxWrap>
  )
}

const SelectListWrap = styled.div`
  border: 1px solid #bdbdbd;
  border-top: 1px solid #fff;
  padding-top:10px;
  background:#fff;
  height:194px;
  overflow-y:auto;  
  margin-top: -4px;
  border-bottom-left-radius:4px;
  border-bottom-right-radius:4px;

  /* animation-duration: 0.1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in; */

  &.open {
    position: absolute;
    width: 100%;
    z-index: 10;
    top: 45px;
    opacity: 1;
    transform: translateY(0);
  }

  &.close {
    opacity: 0;
    height: 0;
    transform: translateY(-10px);
    transform: scale(0);
    position: absolute;
    top: 45px;
    z-index: 10;
  }

  &.init {
    display: none;
  }

  .box-list {
    padding:12px;
  box-sizing:border-box;

    color: #424242;
    font-size: 14px;
    background-color: #fff;
    box-sizing: border-box;
    transform: skew(-0.03deg);
    letter-spacing: -0.5px;
    z-index: 10;
    border-top: none;
    &:hover {
      color: #FF3C7B;
      background-color: #f8f8f8;
    }
  }
`

const Selected = styled.div`
  position: relative;

  min-width: 80px;
  box-sizing: border-box;
  border: 1px solid #bdbdbd;
  font-size: 14px;
  color: #424242;
  outline: none;
  border-radius:4px;
  letter-spacing: -0.5px;
  padding:12px;
  box-sizing:border-box;
  &.open {
    &::before {
      transform: rotate(135deg);
    }
    &::after {
      transform: rotate(-135deg);
    }
  }

  &::before {
    position: absolute;
    content: '';
    width: 10px;
    height: 2px;
    top: 20px;
    right: 16px;
    background-color: #FF3C7B;
    transform: rotate(45deg);
    transition-property: transform;
    /* transition-duration: 0.1s;
    transition-timing-function: ease-in; */
  }

  &::after {
    position: absolute;
    content: '';
    width: 10px;
    height: 2px;
    top: 20px;
    right: 10px;
    background-color: #FF3C7B;
    transform: rotate(-45deg);
    transition-property: transform;
    /* transition-duration: 0.1s;
    transition-timing-function: ease-in; */
  }
`

const SelectBoxWrap = styled.div`
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
`

// &::before {
//     position: absolute;
//     content: '';
//     width: 12px;
//     height: 2px;
//     top: 16px;
//     right: 12px;
//     background-color: #FF3C7B;
//     transform: rotate(45deg);
//     transition-property: transform;
//     /* transition-duration: 0.1s;
//     transition-timing-function: ease-in; */
//   }

//   &::after {
//     position: absolute;
//     content: '';
//     width: 12px;
//     height: 2px;
//     top: 16px;
//     right: 4px;
//     background-color: #FF3C7B;
//     transform: rotate(-45deg);
//     transition-property: transform;
//     /* transition-duration: 0.1s;
//     transition-timing-function: ease-in; */
//   }
