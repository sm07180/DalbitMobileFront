import React, {useEffect, useState} from 'react'

import ListNone from 'components/ui/listNone/ListNone'
import GenderItems from 'components/ui/genderItems/GenderItems'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import Api from "context/api";
import '../invite.scss'
import {response} from "express";

const InviteMydata = () => {
  const [popup, setPopup] = useState(false);

  const temporaryData = [
    {
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      since : "2022.02.09",
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      since : "2022.02.09",
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      since : "2022.02.09",
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    }
  ]

  // useEffect(()=>{
  //   getList();
  // },[]);
  //
  // const getList = ()=>{
  //   Api.inviteMyList({
  //     reqBody: true,
  //     data:{
  //       "memNo": context.token.memNo,
  //     }
  //   }).then((response)=>{
  //     console.log(response);
  //   })
  // }

  const popupOpen = () => {
    setPopup(true)
  }

  return (    
    <>
      <div className='inviteMydata'>
        <div className='inviteData'>
          <div className='titleWrap'>
            <span className='dataTitle'>
              <img src='https://image.dalbitlive.com/event/invite/eventPage_myData-title.png' alt="초대친구 현황" className='titleImg'/>
            </span>
            <button className='questionMark' onClick={popupOpen}></button>
          </div>
          <div className='countWrap'>
            <span className='countTitle'>내가 초대한 친구</span>
            <span className='countData'>100</span>
          </div>
        </div>
        <div className='inviteUser'>
          {
            temporaryData.length > 0 ?
            <>
              <div className='inviteUserWrap'>
              {
                temporaryData.map((list, index) => {
                  return (
                    <div className='inviteUserList' key={index}>
                      <div className="photo">
                        <img src={list.profImg} alt="프로필이미지" />
                      </div>
                      <div className='listContent'>
                        <div className='listItem'>
                          <GenderItems data={list.gender}/>
                          <span className='nickNm'>{list.nickNm}</span>
                        </div>
                        <div className='listItem'>
                          <span className='since'>가입일 {list.since}</span>
                        </div>
                      </div>
                    </div> 
                  )
                })
              }
              </div>
            </>
            :
            <ListNone imgType="event01" text={`초대 내역이 없어요 :( \n 친구를 초대하고 초대왕이 되어보세요!`} height="300px"/>
          }
        </div>    
      </div>
      {
        popup &&
        <LayerPopup setPopup={setPopup}>
          <div className='popTitle'>친구현황</div>
          <div className='popContent'>
            <span>
              나를 초대인으로 입력한 친구 수에<br/>
              따라 추가 보상을 드립니다.
            </span>
            <span>
              나를 초대인으로 입력한 친구에 한해서 집계가 됩니다.
            </span>
            <span>
              받은 보상은 내 지갑에서 내역을 확인할 수 있습니다.
            </span>
          </div>
        </LayerPopup>
      }
    </>
  )
}

export default InviteMydata
