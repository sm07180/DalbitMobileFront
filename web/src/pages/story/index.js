import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {TAB} from './constant/tab'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header.js'
import Sent from './component/sent'
import Received from './component/received'
import Detail from './component/detail'
import './index.scss'
import {useDispatch, useSelector} from "react-redux";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {roomNo} = useParams()
  const history = useHistory()
  const [tab, setTab] = useState(TAB.sent)

  const renderContent = () => {
    if (roomNo) {
      return <Detail/>
    } else {
      if (tab === TAB.sent) {
        return <Sent />
      } else {
        return <Received />
      }
    }
  }

  useEffect(() => {
    if (!globalState.token.isLogin) {
      history.push('/login')
    }
  }, [globalState.token.isLogin])

  return (
    <Layout status={'no_gnb'}>
      <div id="storyPage">
        <Header title="사연 모아보기" />
        {!roomNo && (
          <ul className="tab">
            <li className={`subTab ${tab === TAB.sent && 'active'}`} onClick={() => setTab(TAB.sent)}>
              보낸 사연
            </li>
            <li className={`subTab ${tab === TAB.received && 'active'}`} onClick={() => setTab(TAB.received)}>
              받은 사연
            </li>
          </ul>
        )}

        {globalState.token.isLogin && renderContent()}
      </div>
    </Layout>
  )
}
