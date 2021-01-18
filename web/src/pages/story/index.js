import React, {useState, useContext, useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {TAB} from './constant/tab'
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header.js'
import Sent from './component/sent'
import Received from './component/received'
import Detail from './component/detail'
import {Context} from 'context'
import './index.scss'

export default () => {
  const {roomNo} = useParams()
  const history = useHistory()
  const globalCtx = useContext(Context)
  const [tab, setTab] = useState(TAB.sent)

  const renderContent = () => {
    if (roomNo) {
      return <Detail />
    } else {
      if (tab === TAB.sent) {
        return <Sent />
      } else {
        return <Received />
      }
    }
  }

  useEffect(() => {
    if (!globalCtx.token.isLogin) {
      history.push('/login')
    }
  }, [globalCtx.token.isLogin])

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

        {globalCtx.token.isLogin && renderContent()}
      </div>
    </Layout>
  )
}
