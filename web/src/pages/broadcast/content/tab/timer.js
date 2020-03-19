import React, {useContext, useEffect} from 'react'
import {BroadCastStore} from 'pages/broadcast/store'
import Api from 'context/api'
import {Context} from 'context'
import styled from 'styled-components'

let time = 0
let hour = 0
let min = 0
let sec = 0
let timer
let startFlag = false
let pauseFlag = false
let addFlag = false

let BcEndTime = 7200 //방송방 기본 시간 ( 2시간 -> 7200)

const getTimeStamp = () => {
  const context = Timer.context()
  console.log('recv 방송 시간 = ' + context.broadcastTotalInfo.startDt)
  const broadcastStTime = context.broadcastTotalInfo.startDt

  var year = broadcastStTime.substring(0, 4)
  var month = broadcastStTime.substring(4, 6)
  var date = broadcastStTime.substring(6, 8)
  var hour = broadcastStTime.substring(8, 10)
  var min = broadcastStTime.substring(10, 12)
  var sec = broadcastStTime.substring(12, 14)
  //console.log('년 = ' + year + ',' + '월 = ' + month + ',' + '일 =' + date + ',' + '시 = ' + hour + ',' + '분 = ' + ',' + min + ',' + '초 =' + sec)
  var startDate = new Date(year, month, date, hour, min, sec)
  var endDate = new Date()
  var diffTime = new Date(0, 0, 0, 0, 0, 0, endDate - startDate)
  var diffhour = diffTime.getHours() * 3600
  var diffmin = diffTime.getMinutes() * 60
  var diffsec = diffTime.getSeconds()

  return parseInt(diffhour) + parseInt(diffmin) + parseInt(diffsec)
}

const leadingZeros = (n, digits) => {
  var zero = ''
  n = n.toString()

  if (n.length < digits) {
    for (var i = 0; i < digits - n.length; i++) zero += '0'
  }
  return zero + n
}

// 타이머 멈춤 기능 함수
export const pauseTimer = () => {
  if (pauseFlag) return
  console.warn('방송방 타이머 멈춤')
  startFlag = false
  pauseFlag = true
  clearInterval(timer)
}
// 타이머 시작 기능 함수
export const startTimer = () => {
  if (startFlag) return
  console.log('방송 시간차 = ' + getTimeStamp())
  startFlag = true
  timeloop()
  time = getTimeStamp()
  console.warn('타이머 시작')
  if (time >= BcEndTime) return

  pauseFlag = false
}
// 타이머 종료 기능 함수
export const stopTimer = () => {
  clearInterval(timer)
  console.warn('방송방 타이머 종료')
  startFlag = false
  pauseFlag = false
  time = 0
}
//타이머 연장 기능 함수
export const addTimer = sum => {
  console.warn('방송방 타이머 연장')
  //방송 연장 부스터 사용시 이 함수 사용하면 된다.
  addFlag = true
  //time += sum; // 연장 ( 분 : 60 , 30분 : 1800 , 1시간 : 3600)
  BcEndTime += sum
  time++ // 1초 delay 이가 생김 ....
}

const timeloop = () => {
  //새로고침시 BcEndTime 값이 초기화가 안됨
  //console.log('BcEndTime = ' + BcEndTime);
  //console.log('타이머 시작');
  const store = Timer.store()

  if (startFlag) {
    timer = setInterval(function() {
      //   if (!addFlag) {
      //     //if (time > 1) time++
      //   }
      //console.log('time = ' + time)
      min = Math.floor(time / 60)
      hour = Math.floor(min / 60)
      sec = time % 60
      min = min % 60

      var th = hour
      var tm = min
      var ts = sec
      if (th < 10) th = '0' + hour
      if (tm < 10) tm = '0' + min
      if (ts < 10) ts = '0' + sec

      //console.log('타이머 시간 = ' + time)
      // 타이머 종료 조건을 건다.
      if (time >= BcEndTime) {
        stopTimer()
        return
      }
      time++
      addFlag = false
      //console.log(th + ':' + tm + ':' + ts)
      store.action.updateBroadTimer(th + ':' + tm + ':' + ts)
    }, 1000)
  } else {
    return '00' + ':' + '00' + ':' + '00'
  }
}
const Timer = props => {
  const context = useContext(Context)
  const store = useContext(BroadCastStore)

  Timer.context = () => context
  Timer.store = () => store
  useEffect(() => {
    startTimer()
  }, [])

  return (
    <span id="time" className="time">
      {store.broadTimer}
    </span>
  )
}
export default Timer
