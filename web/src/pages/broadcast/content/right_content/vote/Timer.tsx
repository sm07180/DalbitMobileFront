import React, {useEffect, useState} from 'react'
import {VoteResultType} from "../../../../../redux/types/voteType";
import moment from "moment";

type ReturnType = {
  hour: string, min: string, minute: string, sec: string, unitKor: '분'|'초', time: string, isTimeOver: boolean
}
export const Timer = (props: Pick<VoteResultType, 'endDate'>):ReturnType => {
  const endDateMomentProps = {...props.endDate.date, month:props.endDate.date.month-1, ...props.endDate.time};
  const [remainTime, setRemainTime] = useState(Number(
    moment(endDateMomentProps)
      .subtract(moment.now())
  ));

  useEffect(() => {
    if(props.endDate.date.year < 1){
      return;
    }
    if(moment(endDateMomentProps).isSameOrBefore(moment.now())){
      return;
    }
    const unit = 1000;
    const timer = setInterval(() => {
      setRemainTime(prevState => {
        const min = moment(prevState).format('m')
        const sec = moment(prevState).format('ss')
        // console.log(`prev`, prevState, min, sec)
        if(prevState < 1){
          clearInterval(timer);
        }
        return prevState - unit
      })
    }, unit);

    return () => clearInterval(timer);
  }, []);

  // const hour = props.endDate.time.hour < 10 ? '0' + props.endDate.time.hour : props.endDate.time.hour+'';
  const hour = props.endDate.time.hour+'';
  // const minute = props.endDate.time.minute < 10 ? '0' + props.endDate.time.minute : props.endDate.time.minute+'';
  const minute = props.endDate.time.minute+'';
  const min = moment(remainTime).format('m')
  const sec = moment(remainTime).format('ss')
  // 초 타이머 해달라는 요청 있을 때
  // const time = min !== '00' ? min : sec;
  // const unitKor = min !== '00' ? '분' : '초';
  const time = min === '0' ? '1' : min;
  const unitKor = '분';
  const isTimeOver = moment(endDateMomentProps).isSameOrBefore(moment.now());

  // return {hour, minute, min, sec, time, unitKor, isTimeOver};
  const dummy:ReturnType = {hour: '0', min: '0', minute: '0', sec: '0', unitKor: '분', time: '0', isTimeOver: true};
  if(props.endDate.date.year > 0){
    return {hour, minute, min, sec, time, unitKor, isTimeOver};
  }else{
    return dummy;
  }
}
