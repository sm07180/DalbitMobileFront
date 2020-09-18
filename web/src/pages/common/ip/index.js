/**
 * @title error페이지
 * @url https://devwww2.dalbitlive.com/ctrl/check/ip
 */
import React, {useState, useEffect, useContext} from 'react'
//context
import {Context} from 'context'
import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'

export default () => {
  const customHeader = JSON.parse(Api.customHeader)
  const context = useContext(Context)
  const {isDevIp} = context
  const [redirectList, setRedirectList] = useState([])
  useEffect(() => {
    fetch('https://www.dalbitlive.com/ctrl/check/ip')
      .then((res) => res.json())
      .then((json) => {
        const {list} = json
        if (Array.isArray(list) && list.length) {
          setRedirectList(list)
          context.action.updateIsDevIp(true)
        }
      })
  }, [])

  return (
    <>
      {isDevIp && (
        <select
          style={{
            display: 'inline-block',
            position: 'fixed',
            bottom: '100px',
            right: '10px',
            backgroundColor: 'blue',
            color: 'white',
            zIndex: '500',
            padding: '5px 5px',
            marginBottom: '-50px'
          }}
          value={location.origin}
          onChange={(e) => {
            window.location.href = e.target.value
          }}>
          {redirectList.map((info, idx) => {
            return (
              <option key={`url-${idx}`} value={info.value}>
                {info.text}
              </option>
            )
          })}
        </select>
      )}
    </>
  )
}
