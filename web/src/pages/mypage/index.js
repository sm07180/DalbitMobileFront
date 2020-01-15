/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'Pages/common/layout'
import {DEVICE_PC, DEVICE_MOBILE} from 'Context/config'
//context

//components
import Api from 'Context/api'
import PropTypes from 'prop-types'
import {StylesProvider} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

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
const User = () => {
  //---------------------------------------------------------------------

  useEffect(() => {}, [])

  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  //---------------------------------------------------------------------
  return (
    <Layout>
      <ContentHeader>
        <h1>
          <a href="/">마이페이지</a>
        </h1>
        <MypageButton>방송국 관리</MypageButton>
      </ContentHeader>
      <Content>
        <MyProfile>내 프로필 영역</MyProfile>

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
            팬보드
          </TabContentWrap>
          <TabContentWrap value={value} index={1}>
            내지갑
          </TabContentWrap>
          <TabContentWrap value={value} index={2}>
            리포트
          </TabContentWrap>
          <TabContentWrap value={value} index={3}>
            팬/스타
          </TabContentWrap>
          <TabContentWrap value={value} index={4}>
            설정
          </TabContentWrap>
        </StylesProvider>
      </Content>
    </Layout>
  )
}
export default User

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
  margin: 30px 0;
`

const ContentLayout = styled.div`
  width: 600px;
  margin: 0 auto;
  @media (max-width: ${DEVICE_PC}) {
    width: 90%;
  }
`

const MyProfile = styled(ContentLayout)`
  padding: 30px;
  min-height: 300px;
  background: #eee;
`

const TabsBar = styled(AppBar)`
  margin-top: 30px;
  background: #5676e8;

  .MuiTabs-root {
    width: 600px;
    margin: 0 auto;
    @media (max-width: ${DEVICE_PC}) {
      width: 90%;
    }
  }
  .MuiTab-root {
    min-width: 20%;
  }
  .MuiTabs-indicator {
    height: 3px;
    background-color: #314eb5;
  }
`

const TabContent = styled(Typography)`
  width: 600px;
  margin: 0 auto;
  @media (max-width: ${DEVICE_PC}) {
    width: 90%;
  }
`
