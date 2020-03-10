/**
 * @title 이벤트(탭)
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import API from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//import Total from './total'
import Pagination from './pagination'
import Pagination2 from './pagination2'

export default props => {
  let {setValue} = props
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //---------------------------------------------------------------------
  //tab:탭클릭 index정의 state
  const {currentItem, changeItem} = useTabs(0, tabConent)
  const [list, setPosts] = useState([])
  const [resultList, setPostsResult] = useState([])
  //---------------------------------------------------------------------
  //api
  async function fetchData(obj) {
    const res = await API.broad_list({
      url: '/broad/list',
      method: 'get'
    })
    if (res.result === 'success') {
      setPosts(res.data.list)
    }
  }

  useEffect(() => {
    fetchData({
      data: {
        roomType: '',
        page: 1,
        records: 10
      }
    })
  }, [])
  //당첨자

  return (
    <>
      {/* 탭버튼 */}
      <Tab>
        {tabConent.map((section, index) => (
          <button onClick={() => changeItem(index)} key={index} className={currentItem.id === index ? 'on' : ''}>
            {section.tab}
          </button>
        ))}
      </Tab>
      {/* 탭컨텐츠영역 */}
      {currentItem.tab === '진행 중 이벤트' && (
        <Pagination>
          <div className="titleBox">
            <h2>전체</h2>
            <h3>{list.length}</h3>
          </div>
        </Pagination>
      )}
      {currentItem.tab === '종료 된 이벤트' && (
        <Pagination>
          <div className="titleBox">
            <h2>전체</h2>
            <h3>{list.length}</h3>
          </div>
        </Pagination>
      )}
      {currentItem.tab === '당첨자 발표' && (
        <Pagination2>
          <div className="titleBox">
            <h2>전체</h2>
            <h3>{list.length}</h3>
          </div>
        </Pagination2>
      )}
    </>
  )
}
//------------------------------------------------------------------
//tab function
const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }
  const [currentIndex, SetCurrentIndex] = useState(initialTab)
  return {
    currentItem: allTabs[currentIndex],
    changeItem: SetCurrentIndex
  }
}
//------------------------------------------------------------------
//styled
const Tab = styled.div`
  margin-top: 50px;
  & button {
    width: 33.33%;
    height: 48px;
    display: inline-block;
    border: 1px solid #e0e0e0;
    border-bottom: 1px solid ${COLOR_MAIN};
    color: ${COLOR_MAIN};
    margin-left: -1px;
    &:first-child {
      margin-left: 0;
    }
    &.on {
      border: 1px solid ${COLOR_MAIN};
      background-color: ${COLOR_MAIN};
      color: white;
    }
  }
  & button:focus {
    outline: none;
  }
`
//------------------------------------------------------------------
//탭 셀렉트 배열
const tabConent = [
  {
    id: 0,
    tab: '진행 중 이벤트'
  },
  {
    id: 1,
    tab: '종료 된 이벤트'
  },
  {
    id: 2,
    tab: '당첨자 발표'
  }
]
