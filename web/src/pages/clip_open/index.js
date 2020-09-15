import React, {useHistory, useContext} from 'react'
import Header from 'components/ui/new_header.js'
import {Context} from 'context'
import Layout from 'pages/common/layout'
import './clipopen.scss'

export default () => {
  const global_ctx = useContext(Context)
  return (
    <Layout status="no_gnb">
      <div id="clipOpen">
        <Header title="클립 오픈 안내" />
        <div className="content">
          <button
            className="clipButton"
            onClick={() => {
              global_ctx.action.updatePopup('CLIP_OPEN')
            }}>
            클립 등록 유의사항
          </button>

          <button
            className="eventButton"
            onClick={() => {
              global_ctx.action.updatePopup('CLIP_EVENT')
            }}>
            이벤트 유의사항
          </button>

          <img src="https://image.dalbitlive.com//event/clip/20200914/img01.jpg" title="클립 오픈 안내" />
          <img src="https://image.dalbitlive.com//event/clip/20200914/img02.jpg" title="클립 오픈 안내" />
          <img src="https://image.dalbitlive.com//event/clip/20200914/img03.jpg" title="클립 오픈 안내" />
          <img src="https://image.dalbitlive.com//event/clip/20200914/img04.jpg" title="클립 오픈 안내" />
        </div>
      </div>
    </Layout>
  )
}
