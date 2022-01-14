import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'

// Component
import Header from 'components/ui/new_header.js'
import Tabmenu from '../components/tabmenu/Tabmenu'
import TabmenuBtn from '../components/tabmenu/TabmenuBtn'
import Tree from './content/Tree'
import Lover from './content/Lover'

import './style.scss'
import {Context} from "context";
import moment from 'moment';

const TreePage = () => {
  const context = useContext(Context);
  const history = useHistory();
  const tabMenuRef = useRef();
  const tabBtnRef = useRef();
  const eventDuration = { end1: '2021-12-30 23:59:59', end2: '2022-01-06 23:59:59'};
  const [tabContent, setTabContent] = useState({name: 'tree'}) // tree , lover
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

    window.scroll(0, 0);
    if (tab === 'lover') {
      const current = moment();

      if (current.isAfter(eventDuration.end1)) {
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
      <Tabmenu tab={tabContent.name}>
        <TabmenuBtn tabBtn1={'tree'} tabBtn2={'lover'} tab={tabContent.name} setTab={setTabContent} imgNam={'tabmenu'} event={'tree'} onOff={true} />
        <div className="signRing">
          <img src="https://image.dalbitlive.com/event/tree/signRing.png" />
          <img src="https://image.dalbitlive.com/event/tree/signRing.png" />
        </div>
      </Tabmenu>
      {tabContent === 'tree' ? <Tree /> : <Lover seqNo={loverSeqNo} eventDuration={eventDuration}/>}
    </div>
  )
}

export default TreePage
