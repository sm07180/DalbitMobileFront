/**
 * @title error페이지
 * @url https://devwww2.dalbitlive.com/ctrl/check/ip
 */
import React, {useState, useEffect} from 'react'

export default () => {
  const [redirectList, setRedirectList] = useState([])
  useEffect(() => {
    fetch('https://devwww2.dalbitlive.com/ctrl/check/ip')
      .then(res => res.json())
      .then(json => {
        const {list} = json
        if (Array.isArray(list) && list.length) {
          setRedirectList(list)
        }
      })
  }, [])

  return (
    <select style={{position: 'fixed', bottom: '10px', right: '10px', backgroundColor: 'blue', color: 'white'}}>
      {redirectList.map((info, idx) => {
        return (
          <option
            key={`url-${idx}`}
            onClick={() => {
              window.location.href = info.value
            }}>
            {info.text}
          </option>
        )
      })}
    </select>
  )
}
