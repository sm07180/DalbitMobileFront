import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'

// Component
import Header from 'components/ui/new_header.js'
import Tree from './content/Tree'
import Lover from './content/Lover'

import './style.scss'
import {Context} from "context";

const TreePage = () => {
  const context = useContext(Context);
  const history = useHistory()
  const tabMenuRef = useRef()
  const tabBtnRef = useRef()
  const [tabContent, setTabContent] = useState('tree') // tree , lover
  const [tabFixed, setTabFixed] = useState(false)
  const [loverSeqNo, setLoverSeqNo] = useState(1);


  const tabScrollEvent = () => {
    const tabMenuNode = tabMenuRef.current
    const tabBtnNode = tabBtnRef.current
    if (tabMenuNode && tabBtnNode) {
      const tabMenuTop = tabMenuNode.offsetTop - tabBtnRef.current.clientHeight

      if (window.scrollY >= tabMenuTop) {
        setTabFixed(true)
      } else {
        setTabFixed(false)
      }
    }
  };

  // 탭 클릭 이벤트
  const tabClick = (e) => {
    const { tab } = e.currentTarget.dataset;

    if (tab === 'lover') {
      const current = moment();

      if (current.isBefore('2022-01-07') && current.isAfter('2021-12-30')) {
        setLoverSeqNo(2);
      }
    }
    setTabContent(tab);
  };

  useEffect(() => {
    if (!context.token.isLogin) {
      history.push('/login');
    }

    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  }, [])

  return (
    <div id="tree">
      <Header title="이벤트" />
      <section>
        <img src={`${IMG_SERVER}/event/tree/treeBg-1.png`} className="bgImg" />
      </section>
      <section className="tabContainer" ref={tabMenuRef}>
        <div className={`tabWrapper ${tabFixed === true ? 'fixed' : ''}`} ref={tabBtnRef}>
          <div className="tabmenu">
            <button className={tabContent === 'tree' ? 'active' : ''} onClick={() => setTabContent('tree')}>
              <img
                src={`${IMG_SERVER}/event/tree/tabmenu-1-${tabContent === 'tree' ? 'on' : 'off'}.png`}
                alt="좋아요 트리만들기!"
              />
            </button>
            <button className={tabContent === 'lover' ? 'active' : ''} onClick={() => setTabContent('lover')}>
              <img
                src={`${IMG_SERVER}/event/tree/tabmenu-2-${tabContent === 'lover' ? 'on' : 'off'}.png`}
                alt="사랑꾼 선발대회"
              />
            </button>
          </div>
        </div>
        <div className="signRing">
          <img src="https://image.dalbitlive.com/event/tree/signRing.png" />
          <img src="https://image.dalbitlive.com/event/tree/signRing.png" />
        </div>
      </section>
      {tabContent === 'tree' ? <Tree /> : <Lover seqNo={loverSeqNo}/>}
    </div>
  )
}

export default TreePage
