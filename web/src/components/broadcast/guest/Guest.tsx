import React from "react"
import {useSelector} from "react-redux";
import {GuestWrapStyled} from "./style";
import {
  BtnExitGuest,
  BtnGift,
  BtnPost,
  BtnToggleGuest,
  IconHint,
  ImgGuestProfile,
  WrapGuestBtn,
  WrapGuestIcon
} from "./index";

const Guest = ()=>{
  const memberRdx = useSelector(({member})=> member);
  const guestRdx = useSelector(({broadcast})=> broadcast.guest);
  return <>
    {/* case 1 */}
    <GuestWrapStyled>
      <WrapGuestIcon>
        <BtnGift/>
        <ImgGuestProfile/>
      </WrapGuestIcon>
      <WrapGuestBtn>
        <IconHint/>
        <BtnPost isDot={true}/>
      </WrapGuestBtn>
      <BtnToggleGuest>
        <BtnExitGuest/>
      </BtnToggleGuest>
    </GuestWrapStyled>

    {/* case 2 */}
    <GuestWrapStyled>
      <WrapGuestBtn>
        <IconHint/>
        <BtnPost isDot={true}/>
      </WrapGuestBtn>
    </GuestWrapStyled>
  </>
}

export default Guest
