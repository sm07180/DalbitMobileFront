import React, {useEffect, useState} from "react";
import {
  BtnPostManagement,
  IconFan,
  ListItemGuestManagement,
  ListItemGuestThumb,
  TimeConnection,
  WrapNickname
} from "../../../../../components/broadcast/guest";
import {ManagementGuestType} from "../../../../../redux/types/broadcastType";

const GuestItem = ({item}:{item:ManagementGuestType}) => {
  const [time, setTime] = useState(item.gstTime);

  useEffect(() => {
    let initInterval = setInterval(() => {
      setTime(time+1);
    }, 1000);
    return () => {
      if (initInterval) {
        clearInterval(initInterval);
      }
    };
  }, []);

  return (
    <ListItemGuestManagement>
      <ListItemGuestThumb>
        <IconFan/>
      </ListItemGuestThumb>
      <WrapNickname>
        <TimeConnection time={1}/>
      </WrapNickname>
      <BtnPostManagement gstProposeState={1} gstState={1}/>
    </ListItemGuestManagement>
  )
}

export default GuestItem;
