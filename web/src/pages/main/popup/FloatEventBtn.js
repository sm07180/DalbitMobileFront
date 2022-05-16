import React, {useEffect, useState} from 'react';

import Api from 'context/api';
import {useHistory} from 'react-router-dom';
import {IMG_SERVER} from 'context/config';
import {useDispatch, useSelector} from "react-redux";

import '../scss/floatingBtn.scss';
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const FloatEventBtn = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {token} = globalState;

  const [attendCheck, setAttendCheck] = useState(-1); // 0 - 완료, 1 - 시간부족, 2 -- 시간충족

  //pathname
  const urlrStr = history.location.pathname;

  // 출석체크 버튼 컴포넌트
  const AttendStampActive = (props) => {
    const {type, pushValue, children} = props;
    return (
      <div
        className={`attendStampActive ${type}`}
        onClick={() => {
          try {
            fbq('track', 'attend_event')
            firebase.analytics().logEvent('attend_event')
          } catch (e) {
          }

          // todo: 6월 12일
          if(attendCheck===2) {
            dispatch(setGlobalCtxMessage({
              type: "alert",
              msg: ` 키보드 히어로 31 이벤트가 진행 되는 동안에는 룰렛이벤트가 키보드히어로 31로 대체됩니다.`,
              callback: () => {
                history.push(`/event/keyboardhero`)
              }
            }))
          }else{
            history.push(`/event/${pushValue}`)
          }
        }}>
        {children}
      </div>
    )
  }
  // 출석체크 버튼 컴포넌트 출력 조건1
  const attendStampState = () => {
    if (token.isLogin) {
      if (attendCheck === 0) {
        return <AttendStampActive type="basic" pushValue="attend_event" />
      } else if (attendCheck === 1) {
        return (
          <AttendStampActive type="" pushValue="attend_event">
            <img src={`${IMG_SERVER}/webp/attend_stamp.webp`} width={48} height={48} />
          </AttendStampActive>
        )
      } else if (attendCheck === 2) {
        // todo:6월 12일
        // return <AttendStampActive type="motion" pushValue="attend_event/roulette" />
      }
    }
  }

  //출석도장 API
  async function fetchEventAttendCheck() {
    const {result, data} = await Api.getEventAttendCheck()
    if (result === 'success') {
      const {userEventCheck} = data
      setAttendCheck(userEventCheck)
    } else {
      console.log(data.message);
    }
  }

  useEffect(() => {
    fetchEventAttendCheck()
  }, [])

  return (
    <div id='floatingEvent'>
      <div className='floatingWrap'>
        <div className="fixedButton">
          {props.scrollOn && urlrStr !== '/rank' && attendStampState()}
        </div>
      </div>
    </div>
  )

};

export default FloatEventBtn;
