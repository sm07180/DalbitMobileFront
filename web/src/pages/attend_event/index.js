import { Context } from 'context'
import Api from 'context/api'
import React, { useContext, useEffect, useState } from 'react'

// component
import Layout from 'pages/common/layout'
import './attend_event.scss'
import { Link, useHistory } from 'react-router-dom'

// static
import btnClose from './static/ico_close.svg'

export default props => {
  const history = useHistory()
  const globalCtx = useContext(Context)
  const { token } = globalCtx

  return (
    <Layout {...props} status="no_gnb">
      <div id="attend-event">
        <div className="event-main">
          <p>출석이벤트 메인</p>

          <Link to="/">
            <button className="btn-back">
              <img src={btnClose} />
            </button>
          </Link>

          <button>출석 체크하고 선물 받기</button>
        </div>

        <div className="event-content">
          <p>출석이벤트 컨텐츠</p>
        </div>

        <div className="event-notice">
          <p>출석이벤트 유의사항</p>
        </div>
      </div>
    </Layout>
  )
}
