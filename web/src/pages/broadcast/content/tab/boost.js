import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import {BroadCastStore} from '../../store'
import Api from 'context/api'
import Util from '../../util/broadcast-util'
// import PopUp from '../../../components/ui/pop-mic'

const testData = [
  {
    totalCount: 88,
    rankNow: 15,
    activeType: 'Y'
  }
]

export default props => {
  //----------------------------------------------------- declare start
  const context = useContext(Context)
  const store = useContext(BroadCastStore)
  const [boostData, setBoostData] = useState([])
  const [flag, setFlag] = useState(false)
  const [timer, setTimer] = useState()
  const [boostTime, setBoostTime] = useState(18)

  //----------------------------------------------------- func start
  useEffect(() => {
    console.log('## store : ', store)
    console.log('## context :', context)
    boostInfo()
  }, [flag])

  useEffect(() => {
    if (store.boostList.boostCnt > 0) {
      _timer()
    }
  }, [store])

  // 부스트 정보 조회
  async function boostInfo() {
    const res = await Api.broadcast_room_live_ranking_select({
      params: {
        roomNo: store.roomInfo.roomNo.toString()
      }
    })
    console.log('## res - boostInfo :', res)
    if (res.result === 'success') store.action.updateBoostList(res.data)
  }

  // 부스트 사용하기
  async function useBoost() {
    clearInterval(_timer.interval)
    const res = await Api.broadcast_room_use_item({
      data: {
        roomNo: store.roomInfo.roomNo.toString(),
        itemNo: '2001',
        itemCnt: 1
      }
    })
    console.log('## res - useBoost :', res)
    if (res.result === 'success') setFlag(!flag)
  }

  const _timer = () => {
    let time = boostTime
    let interval = setInterval(() => {
      if (time === 0) clearInterval(interval)
      let m = Math.floor(time / 60) + ':' + (time % 60)
      setTimer(m)
      time--
    }, 1000)
  }

  //----------------------------------------------------- components start
  return (
    <Container>
      <Contents>
        <Title>현재 방송방 순위</Title>
        <Rank>
          <Now>{store.boostList.rank}</Now>
          <span>&nbsp;/&nbsp;</span>
          <Total>{store.boostList.roomCnt}</Total>
        </Rank>
        <BoostImgArea>
          <img src="https://devimage.dalbitcast.com/images/api/boost_inactive@2x.png" width={200} height={160} />
          {store.boostList.boostCnt !== 0 ? (
            <TimeActive>
              {store.boostList.boostCnt}개 사용중 &nbsp;<span>|</span>&nbsp; {timer}
            </TimeActive>
          ) : (
            <TimeInactive>30:00</TimeInactive>
          )}
        </BoostImgArea>

        <Info>
          <p>부스트 사용시, 방송방 순위를</p>
          <p>빠르게 올릴수 있습니다.</p>
          <Point active={testData[0].activeType === 'Y' ? 'active' : ''}>30분 동안 인기도(좋아요) +10상승</Point>
        </Info>
        <UseBoost onClick={() => useBoost()}>
          부스터 사용(
          <img src="https://devimage.dalbitcast.com/images/api/ic_moon_s@2x.png" width={18} height={18} />x 15)
        </UseBoost>
      </Contents>
    </Container>
  )
}
//----------------------------------------------------- styled start
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`
const Contents = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`
const Rank = styled.div`
  display: flex;
  width: 20%;
  height: 26px;
  justify-content: center;
  align-items: center;

  font-size: 16px;
  font-weight: 400;
  line-height: 1.63;
  letter-spacing: -0.4px;
  color: #bdbdbd;
`

const Now = styled.div`
  display: flex;
  font-size: 24px;
  letter-spacing: -0.6px;
  font-weight: 800;
  color: #8556f6;
`
const Total = styled.div`
  display: flex;
  color: #9e9e9e;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.03;
  letter-spacing: -0.6px;
  font-weight: 400;
`
const Title = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.5px;
  justify-content: center;
  align-items: center;
  color: #424242;
`
const BoostImgArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 185px;
  position: relative;
`
const TimeInactive = styled.div`
  display: flex;
  width: 150px;
  height: 32px;
  border-radius: 16px;
  border-style: solid;
  border-color: #ec455f;
  border-width: 1px;
  justify-content: center;
  align-items: center;
  background: #fff;

  font-size: 14px;
  font-weight: 600;
  line-height: 1.29;
  letter-spacing: -0.35px;
  color: #ec455f;

  position: absolute;
  bottom: 0;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 250px;
  height: 56px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: -0.35px;
  margin-top: 16px;
  color: #616161;
`

const Point = styled.p`
  display: flex;
  text-align: center;
  justify-content: center;
  width: 250px;
  height: 96px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.43;
  letter-spacing: -0.35px;
  color: ${props => (props.active === 'active' ? '#ec455f' : '#8555f6')};
`
const UseBoost = styled.button`
  display: flex;
  width: 100%;
  height: 48px;
  background-color: #8556f6;
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.71;
  letter-spacing: -0.35px;
  margin-top: 26px;
  align-items: center;
  justify-content: center;
`
const TimeActive = styled.div`
  display: flex;
  width: 150px;
  height: 32px;
  border-radius: 16px;
  background-color: #ec455f;
  color: #fff;
  justify-content: center;
  align-items: center;
  padding: 8px 16px 8px 16px;
  margin-top: 10px;

  font-size: 14px;
  font-weight: 600;
  line-height: 1.29;
  letter-spacing: -0.35px;
  text-align: left;

  & > span {
    font-size: 10px;
  }
`
