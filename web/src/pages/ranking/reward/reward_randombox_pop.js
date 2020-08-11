import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

import Api from 'context/api'
import Lottie from 'react-lottie'

export default (props) => {
  const {randomPopup, setRandomPopup, formData, setPopup, rewardPop, setRewardPop, rankType, dateType, myInfo, setMyInfo} = props
  const [randomPoint, setRandomPoint] = useState({
    rewardImg: ''
  })

  const closePopup = () => {
    setRandomPopup(false)
    setPopup(false)
    setMyInfo({
      ...myInfo,
      isReward: false
    })
  }

  setTimeout(closePopup, 5000)

  useEffect(() => {
    async function feachRandomReward() {
      const {result, data} = await Api.post_randombox_reward({
        data: {
          rankSlct: formData.rankType === 'dj' ? 1 : 2,
          rankType: Number(formData.dateType)
        }
      })

      if (result === 'success') {
        setRandomPoint(data)
      } else {
        console.log('랜덤실패')
      }
    }
    feachRandomReward()
  }, [])

  return (
    <RandomPopupWrap>
      <div className="lottie-box">
        {randomPoint.rewardImg && (
          <Lottie
            options={{
              loop: false,
              autoPlay: true,
              path: `${randomPoint.rewardImg}`
            }}
          />
        )}
      </div>
    </RandomPopupWrap>
  )
}

const RandomPopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;

  display: flex;
  justify-content: center;
  align-items: center;

  .lottie-box {
    background: none;
  }
`
