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
  const selectListClassName = opened !== null ? (opened ? 'open' : 'close') : 'init'

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
              onTouchStart={() => selectBoxList(instance.value, index)}>
              {instance.text}
            </div>
          )
        })}
      </SelectListWrap>
    </SelectBoxWrap>
  )
}

const SelectListWrap = styled.div`
  border: 1px solid #632beb;
  border-top: 1px solid #fff;
  margin-top: -1px;
  /* animation-duration: 0.1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in; */

  &.open {
    position: absolute;
    width: 100%;
    z-index: 10;
    top: 36px;
    opacity: 1;
    transform: translateY(0);
  }

  &.close {
    opacity: 0;
    height: 0;
    transform: translateY(-10px);
    transform: scale(0);
    position: absolute;
    top: 36px;
    z-index: 10;
  }

  &.init {
    display: none;
  }

  .box-list {
    height: 36px;
    line-height: 36px;
    padding: 0px 10px;

    color: #424242;
    font-size: 16px;
    background-color: #fff;
    box-sizing: border-box;
    transform: skew(-0.03deg);
    letter-spacing: -0.5px;
    z-index: 10;
    border-top: none;
    &:hover {
      color: #632beb;
      background-color: #f8f8f8;
    }
  }
`

const Selected = styled.div`
  position: relative;

  min-width: 80px;

  box-sizing: border-box;
  border: 1px solid #632beb;
  font-size: 16px;
  color: #632beb;
  outline: none;
  letter-spacing: -0.5px;
  line-height: 36px;
  height: 36px;
  padding-left: 10px;
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
    width: 12px;
    height: 2px;
    top: 16px;
    right: 20px;
    background-color: #632beb;
    transform: rotate(45deg);
    transition-property: transform;
    /* transition-duration: 0.1s;
    transition-timing-function: ease-in; */
  }

  &::after {
    position: absolute;
    content: '';
    width: 12px;
    height: 2px;
    top: 16px;
    right: 12px;
    background-color: #632beb;
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
//     background-color: #632beb;
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
//     background-color: #632beb;
//     transform: rotate(-45deg);
//     transition-property: transform;
//     /* transition-duration: 0.1s;
//     transition-timing-function: ease-in; */
//   }
