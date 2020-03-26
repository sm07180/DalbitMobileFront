import React, {useState, useRef, Children} from 'react'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
function Accordian(props) {
  const [setActive, setActiveState] = useState('')
  const [setHeight, setHeightState] = useState('0px')
  const [setRotate, setRotateState] = useState('accordion-icon')

  const content = useRef(null)

  function toggleAccordion() {
    setActiveState(setActive === '' ? 'active' : '')
    setHeightState(setActive === 'active' ? '0px' : `${content.current.scrollHeight}px`)
    setRotateState(setActive === 'active' ? 'accordion-icon' : 'accordion-icon rotate')
  }

  return (
    <Wrap>
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
        <p className="accordion-title">{props.title}</p>
        <span className={`${setRotate}`}></span>
      </button>
      <div ref={content} style={{maxHeight: `${setHeight}`}} className="accordion-content">
        {props.children}
        <div className="accordion-text" />
      </div>
    </Wrap>
  )
}
export default Accordian

const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  & span {
    width: 36px;
    height: 36px;
    display: block;
  }
  & .accordion {
    color: #444;
    cursor: pointer;
    padding: 18px 10px;
    display: flex;
    align-items: center;
    border-bottom: solid 1px #f5f5f5;
    outline: none;
    transition: background-color 0.6s ease;
  }

  & .accordion-title {
    font-size: 20px;
    color: #7c4dec;
    letter-spacing: -0.5px;
  }

  & .accordion-content {
    background-color: white;
    overflow: auto;
    transition: max-height 0.6s ease;
    overflow-y: hidden;
  }

  & .accordion-text {
    padding: 18px;
  }
  .accordion-icon {
    margin-left: auto;
    transition: transform 0.6s ease;
    background: url(${IMG_SERVER}/images/api/ic_arrow_down.png) no-repeat center center/cover;
  }
  .rotate {
    transform: rotate(-180deg);
  }
`
