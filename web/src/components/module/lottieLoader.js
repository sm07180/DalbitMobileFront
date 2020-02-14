/**
 * @example 사용법
 * @todo  eventListeners 제공
 *
 */

import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
// import Lottie from 'lottie-react-web'
import Lottie from 'react-lottie'

export default props => {
  const [isShow, setShow] = useState(true)

  const MakeLottie = props => {
    return (
      <LottieView>
        {isShow && (
          <Lottie
            eventListeners={[
              {
                eventName: 'complete',
                callback: () => setShow(false)
              }
            ]}
            options={{
              loop: false,
              autoplay: true,
              path: props.path
            }}
            width={props.width ? props.width : 400}
            height={props.height ? props.height : 400}
          />
        )}
      </LottieView>
    )
  }

  return <MakeLottie path={props.path} />
}

const LottieView = styled.div`
  width: 100%;
  margin: 0 auto;
  position: absolute;
`
