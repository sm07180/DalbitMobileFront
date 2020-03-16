import React, {useState, useContext, useEffect} from 'react'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout'

import Api from 'context/api'

import {Context} from 'context'

export default props => {
  const ctx = useContext(Context)
  const {memNo} = props.match.params
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    ;(async () => {
      if (!profile) {
        const profileInfo = await Api.profile({params: {type: 'private', memNo: memNo}})
        setProfile(profileInfo.data)
      }
    })()
  }, [])

  if (profile) {
    return (
      <Layout {...props}>
        <PrivatePage>
          <ProfileImg style={{backgroundImage: `url(${profile.profImg['thumb150x150']})`}}></ProfileImg>
          <NickName>{profile.nickNm}</NickName>
          <MemberId>@{profile.memId}</MemberId>
          <FanAndStarWrap>
            <span>팬</span>
            <span style={{color: '#8556f6'}}>{profile.fanCnt}</span>
            <span style={{margin: '0 10px'}}>|</span>
            <span>스타</span>
            <span style={{color: '#8556f6'}}>{profile.starCnt}</span>
            <span style={{margin: '0 10px'}}>|</span>
          </FanAndStarWrap>
          <MsgWrap>
            {profile.profMsg.split('\n').map((lineText, index) => {
              return (
                <div className="line-text" key={index}>
                  {lineText}
                </div>
              )
            })}
          </MsgWrap>
        </PrivatePage>
      </Layout>
    )
  } else {
    return <div></div>
  }
}

const MsgWrap = styled.div`
  display: block;
  margin-top: 15px;
  color: #616161;
  letter-spacing: -0.35px;
  font-size: 14px;

  .line-text {
    text-align: center;
  }
`

const FanAndStarWrap = styled.div`
  display: flex;
  flex-direction: row;
  color: #e0e0e0;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  margin-top: 13px;
`

const MemberId = styled.div`
  color: #bdbdbd;
  font-size: 14px;
  letter-spacing: -0.35px;
  text-align: center;
`

const NickName = styled.div`
  color: #424242;
  font-size: 24px;
  letter-spacing: -0.6px;
  text-align: center;
  margin-top: 20px;
`

const ProfileImg = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

const PrivatePage = styled.div`
  max-width: 360px;
  margin: 60px auto;
`
