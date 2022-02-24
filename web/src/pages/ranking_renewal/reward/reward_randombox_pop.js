import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'


import Api from 'context/api'
import Lottie from 'react-lottie'
import {useDispatch, useSelector} from "react-redux";
import {setRankMyInfo} from "redux/actions/rank";

export default (props) => {
  const dispatch = useDispatch();
  const rankState = useSelector(({rankCtx}) => rankCtx);

  const {formState, myInfo} = rankState


  const {setRandomPopup, setPopup} = props
  const [randomPoint, setRandomPoint] = useState({
    rewardImg: ''
  })

  const closePopup = () => {
    setRandomPopup(false)
    setPopup(false)
    dispatch(setRankMyInfo({
      ...myInfo,
      isReward: false
    }))
  }

  setTimeout(closePopup, 5000)

  useEffect(() => {
    async function feachRandomReward() {
      const {result, data} = await Api.post_randombox_reward({
        data: {
          rankSlct: formState[formState.pageType].rankType,
          rankType: Number(formState[formState.pageType].dateType)
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
