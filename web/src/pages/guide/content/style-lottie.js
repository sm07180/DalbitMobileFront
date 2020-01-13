/**
 * @title
 */
import React, {useState} from 'react'
import styled from 'styled-components'
import Lottie from 'lottie-react-web'
import l1 from '../content/lottie/l1.json'
import l2 from '../content/lottie/l2.json'
import l3 from '../content/lottie/l3.json'
import l4 from '../content/lottie/l4.json'
export default () => {
  return (
    <>
      <Wrap>
        <Lottie
          options={{
            animationData: l1
          }}></Lottie>

        <Lottie
          options={{
            animationData: l2
          }}></Lottie>
        <Lottie
          options={{
            animationData: l3
          }}></Lottie>
        <Lottie
          options={{
            animationData: l4
          }}></Lottie>
      </Wrap>
    </>
  )
}
const Wrap = styled.div`
  width: 50vw;
  height: 50vh;
  margin: 0 auto;
`
