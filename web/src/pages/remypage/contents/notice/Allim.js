import React, {useEffect, useState, useContext, useRef, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
// global components
import ListRow from 'components/ui/listRow/ListRow'
import moment from "moment";
import {RoomJoin} from "context/room";
// components
import './notice.scss'

const Allim = (props) => {
  const {alarmList, setAlarmList, handleClick} = props
  const context = useContext(Context);
  const history = useHistory();

  //요일 데이터 가공
  const changeDay = (date) => {
    return moment(date, "YYYYMMDDhhmmss").format("YY.MM.DD");
  };

  //푸시 설정하기로 이동(알림 없을때 출력)
  const onClick = () => {
    history.push(`/setting/push`);
  };

  useEffect(() => {
    if(!(context.token.isLogin)) {history.push("/login")}
  }, []);

  return (
    <div id="notice">
      <section className="noticeWrap">
        <div className="allim">
          {alarmList.list.length > 0 ?
            <>
              {alarmList.list.map((v, idx) => { //newCnt -> 새로운 알림 있을때 1, 없을때 0
                return (
                  <ListRow key={idx} photo={v.profImg.thumb292x292}>
                    {v.newCnt === 1 && <span className="newDot"/>}
                    <div className="listContent" data-type={v.notiType} data-mem-no={v.memNo} data-room-no={v.roomNo}
                         data-link={v.link} onClick={handleClick}>
                      <div className="title">{v.contents}</div>
                      <div className="date">{changeDay(v.regDt)}</div>
                    </div>
                  </ListRow>
                )
              })}
            </>
            :
            <div className="allimNone">
              <p>새로운 소식이 없어요<br/>오늘의 소식이 생기면 알려드릴께요!</p>
              <button onClick={onClick}>푸시 설정하기</button>
            </div>
          }
        </div>
      </section>
    </div>
  )
};

export default Allim;
