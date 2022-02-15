import DotIconSrc from "../../../pages/broadcast/static/ic_guest_setting_on.svg";
import React, {MouseEventHandler, ReactNode} from "react";
import GiftIconSrc from "../../../pages/broadcast/static/ic_gift_m.svg";
import EqualizerIconSrc from "../../../pages/broadcast/static/ic_equalizer.png";
import GuestOffIconSrc from "../../../pages/broadcast/static/ico_runout_w_s.svg";
import MicOnIconSrc from "../../../pages/broadcast/static/ic_mic.svg";
import MicOffIconSrc from "../../../pages/broadcast/static/ic_mic_off.svg";
import VideoOnIconSrc from "../../../pages/broadcast/static/ic_video.svg";
import VideoOffIconSrc from "../../../pages/broadcast/static/ic_videooff.svg";
import FanIcon from "../../../pages/broadcast/static/ic_fan.svg";
import {secToDateConvertor} from "../../../lib/common_fn";


export const IconHint = ({src,alt,onClick,subClass=['']}:{
  src?: string
  alt?: string
  onClick?: MouseEventHandler<HTMLImageElement>
  subClass?: string[]
}) => {
  return <img className={`hintIcon ${subClass.join(' ')}`} onClick={onClick} src={src} alt={alt}/>
}
export const BtnPost = ({isDot,text,onClick}:{
  isDot: boolean
  text?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}) => {
  return <>
    <button onClick={onClick}>
      <img className="guestIcon" src="https://image.dalbitlive.com/broadcast/ico_live_guest_g.png" alt="G" />
      { isDot && <img className="guestAlarm" src={DotIconSrc} alt="dot" /> }
      {text}
    </button>
  </>
}

export const BtnGift = ({onClick}:{
  onClick?: MouseEventHandler<HTMLButtonElement>
}) => {
  return <>
    <button className={"guestGift"} onClick={onClick}>
      <img src={GiftIconSrc} alt={"gift"}/>
    </button>
  </>
}

export const ImgGuestProfile = ({onClick, src, alt}:{
  onClick?: MouseEventHandler<HTMLSpanElement>
  src?: string
  alt?: string
}) => {
  return <>
    <span className="guestImageWrap" onClick={onClick}>
      <img className="equalizer" src={EqualizerIconSrc} alt={"equalizer"} />
      <img className="guestImg" src={src} alt={alt} />
    </span>
  </>
}

export const BtnToggleGuest = ({state,onClick,children}:{
  state?: "MIC ON" | "MIC OFF" | "VIDEO ON" | "VIDEO OFF"
  onClick?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
}) => {
  return <>
    <div className="guestBtnToggle">
      <button onClick={onClick}>
        { state === "MIC ON" && <img className="icon" src={MicOnIconSrc} alt={state} /> }
        { state === "MIC OFF" && <img className="icon" src={MicOffIconSrc} alt={state} /> }
        { state === "VIDEO ON" && <img className="icon" src={VideoOnIconSrc} alt={state} /> }
        { state === "VIDEO OFF" && <img className="icon" src={VideoOffIconSrc} alt={state} /> }
      </button>
      {children}
    </div>
  </>
}

export const BtnExitGuest = ({onClick}:{
  onClick?: MouseEventHandler<HTMLButtonElement>
}) => {
  return <>
    <button onClick={onClick}>
      <img src={GuestOffIconSrc} alt="게스트 연결 종료" />
    </button>
  </>
}

export const BtnPostManagement = ({gstState, gstProposeState, onClick}:{
  gstState: number
  gstProposeState: number
  onClick?: MouseEventHandler<HTMLButtonElement>
}) => {
  if (gstState === 1)         return <button className={`btn btn--guest`} onClick={onClick}>종료</button>
  if (gstProposeState === 1)  return <button className={`btn btn--apply`} onClick={onClick}>수락</button>
  if (gstProposeState === 2)  return <button className={`btn btn--invite`} onClick={onClick}>초대취소</button>

  return <button className={`btn btn--listener`} onClick={onClick}>초대</button>
}

export const ListItemGuestThumb = ({src, alt, children}:{
  src?: string
  alt?: string
  children?: ReactNode
})=>{
  return <>
    <span className="thumb">
      <img className="thumbImg" src={src} alt={alt}/>
      {children}
      {/*{isFan === 1 && <img src={FanIcon} className="fanIcon"/>}*/}
    </span>
  </>
}
export const IconFan = () => {
  return <img className="fanIcon" src={FanIcon} alt={"fan"}/>
}
export const ListItemGuestManagement = ({children}: { children?: ReactNode }) => {
  return <>
    <div className="guestItem">
      {children}
    </div>
  </>
}

export const TimeConnection = ({time}:{
  time: number
})=>{
  return <p>연결 시간 {secToDateConvertor(time)}</p>
};

export const WrapNickname = ({text,children}:{
  text?: string
  children?: ReactNode
})=>{
  return <>
    <div className="nicknameWrap">
      <span>{text}</span>
      {children}
    </div>
  </>
};

export const WrapGuestIcon = ({children}:{
  children: ReactNode
}) => {
  return <div className="guestIconWrap">{children}</div>
}
export const WrapGuestBtn = ({children}:{
  children: ReactNode
}) => {
  return <div className="guestBtnWrap">{children}</div>
}
export const WrapGuestList = ({children}:{
  children: ReactNode
}) => {
  return <div className="guestListWrap">{children}</div>
}
export const WrapGuest = ({children}:{
  children: ReactNode
}) => {
  return <div className="GuestWrap">{children}</div>
}
