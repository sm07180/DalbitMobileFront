import React, {useEffect, useState} from 'react'

import ListNone from 'components/ui/listNone/ListNone'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import Api from "context/api";

import '../invite.scss'
import {useDispatch, useSelector} from "react-redux";

const InviteRank = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {token, profile} = globalState
  const [popup, setPopup] = useState(false);
  const [data, setData] = useState({
    cnt: "",
    list: []
  });
  const [myData, setMyData] = useState();


  const temporaryData = [
    {
      rank : 1,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 100,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 2,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 98,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 3,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 96,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 4,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 94,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 5,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 92,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 6,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 90,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 7,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 88,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 8,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 86,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 9,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 84,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 10,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 82,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 11,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 80,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 12,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 78,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 13,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 76,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 14,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 74,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 15,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 72,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 16,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 70,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 17,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 68,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 18,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 66,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 19,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 64,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 20,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 62,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 21,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 60,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 22,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 58,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 23,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 56,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 24,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 54,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 25,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 52,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 26,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 50,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 27,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 48,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 28,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 46,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 29,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 44,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 30,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 42,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 31,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 40,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 32,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 38,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 33,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 36,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 34,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 34,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 35,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 32,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 36,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 30,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 37,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 28,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 38,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 26,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 39,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 24,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    },
    {
      rank : 40,
      gender : "m",
      nickNm : "일이삼사오육칠팔구십",
      inviteCnt : 1,
      profImg : "https://image.dalbitlive.com/images/listNone-userProfile.png"
    }
  ]

  useEffect(()=>{
    getList();
    getMyRank();
  },[]);

  const getList = ()=>{
    Api.inviteList({
      reqBody: true,
      data: {
        "memNo": globalState.token.memNo,
      }
    }).then((response)=>{
      console.log("inviteList", getList);
      setData({
        cnt:response.data.listCnt,
        list:response.data.list
      })
    })
  }

  const getMyRank = ()=>{
    Api.inviteMyRank({
      reqBody: true,
      data: {
        "memNo": globalState.token.memNo,
      }
    }).then((response)=>{
      console.log("inviteMyRank", response);
      setMyData(response.data)
    })
  }


  const popupOpen = () => {
    setPopup(true)
  }

  return (
    <>
      <div className='inviteRank'>
        <div className='imageBox'>
          <img src="https://image.dalbitlive.com/event/invite/eventPage_rank-benefit.png" alt="초대왕에게 드리는 놀라운 혜택!"
               className='fullImage'/>
          <button className='noticePopBtn' onClick={popupOpen}>유의사항</button>
        </div>
        <div className='imageBox'>
          <img src="https://image.dalbitlive.com/event/invite/eventPage_rank-title.png" alt="초대왕 랭킹"
               className='fullImage'/>
        </div>
        <div className='rankSection'>
          {
            data.cnt > 0 ?
            <>
              <div className='inviteMyRank'>
                <div className='listFront'>
                  <span className='myrankText'>내순위</span>
                  <span className='rankingBadge'>{myData.rankNo}</span>
                </div>
                <div className="photo">
                  <img src={`${myData.image_profile ? myData.image_profile : "https://image.dalbitlive.com/images/listNone-userProfile.png"}`} alt="프로필이미지" />
                </div>
                <div className='listContent'>
                  <div className='listItem'>
                    <GenderItems data={myData.mem_sex}/>
                    <span className='nickNm'>{myData.mem_nick}</span>
                  </div>
                </div>
                <div className='listBack'>
                  <DataCnt type="inviteCnt" value={myData.invitation_cnt}/>
                </div>
              </div>
              <div className='inviteRankWrap'>
              {
                data.list.map((list, index) => {
                  return (
                    <div className='inviteRankList' key={index}>
                      <div className='listFront'>
                        <span className={`rankingBadge`}>{list.rank}</span>
                      </div>
                      <div className="photo">
                        <img src={list.image_profile} alt="프로필이미지" />
                      </div>
                      <div className='listContent'>
                        <div className='listItem'>
                          <GenderItems data={list.mem_sex}/>
                          <span className='nickNm'>{list.mem_nick}</span>
                        </div>
                      </div>
                      <div className='listBack'>
                        <DataCnt type="inviteCnt" value={list.invitation_cnt}/>
                      </div>
                    </div>
                  )
                })
              }
              </div>
            </>
            :
            <ListNone imgType="event01" text="랭킹 내역이 없어요." height="300px"/>
          }
        </div>
      </div>
      {
        popup &&
        <LayerPopup setPopup={setPopup}>
          <div className='popTitle'>달라 초대왕 도움말</div>
          <div className='popContent'>
            <span>
              동일 초대 수일 경우<br/>
              초대인의 레벨로 우선순위 측정 됩니다.
            </span>
            <span>
              1등 ~ 5등일 경우 30명 이상 초대 시 순위 인정,<br/>
              조건 충족 못할 시 상금의 50%만 지급 합니다.
            </span>
            <span>
              현금 경품 시 메일(help@dalbitlive.com)로<br/>
              당첨자 서류를 남겨주시면 이벤트 서류 확인 후<br/>
              제세공과금(22%)를 제외한 금액이 입금됩니다.
            </span>
          </div>
        </LayerPopup>
      }
    </>
  )
}

export default InviteRank
