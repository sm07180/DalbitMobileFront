/**
 * @title 최근 본 달디
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//context
import API from 'context/api'
// component
import NoResult from 'components/ui/noResult'
//
export default props => {
  //---------------------------------------------------------------------
  //useState
  //---------------------------------------------------------------------

  //makeContents
  const makeContents = () => {
    if (props.fetch === null || props.fetch === undefined) return
    const {list} = props.fetch
    if (list.length === 0) {
      return <NoResult />
    } else {
      return list.map((list, idx) => {
        const {nickNm, profImg} = list
        return (
          <div key={idx} className="list">
            <button
              onClick={() => {
                props.update({select: {...list, type: props.type}})
              }}>
              <img src={profImg.thumb150x150} />
            </button>
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
  min-height: 200px;
  text-align: left;
  .list {
    display: inline-block;
    margin-left: -7px;
    padding: 10px 7px;

    button {
      display: inline-block;
      width: 72px;
      height: 72px;
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
