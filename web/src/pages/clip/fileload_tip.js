import React, {useState, useContext, useEffect} from 'react'

import {Hybrid} from 'context/hybrid'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

import './clip.scss'

export default function fileloadTip(props) {
  const [tabState, setTabState] = useState(1)

  const tipBack = () => {
    Hybrid('clipTipBack')
  }

  return (
    <>
      <Layout {...props} status="no_gnb" goback={tipBack}>
        <Header title="파일 가져오는 방법" />
        <div id="clipPage">
          <div className="fileTopBox">
            <div className="tipTabBox">
              <button
                className={`tipTabBox__btn ${tabState === 1 ? 'tipTabBox__btn--active' : ''}`}
                onClick={() => setTabState(1)}>
                iTunes
              </button>
              <button
                className={`tipTabBox__btn ${tabState === 2 ? 'tipTabBox__btn--active' : ''}`}
                onClick={() => setTabState(2)}>
                음성메모
              </button>
            </div>

            <div className="tipContentBox">
              {tabState === 1 ? (
                <img src="https://image.dalbitlive.com/app/clip_tip_itunes.png" alt="itunes" />
              ) : (
                <img src="https://image.dalbitlive.com/app/clip_tip_memo.png" alt="memo" />
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
