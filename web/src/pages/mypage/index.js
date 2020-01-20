/**

* @file /mypage/index.js
 * @brief 마이페이지
 * @props index : 활성화 할 탭 선택
 *        0 : 팬보드
 *        1 : 내지갑
 *        2 : 리포트
 *        3 : 팬/스타
 *        4 : 설정
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'

//layout
import Layout from 'Pages/common/layout'
import {DEVICE_PC, DEVICE_MOBILE} from 'Context/config'

//context
import Api from 'Context/api'
import {Context} from 'Context'

//material-ui
import PropTypes from 'prop-types'
import {StylesProvider} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

//components
import MyProfile from './content/my-profile'
import FanBoard from './content/fan-board'
import MyWallet from './content/my-wallet'
import Report from './content/report'
import FanStar from './content/fan-star'
import Setting from './content/setting'

function TabContentWrap(props) {
  const {children, value, index, ...other} = props

  return (
    <TabContent component="div" role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </TabContent>
  )
}

TabContentWrap.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

//
const Mypage = props => {
  //Context
  const context = new useContext(Context)
  //useState
  const [isLogin, setIsLogin] = useState(context.login_state)
  console.log('로그인상태', isLogin)

  const [fetch, setFetch] = useState(null)

  async function fetchData(obj) {
    const res = await Api.member_login({
      data: {
        phoneNo: '010-1234-7412',
        password: '1234'
      }
    })
    setFetch(res)
    console.log(res)
  }

  useEffect(() => {
    fetchData()
  }, [])

  //---------------------------------------------------------------------
  // props.index 값 받았을 시 해당되는 탭을 on 시켜줌, 값 없을 시 기본 0
  const [value, setValue] = React.useState(props.index ? props.index : 0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  //---------------------------------------------------------------------
  return (
    <Layout>
      <ContentHeader>
        {!isLogin && (
          <h1>
            <a href="/">회원가입</a>
          </h1>
        )}
        {isLogin && (
          <h1>
            <a href="/">마이페이지</a>
          </h1>
        )}
        <MypageButton>방송국 관리</MypageButton>
      </ContentHeader>
      <Content>
        <MyProfile />

        <StylesProvider injectFirst>
          <TabsBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="mypage tabs area">
              <Tab label="팬보드" {...a11yProps(0)} />
              <Tab label="내지갑" {...a11yProps(1)} />
              <Tab label="리포트" {...a11yProps(2)} />
              <Tab label="팬/스타" {...a11yProps(3)} />
              <Tab label="설정" {...a11yProps(4)} />
            </Tabs>
          </TabsBar>
          <TabContentWrap value={value} index={0}>
            <FanBoard />
          </TabContentWrap>
          <TabContentWrap value={value} index={1}>
            <MyWallet />
          </TabContentWrap>
          <TabContentWrap value={value} index={2}>
            <Report />
          </TabContentWrap>
          <TabContentWrap value={value} index={3}>
            <FanStar />
          </TabContentWrap>
          <TabContentWrap value={value} index={4}>
            <Setting />
          </TabContentWrap>
        </StylesProvider>
      </Content>
    </Layout>
  )
}
export default Mypage

const ContentHeader = styled.div`
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #eee;
  justify-content: space-between;

  h1 {
    display: inline-block;
  }
`

const MypageButton = styled.button``

const Content = styled.section`
  margin: 30px 0 100px 0;
`

const TabsBar = styled(AppBar)`
  margin-top: 30px;
  background: #8555f6;

  .MuiTabs-root {
    width: 600px;
    margin: 0 auto;
  }
  .MuiTab-root {
    min-width: 20%;
  }
  .MuiTabs-indicator {
    height: 3px;
    background-color: #5728c5;
  }

  @media (max-width: ${DEVICE_PC}) {
    .MuiTabs-root {
      width: 90%;
    }
  }

  @media (max-width: ${DEVICE_MOBILE}) {
    .MuiTabs-root {
      width: 100%;
      padding: 0;
    }
    .MuiTab-root {
      padding: 0;
    }
  }
`

const TabContent = styled(Typography)`
  width: 600px;
  margin: 30px auto;
  @media (max-width: ${DEVICE_PC}) {
    width: 90%;
  }

  .MuiBox-root {
    padding: 0;
  }
`
