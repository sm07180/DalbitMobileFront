import React, {useState, useReducer, useEffect, useCallback} from 'react'

function roundReducer(state, action) {
  switch (action.type) {
    case 'NEXT':
      return state + 1
    case 'PREV':
      return state - 1
    default:
      return state
  }
}

export default function RoundHandler({nowRoundNo}) {
  const [roundCount, dispatch] = useReducer(roundReducer, nowRoundNo)
  const [realTime, setRealTime] = useState('실시간')

  const roundFunction = (type) => {
    if (type === 'nextState') {
      if (roundCount < nowRoundNo) {
        dispatch({type: 'NEXT'})
      } else {
        return false
      }
    } else if (type === 'prevState') {
      if (roundCount > 10) {
        dispatch({type: 'PREV'})
      } else {
        return false
      }
    }
  }

  const realTimeState = useCallback(() => {
    if (roundCount !== nowRoundNo) {
      setRealTime('')
    } else {
      setRealTime('실시간')
    }
  }, [roundCount])

  //------------------
  useEffect(() => {
    realTimeState()
  }, [roundCount])

  return (
    <div className="realTime_box">
      {/* <button
        className={`prev_btn ${roundCount > 10 ? 'active' : ''}`}
        disabled={roundCount > 10 ? false : true}
        onClick={() => {
          roundFunction('prevState')
        }}>
        이전
      </button> */}
      <span>
        {roundCount}기 {realTime}
      </span>
      {/* <button
        className={`next_btn ${roundCount < nowRoundNo ? 'active' : ''}`}
        disabled={roundCount < nowRoundNo ? false : true}
        onClick={() => roundFunction('nextState')}>
        다음
      </button> */}
    </div>
  )
}
