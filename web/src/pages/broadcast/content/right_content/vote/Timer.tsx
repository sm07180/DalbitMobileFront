import React, {useEffect, useState} from 'react'
import {VoteResultType} from "../../../../../redux/types/voteType";
import moment, {Duration} from "moment";

type TimerReturnType = {
  hour: string, minute: string, unitKor: '분'|'초', time: string, isTimeOver: boolean
}
// date -> YYYY.MM.DD HH:mm:ss
export const NormalTimer = (date:string):Duration => {
  const momentDate = moment(date);
  const target = {
    date: {
      day: momentDate.date(),
      month: momentDate.month(),
      year: momentDate.year()
    },
    time: {
      hour: momentDate.hour(),
      minute: momentDate.minute(),
      nano: 0,
      second: momentDate.second()
    }
  }
  const endDateMomentProps = {...target.date, month:target.date.month, ...target.time};
  const [remainTime, setRemainTime] = useState(Number(
    moment(endDateMomentProps)
      .subtract(moment.now())
  ));

  useEffect(() => {
    if(target.date.year < 1){
      return;
    }
    if(moment(endDateMomentProps).isSameOrBefore(moment.now())){
      return;
    }
    const unit = 1000;
    const timer = setInterval(() => {
      setRemainTime(prevState => {
        if(prevState - unit < 1){
          clearInterval(timer);
          return 0
        }
        return prevState - unit
      })
    }, unit);

    return () => clearInterval(timer);
  }, []);
  return moment.duration(remainTime);
}
export const Timer = (props: Pick<VoteResultType, 'endDate'>):TimerReturnType => {

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
        if(prevState - unit < 1){
          clearInterval(timer);
          return 0
        }
        return prevState - unit
      })
    }, unit);

    return () => clearInterval(timer);
  }, []);

  // const hour = props.endDate.time.hour < 10 ? '0' + props.endDate.time.hour : props.endDate.time.hour+'';
  const hour = moment(endDateMomentProps).format("HH");
  // const minute = props.endDate.time.minute < 10 ? '0' + props.endDate.time.minute : props.endDate.time.minute+'';
  const minute = moment(endDateMomentProps).format("mm");
  const min = moment(remainTime).format('mm')
  const sec = moment(remainTime).format('ss')
  // 초 타이머 해달라는 요청 있을 때
  // const time = min !== '00' ? min : sec;
  // const unitKor = min !== '00' ? '분' : '초';
  const time = Number(min)+1+'';
  const unitKor = '분';
  const isTimeOver = moment(endDateMomentProps).isSameOrBefore(moment.now());
  // return {hour, minute, min, sec, time, unitKor, isTimeOver};
  const dummy:TimerReturnType = {hour: '00', minute: '00', unitKor: '분', time: '00', isTimeOver: true};
  if(props.endDate.date.year > 0){
    return {hour, minute, time, unitKor, isTimeOver};
  }else{
    return dummy;
  }
}
