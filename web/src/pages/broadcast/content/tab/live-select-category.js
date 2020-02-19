import React, {useState} from 'react'
import styled from 'styled-components'

export default props => {
  //------------------------------------------------------------------
  //0.케테고리맵..배열 호출 state---------------------------------------
  //1.셀렉트박스 visibility 체크----------------------------------------
  //2.셀렉트박스 text 변경 초기 state-----------------------------------
  const [categoryInfo, setPopularInfo] = useState(props.Info)
  const [SelectCheck, setSelectCheck] = useState(false)
  const [SelectChange, setSelectChange] = useState(categoryInfo[0].option)
  //------------------------------------------------------------------
  //function
  //셀렉트 버튼 토글 function
  const ToggleSelect = () => {
    if (SelectCheck === false) {
      setSelectCheck(true)
    } else {
      setSelectCheck(false)
    }
  }
  const AllFalse = () => {
    setSelectCheck(false)
  }
  //------------------------------------------------------------------
  //category map
  const categorySelect = categoryInfo.map((item, index) => {
    const {option} = item
    return (
      <p
        key={index}
        onClick={() => {
          setSelectChange(option)
          setSelectCheck(false)
        }}>
        {option}
      </p>
    )
  })
  //------------------------------------------------------------------
  return (
    <>
      <Select onClick={ToggleSelect}>
        <h2>{SelectChange}</h2>
      </Select>
      <Option value={SelectCheck} className={SelectCheck ? 'on' : ''}>
        <div className="optionWrap">{categorySelect}</div>
      </Option>
      <BackGround onClick={AllFalse} className={SelectCheck ? 'on' : ''} />
    </>
  )
}
//------------------------------------------------------------------
//styled
const Select = styled.div`
  display: inline-block;
  line-height: 40px;
  width: 33.33%;
  margin-right: 18px;
  position: relative;
  background: url('https://devimage.dalbitcast.com/images/api/ic_arrow_down_color.png') no-repeat center right;
  cursor: pointer;
  & h2 {
    padding-right: 24px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: #424242;
    box-sizing: border-box;
    transform: skew(-0.03deg);
    text-align: right;
  }
`
const Option = styled.div`
  position: absolute;
  top: 40px;
  left: calc(66.66% + 6px);
  display: none;
  .optionWrap {
    width: 105px;
    padding: 12px 0;
    border: solid 1px #e0e0e0;
    background-color: #fff;
    text-align: center;
    z-index: 3;
  }
  & p {
    padding: 7px 0 7px 0px;
    box-sizing: border-box;
    color: #757575;
    font-size: 14px;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    cursor: pointer;
    &:hover {
      background-color: #f8f8f8;
    }
  }
  &.on {
    display: block;
    z-index: 3;
  }
`
//클릭 배경 가상요소
const BackGround = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  &.on {
    display: block;
    z-index: 2;
  }
`
