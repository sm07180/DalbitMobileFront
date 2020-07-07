/**
 * @example 사용법
 * @todo  eventListeners 제공
 *
 */

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Lottie from 'react-lottie'

export default props => {
  return (
    <LottieView>
      <Lottie
        options={{
          loop: true,
          autoPlay: true,
          path: props.path
        }}
        width={props.width}
        height={props.height}
      />
    </LottieView>
  )
}

const LottieView = styled.div``
