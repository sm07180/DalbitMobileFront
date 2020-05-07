/**
 * @title error페이지
 * @url https://devwww2.dalbitlive.com/ctrl/check/ip
 */
import React, {useState, useEffect} from 'react'

export default () => {
  const [redirectList, setRedirectList] = useState([])
  useEffect(() => {
    fetch('https://www.dalbitlive.com/ctrl/check/ip')
      .then((res) => res.json())
      .then((json) => {
        const {list} = json
        if (Array.isArray(list) && list.length) {
          setRedirectList(list)
        }
      })
  }, [])

  if (Array.isArray(redirectList) && redirectList.length) {
    return (
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
    )
  }else{
      return (
          <div style={{
              width: '0'
              , height : '0'
              , margin: '-1000000px'
          }}></div>
      )
  }
}
