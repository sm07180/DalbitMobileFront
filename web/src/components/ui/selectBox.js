import React, {useEffect, useState} from 'react'
import styled, {keyframes} from 'styled-components'

export default props => {
  const {boxList, onChangeEvent, inlineStyling} = props
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [opened, setOpened] = useState(false)

  if (boxList === undefined) {
    throw new Error("Need a box list in select box -> exam: ([{value: '', text: ''}....])")
  } else if (onChangeEvent === undefined) {
    throw new Error('Need a on change event function')
  }

  const selectBoxList = value => {
    onChangeEvent(value)
    setSelectedIdx(value)
    setOpened(false)
  }

  const windowClickEvent = e => {
    const target = e.currentTarget
    console.log(target)
    // setOpened(false)
  }

  useEffect(() => {
    window.addEventListener('click', windowClickEvent)
    return () => {
      window.removeEventListener('click', windowClickEvent)
    }
  }, [])

  return (
    <SelectBoxWrap style={inlineStyling ? inlineStyling : {}}>
      <Selected onClick={() => setOpened(opened ? false : true)}>{boxList[selectedIdx].text}</Selected>
      <SelectListWrap className={opened ? 'open' : 'close'}>
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

const selectListFadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`
const selectListFadeOut = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    transform: scale(0);
    height: 0;
  }
`

const SelectListWrap = styled.div`
  border: 1px solid #8556f6;
  border-top: none;
  animation-duration: 0.1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;

  &.open {
    animation-name: ${selectListFadeIn};
  }

  &.close {
    animation-name: ${selectListFadeOut};
  }

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
  user-select: none;
`
