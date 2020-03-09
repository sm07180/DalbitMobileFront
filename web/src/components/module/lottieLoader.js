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
            eventListeners={props.event ? props.event : [{}]}
            // eventListeners={[
            //   {
            //     eventName: 'complete',
            //     callback: () => setShow(false)
            //   }
            // ]}
            options={{
              loop: props.loop ? props.loop : false,
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

  return <MakeLottie path={props.path} width={props.width} height={props.height} event={props.event} loop={props.loop} className={props.className} />
}

const LottieView = styled.div``
