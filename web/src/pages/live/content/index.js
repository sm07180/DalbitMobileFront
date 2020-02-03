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
      const {bgImg, title} = list
      console.log(bgImg.thumb700x700)
      let styles = {
        root: {
          backgroundImage: `url(${bgImg.thumb700x700})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }
      }

      return (
        <a key={idx} href="#" style={styles}>
          <h1>{title}</h1>
          <span>{/* <img src={`${bgImg.thumb700x700}`} /> */}</span>
        </a>
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
        <h1>리스트123123123</h1>
        <List>{makeContents()}</List>
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
const List = styled.div`
  a {
    display: inline-block;
    max-width: 100px;
    width: 100px;
    height: 100px;
  }
`
