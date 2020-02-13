import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Lottie from 'lottie-react-web'
/*
    @Lottie
    @example <LottieLoader path={YOUR_JSON} width={500} height={500} />
    @to-do props.width, props.height, event callback 
*/
export default props => {
  const MakeLottie = props => {
    return (
      <LottieView>
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            path: props.path
          }}
          width={props.width ? props.width : 300}
          height={props.height ? props.height : 300}
        />
      </LottieView>
    )
  }

  return <MakeLottie path={props.path} />
}

const LottieView = styled.div`
  width: 100%;
  margin: 0 auto;
  position: absolute;
  /* top: 0;
  left: -1024; */
`

// export default LottieLoader
