import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Lottie from 'react-lottie'

export default props => {
  return (
    <LottieView>
      <Lottie
        options={{
          loop: false,
          autoplay: props.autoPlay,
          path: props.path
        }}
        width={400}
        height={400}
      />
      <div>{JSON.stringify(props)}</div>
    </LottieView>
  )
}

const LottieView = styled.div``
