import React, {useEffect, useState, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'

// Component
import EventComment from '../../components/comment'

export default (props) => {
  const [noticeTab, setNoticeTab] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  const history = useHistory()

  const tabActive = () => {
    if (noticeTab === 'active') {
      setNoticeTab('')
    } else {
      setNoticeTab('active')
    }
  }

  return (
    <>
      <section className="term">
        <img src={`${IMG_SERVER}/event/tree/treeBg-2.png`} className="bgImg" />
        <button>
          <img src={`${IMG_SERVER}/event/tree/treeBtn-1.png`} />
        </button>
      </section>
      <section className="treeContents">
        <img src={`${IMG_SERVER}/event/tree/treeContents.png`} className="bgImg" />
        <div className="treeEventBox">
          <div className="countBox">
            {Utility.addComma(123123)}
            <span>/150,000</span>
          </div>
          <div className="gaugeBox">
            <div className="gaugeBar" style={{width: '50%'}}>
              <div className="gaugePointer">
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/tree/treeBg-3.png`} className="bgImg" />
      </section>
      <section className="commentContainer">
        <EventComment />
      </section>
    </>
  )
}
