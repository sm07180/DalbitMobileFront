import React, {useEffect, useState} from 'react'
import styled, {keyframes} from 'styled-components'

export default props => {
  const {boxList, onChangeEvent, inlineStyling, className, type} = props
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
  }

  const selectBlurEvent = () => {
    setOpened(false)
  }

  const selectedClassName = opened ? 'open' : ''
  const selectListClassName = opened !== null ? (opened ? 'open' : 'close') : 'init'

  useEffect(() => {
    return () => {}
  }, [])

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

// const selectListFadeIn = keyframes`
//   0% {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   100% {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `
// const selectListFadeOut = keyframes`
//   0% {
//     opacity: 1;
//     transform: translateY(0);
//   }
//   99% {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   100% {
//     height: 0;
//     transform: scale(0);
//   }
// `

const SelectListWrap = styled.div`
  border: 1px solid #8556f6;
  border-top: none;
  /* animation-duration: 0.1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in; */

  &.open {
    opacity: 1;
    transform: translateY(0);
  }

  &.close {
    opacity: 0;
    height: 0;
    transform: translateY(-10px);
    transform: scale(0);
  }

  &.init {
    display: none;
  }

  .box-list {
    padding: 11px 10px;
    color: #757575;
    font-size: 16px;
    background-color: #fff;
    box-sizing: border-box;
    transform: skew(-0.03deg);
    &:hover {
      color: #8556f6;
      background-color: #f8f8f8;
    }
  }
`

const Selected = styled.div`
  position: relative;
  width: 136px;
  padding: 11px 10px;
  box-sizing: border-box;
  border: 1px solid #8556f6;
  font-size: 16px;
  color: #8556f6;
  outline: none;

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
    top: 20px;
    right: 20px;
    background-color: #8556f6;
    transform: rotate(45deg);
    transition-property: transform;
    transition-duration: 0.1s;
    transition-timing-function: ease-in;
  }

  &::after {
    position: absolute;
    content: '';
    width: 12px;
    height: 2px;
    top: 20px;
    right: 12px;
    background-color: #8556f6;
    transform: rotate(-45deg);
    transition-property: transform;
    transition-duration: 0.1s;
    transition-timing-function: ease-in;
  }
`

const SelectBoxWrap = styled.div`
  position: absolute;
  cursor: pointer;
  user-select: none;
`
