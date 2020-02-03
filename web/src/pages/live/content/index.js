/**
 * @file chat.js
 * @brief 채팅
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'pages/live/store'
//components
import Api from 'context/api'

//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  //useState
  const [fetch, setFetch] = useState(null)
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
    }
    setFetch(res.data)
  }

  //makeContents
  const makeContents = () => {
    if (fetch === null) return
    return fetch.list.map((list, idx) => {
      const {roomNo, bjProfImg, welcomMsg, bgImg, title} = list
      console.log(list)

      return (
        <List key={idx} href="#" style={{backgroundImage: `url(${bgImg.thumb700x700})`}}>
          <h1>{title}</h1>
          <h2>{welcomMsg}</h2>
          <Profile>
            <img src={`${bjProfImg.url}`} alt="" />
          </Profile>
          <h3>{roomNo}</h3>
          <span>{/* <img src={`${bgImg.thumb700x700}`} /> */}</span>
        </List>
      )
    })
  }
  /**
   *
   * @returns
   */
  useEffect(() => {
    //방송방 리스트
    fetchData({params: {page: 1, records: 10}})
    //fetchData({params: {roomType: 0, page: 1, records: 0}})
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="wrap">
        <h1>방송방 리스트</h1>
        {makeContents()}
      </div>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  max-width: 1920px;
  width: 100%;
  padding: 0 50px;
  box-sizing: border-box;
  .wrap {
    min-height: 200px;
    background: #e1e1e1;
  }
`
const List = styled.a`
  display: inline-block;
  margin: 10px;
  max-width: 150px;
  width: 240px;
  height: 100px;
  padding: 10px;
  vertical-align: top;
  background-size: cover;
  box-sizing: border-box;

  h1 {
    font-size: 14px;
    color: #ff0000;
  }
  h2 {
    font-size: 12px;
    color: blue;
  }
  h3 {
    display: block;
    font-size: 12px;
    color: #fff;
    background: #000;
  }
  img {
    width: 100%;
    height: auto;
    vertical-align: top;
  }
`
const Profile = styled.span`
  display: inline-block;
  width: 50px;
  height: 50px;

  img {
    width: 100%;
    height: auto;
    vertical-align: top;
  }
`
