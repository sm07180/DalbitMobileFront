import React, {ReactNode} from "react";
import {MediaType} from "../../../pages/broadcast/constant";




export const ContainerChatSide = ({children, subClass=[''], mediaType}:{
  children: ReactNode
  subClass?: string[]
  mediaType: MediaType
}) => {
  return <>
    <div className={`chat-side ${mediaType === MediaType.VIDEO ? 'video' : ''} ${subClass.join(' ')}`}>
      {children}
    </div>
  </>
}


