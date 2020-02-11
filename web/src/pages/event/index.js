/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
//components
import Lottie from 'lottie-react-web'
import Api from 'context/api'
//lottie
//import l1 from 'http://devimage.dalbitcast.com/ani/lottie/2020.02.07_1.json'

/**
곰인형-토끼 : https://devimage.dalbitcast.com/ani/lottie/2020.02.07_1.json
곰인형 : https://devimage.dalbitcast.com/ani/lottie/2020.02.07_2.json
도너츠-달 : https://devimage.dalbitcast.com/ani/lottie/2020.02.07_3.json
도너츠 : https://devimage.dalbitcast.com/ani/lottie/2020.02.07_4.json
곰인형-토끼 : https://devimage.dalbitcast.com/ani/webp/2020.02.07_1.webp
곰인형 : https://devimage.dalbitcast.com/ani/webp/2020.02.07_2.webp
도너츠-달 : https://devimage.dalbitcast.com/ani/webp/2020.02.07_3.webp
도너츠 : https://devimage.dalbitcast.com/ani/webp/2020.02.07_4.webp
 */
export default props => {
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>
        <p>webp</p>
        <Lottie
          options={{
            loop: false,
            path: 'https://devimage.dalbitcast.com/ani/lottie/2020.02.07_1.json'
          }}
        />
        <div className="wrap">
          <img src="https://devimage.dalbitcast.com/ani/webp/2020.02.07_1.webp"></img>
        </div>

        <h1>&#x1F601;</h1>
        <h2>&#x1F3AC;</h2>
        <h3>&#x1F42D;</h3>
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
  h1 {
    font-size: 30px;
  }
  h2 {
    font-size: 50px;
  }
  h3 {
    font-size: 70px;
  }
  .wrap {
    width: 10%;
    height: 10%;
  }
`
