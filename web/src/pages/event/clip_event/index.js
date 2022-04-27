import React from 'react'

// context

export default () => {

  return (
    <>
      <div id="clipEvent">
        <h2>클립 이벤트 example</h2>
        <button
          onClick={() => {
            window.location.href = '/'
          }}>
          닫기
        </button>
      </div>
    </>
  )
}
