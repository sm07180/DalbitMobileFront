import React, {useContext, useEffect, useState} from 'react'

import NoResult from 'components/ui/noResult/NoResult'
import GenderItems from 'components/ui/genderItems/GenderItems'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import Api from "context/api";
import '../invite.scss'
import {Context} from "context";
import {useHistory} from "react-router-dom";

const InviteMydata = () => {
  const context = useContext(Context)
  const history = useHistory();
  const [popup, setPopup] = useState(false);
  const [data, setData] = useState({
    cnt:"",
    list:[]
  });

  useEffect(()=>{
    getList();
  },[]);

  const getList = ()=>{
    Api.inviteMyList({
      reqBody: true,
      data:{
        "memNo": context.token.memNo,
      }
    }).then((response)=>{
      setData({
        cnt:response.data.listCnt,
        list:response.data.list
      })
    })
  }

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
            <button className='questionMark' onClick={popupOpen}/>
          </div>
          <div className='countWrap'>
            <span className='countTitle'>내가 초대한 친구</span>
            <span className='countData'>{data.cnt}</span>
          </div>
        </div>
        <div className='inviteUser'>
          {
            data.cnt > 0 ?
            <>
              <div className='inviteUserWrap'>
              {
                data.list.map((member, index) => {
                  return (
                    <div className='inviteUserList' key={index} onClick={() => history.push(`/profile/${member.rcv_mem_no}`)}>
                      <div className="photo">
                        <img src={member.profImg.thumb292x292} alt="프로필이미지" />
                      </div>
                      <div className='listContent'>
                        <div className='listItem'>
                          <GenderItems data={member.rcv_mem_sex}/>
                          <span className='nickNm'>{member.rcv_mem_nick}</span>
                        </div>
                        <div className='listItem'>
                          <span className='since'>가입일 {member.rcv_mem_join_date}</span>
                        </div>
                      </div>
                    </div> 
                  )
                })
              }
              </div>
            </>
            :
            <NoResult ment={`초대 내역이 없어요 :( \n 친구를 초대하고 초대왕이 되어보세요!`} />
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
