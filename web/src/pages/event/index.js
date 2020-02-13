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
import Lottie from 'lottie-react-web'
import Api from 'context/api'
import axios from 'axios'
import LottieLoader from '../../components/module/lottieLoader'

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
  //   return (
  //     <Lottie
  //       options={{
  //         loop: true,
  //         autoplay: true,
  //         path: state
  //       }}
  //     />
  //   )
  // }

  const _show = path => {
    setState(path)
    setShow(!isShow)
    setTimeout(() => {
      setShow(false)
    }, 3000)
  }

  const MakeLottie = props => {
    return (
      <div className="wrap">
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            path: props.path
          }}
          width={300}
          height={300}
        />
      </div>
    )
  }

  useEffect(() => {
    console.log(state)
  }, [state])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>
        <button
          onClick={() => {
            setState('https://devimage.dalbitcast.com/ani/lottie/2020.02.07_2.json')
          }}>
          버튼1
        </button>
        <button
          onClick={() => {
            setState('https://devimage.dalbitcast.com/ani/lottie/2020.02.07_3.json')
          }}>
          버튼2
        </button>
        <button
          onClick={() => {
            setState('https://devimage.dalbitcast.com/ani/lottie/2020.02.07_4.json')
          }}>
          버튼3
        </button>
        <button
          onClick={() => {
            _show('https://devimage.dalbitcast.com/ani/lottie/2020.02.07_4.json')
          }}>
          버튼4
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
