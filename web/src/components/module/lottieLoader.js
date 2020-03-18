/**
 * @example 사용법
 * @todo  eventListeners 제공
 *
 */

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Lottie from 'react-lottie'

export default props => {
  const MakeLottie = props => {
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

  return <MakeLottie path={props.path} width={props.width} height={props.height} event={props.event} loop={props.loop} />
}

const LottieView = styled.div``
