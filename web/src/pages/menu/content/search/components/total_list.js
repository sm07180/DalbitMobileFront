import React, {useEffect, useState, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
//context
import API from 'context/api'
import {Context} from 'context/index.js'
import Room, {RoomJoin} from 'context/room'
import qs from 'query-string'
import Utility, {printNumber, addComma} from 'components/lib/utility'
//static

export default (props) => {
  const {memberList, clipList, liveList, total} = props
  console.log(total)
  // ctx && path
  const context = useContext(Context)
  const history = useHistory()

  //render ----------------------------------------------------
  return (
    <div className="total">
      <div className="total__member">
        {memberList.map((item, idx) => {
          const {nickNm} = item
          return <div key={`${idx}+categoryTab`}>{nickNm}</div>
        })}
      </div>
      <div className="total__live">
        {liveList.map((item, idx) => {
          const {nickNm} = item
          return <div key={`${idx}+categoryTab`}>{nickNm}</div>
        })}
      </div>
      <div className="total__clip">
        {clipList.map((item, idx) => {
          const {nickNm} = item
          return <div key={`${idx}+categoryTab`}>{nickNm}</div>
        })}
      </div>
    </div>
  )
}
