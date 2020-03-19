/**
 * @title 라이브탭 인기순 셀렉트박스 컴포넌트
 */
import React, {useState, useContext} from 'react'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import styled from 'styled-components'
import {BroadCastStore} from 'pages/broadcast/store'
import Api from 'context/api'

export default props => {
  //0.인기순..배열 호출 state-------------------------------------------
  //1.셀렉트박스 visibility 체크----------------------------------------
  //2.셀렉트박스 text 변경 초기 state-----------------------------------
  const [PopularInfo, setPopularInfo] = useState(props.Info)
  const [SelectCheck, setSelectCheck] = useState(false)
  const [SelectChange, setSelectChange] = useState('전체')
  const [list, setList] = useState([])
  const store = useContext(BroadCastStore)
  //------------------------------------------------------------------
  //function
  //셀렉트 버튼 토글 function
  const ToggleSelect = idx => {
    if (SelectCheck === false) {
      setSelectCheck(true)
    } else {
      setSelectCheck(false)
    }
  }
  //백그라운드 클릭 셀렉트해제 function
  const AllFalse = () => {
    setSelectCheck(false)
  }
  const popularSelect = PopularInfo.map((item, index) => {
    return (
      <p
        key={index}
        onClick={() => {
          setSelectChange(item.option)
          setSelectCheck(false)
          getBroadList({params: {roomType: store.category, page: 1, records: 100, searchType: index}})
        }}>
        {item.option}
      </p>
    )
  })

  async function getBroadList(obj) {
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    } else {
      store.action.updateLiveSortList(res.data)
    }
  }
  //------------------------------------------------------------------
  return (
    <>
      <Select onClick={ToggleSelect}>
        <h2>{SelectChange}</h2>
      </Select>
      <Option value={SelectCheck} className={SelectCheck ? 'on' : ''}>
        <div className="optionWrap">{popularSelect}</div>
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
  position: relative;
  background: url(${IMG_SERVER}/images/api/ic_arrow_down_color.png) no-repeat center right;
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
  left: calc(33.33% + 6px);
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
