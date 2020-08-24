/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect, useState, useRef, useMemo} from 'react'

import styled from 'styled-components'

//context
import Api from 'context/api'
import {Context} from 'context'

// components
import LiveList from '../../../pages/main/component/livelist'
import NoResult from '../../../pages/main/component/NoResult.js'

const records = 10

export default (props) => {
  //context
  const globalCtx = useContext(Context)
  // state
  const [liveList, setLiveList] = useState(null)
  const [liveCategoryFixed, setLiveCategoryFixed] = useState(false)
  const [selectedLiveRoomType, setSelectedLiveRoomType] = useState('')
  const [liveAlign, setLiveAlign] = useState(1)
  const [liveGender, setLiveGender] = useState('')
  const [livePage, setLivePage] = useState(1)
  const [totalLivePage, setTotalLivePage] = useState(null)

  const fetchLiveList = async (reset) => {
    setLiveList(null)
    const broadcastList = await Api.broad_list({
      params: {
        page: reset ? 1 : livePage,
        records: records,
        roomType: selectedLiveRoomType,
        searchType: liveAlign,
        gender: liveGender
      }
    })
    if (broadcastList.result === 'success') {
      const {list, paging} = broadcastList.data
      if (paging) {
        const {totalPage, next} = paging
        setLivePage(next)
        setTotalLivePage(totalPage)
      }
      setLiveList(list)
    }
  }
  const resetFetchList = () => {
    setLivePage(1)
    fetchLiveList(true)
  }
  useEffect(() => {
    resetFetchList()
  }, [selectedLiveRoomType])

  return (
    <>
      <Content>
        <div className="content-wrap live-list">
          {Array.isArray(liveList) ? (
            liveList.length > 0 ? (
              <LiveList list={liveList} liveListType="detail" type="search" />
            ) : (
              <NoResult />
            )
          ) : (
            <div style={{height: '315px'}}></div>
          )}
        </div>
      </Content>
    </>
  )
}

const Content = styled.div`
  .live-list-category {
    position: relative;
    display: flex;
    height: 36px;
    flex-direction: row;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    .inner-wrapper {
      width: calc(100% - 16px);
      margin-left: 16px;
    }
  }

  .title-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 16px;

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;

      .txt {
        color: #424242;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: -0.36px;

        &.in-active {
          color: #bdbdbd;
        }

        &:nth-child(2) {
          margin-left: 10px;
        }
      }
    }
  }

  .content-wrap {
    position: relative;
    min-height: 50px;
    padding: 0 16px;

    &.live-list {
      width: 100%;
      padding: 16px 16px;
    }
  }
`
