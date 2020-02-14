/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {ajax} from 'context/api'
//components
import LottieLoader from '../../components/module/lottieLoader'
// import Lottie from 'lottie-react-web'
import Lottie from 'react-lottie'
import Api from 'context/api'
import axios from 'axios'

/**
곰인형-토끼 : 
://devimage.dalbitcast.com/ani/lottie/2020.02.07_1.json
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
  const [state, setState] = useState('https://devimage.dalbitcast.com/ani/lottie/2020.02.07_1.json')
  const [isShow, setShow] = useState(false)
  //useEffect

  // const makeLottie = () => {
  //   console.log(state)

  //   return (
  //     <Lottie
  //       options={{
  //         loop: true,
  //         autoplay: true,
  //         path: 'https://devimage.dalbitcast.com/ani/lottie/2020.02.07_2.json'
  //       }}
  //     />
  //   )
  // }

  const setLottie = path => {
    setState(path)
    setShow(!isShow)
  }
  useEffect(() => {
    console.log(state)
    setShow(!isShow)
  }, [state])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>
        <button
          onClick={() => {
            setLottie('https://devimage.dalbitcast.com/ani/lottie/2020.02.07_2.json')
          }}>
          버튼1
        </button>
        <button
          onClick={() => {
            setLottie('https://devimage.dalbitcast.com/ani/lottie/2020.02.07_3.json')
          }}>
          버튼2
        </button>
        <button
          onClick={() => {
            setLottie('https://devimage.dalbitcast.com/ani/lottie/2020.02.07_4.json')
          }}>
          버튼3
        </button>
        {/* <div className="wrap">{makeLottie()}</div> */}
        {isShow && <LottieLoader path={state} width={500} height={500} />}
        <h1>&#x1F601;</h1>
        <h2>&#x1F3AC;</h2>
        <h3>&#x1F42D;</h3>
        <p>https://getemoji.com/</p>
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
    max-width: 200px;
    margin: 0 auto;
  }
`
