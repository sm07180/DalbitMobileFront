import React, {useEffect} from "react";
import NoResult from "common/ui/no_result";
import GuestItem from "./guest_item_rdx";

import "./index.scss";
import {useDispatch, useSelector} from "react-redux";
import {WrapGuest, WrapGuestList} from "../../../../../components/broadcast/guest";
import {GET_GUEST} from "../../../../../redux/actions/broadcast";

const GuestList = ()=>{
  const memberRdx = useSelector(({member})=> member);
  const broadcastRdx = useSelector(({broadcast})=> broadcast);
  const roomNo = broadcastRdx?.roomInfo?.roomNo;
  const guestList = broadcastRdx?.guestManagement?.data?.list;
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch({type: GET_GUEST})
  }, [])

  return (
    <WrapGuest>
      <h3 className="title">게스트 관리</h3>
      <WrapGuestList>
        {
          guestList && guestList.length > 0 ?
            guestList.map((item,index)=>
              <GuestItem item={item} key={index}/>
            )
            : <NoResult text="게스트가 없습니다." type={"default"}/>
        }
      </WrapGuestList>
    </WrapGuest>
  );
}

export default GuestList
