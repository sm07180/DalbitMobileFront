/**
 * @title 최근 본 달디
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//context
import API from 'context/api'
import Room, {RoomJoin} from 'context/room'
// component
import NoResult from 'components/ui/noResult'
import PlayIcon from '../static/ic_play.svg'
//
export default (props) => {
  //---------------------------------------------------------------------
  //useState
  //---------------------------------------------------------------------

  //update
  function update(mode) {
    switch (true) {
      case mode.search !== undefined: //-------------------------------검색어
        const {query} = mode.search
        fetchData(query)
        break
      default:
        break
    }
  }

  //makeContents
  const makeContents = () => {
    if (props.fetch === null || props.fetch === undefined) return
    const list = props.fetch
    //console.log(list)

    if (list == false || list == undefined) {
      return <NoResult className={`search`} />
    } else {
      return list.map((list, idx) => {
        const {nickNm, profImg, roomNo, memNo} = list
        return (
          <div
            key={idx}
            className="list"
            // onClick={() => {
            //   JoinBroadProfile(roomNo, memNo)
            // }}
          >
            <button
              onClick={() => {
                props.update({select: {...list, type: props.type}})
              }}>
              <img src={profImg.thumb150x150} />
            </button>
            {roomNo !== '0' && <em></em>}
            <p>{nickNm}</p>
          </div>
        )
      })
    }
  }
  //---------------------------------------------------------------------
  return <Content>{makeContents()}</Content>
}
//---------------------------------------------------------------------
const Content = styled.div`
  min-height: 196px;
  text-align: left;
  .search {
    margin-top: -10px;
  }
  & + h1 {
    margin-top: 15px;
  }
  .list + .list {
    margin-left: 3.6%;
  }
  .list:nth-child(4n + 1) {
    margin-left: 0;
  }
  .list {
    position: relative;
    display: inline-block;
    width: calc(25% - 2.7%);
    /* margin: 0 13px 20px 13px; */
    margin-bottom: 20px;
    box-sizing: border-box;
    em {
      display: block;
      width: 16px;
      height: 16px;
      position: absolute;
      right: 0;
      bottom: 16px;
      background: url(${PlayIcon}) no-repeat center center / cover;
    }
    button {
      display: inline-block;
      width: 96%;
      height: auto;
      border-radius: 26px;
      overflow: hidden;
      img {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    p {
      display: block;
      margin-top: 6px;
      width: 72px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 11px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.45;
      letter-spacing: -0.28px;
      text-align: center;
      color: #424242;
    }
  }
`
