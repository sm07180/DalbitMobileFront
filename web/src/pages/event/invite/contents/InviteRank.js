import React, {useEffect, useState, useContext} from 'react'

import NoResult from 'components/ui/noResult/NoResult'
import GenderItems from 'components/ui/genderItems/GenderItems'
import DataCnt from 'components/ui/dataCnt/DataCnt'
import LayerPopup from 'components/ui/layerPopup/LayerPopup'
import Api from "context/api";

import '../invite.scss'
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const InviteRank = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const [popup, setPopup] = useState(false);
  const [data, setData] = useState({
    cnt:"",
    list:[]
  });
  const [myData, setMyData] = useState({
    rankNo: "",
    mem_sex: "",
    mem_nick: "",
    invitation_cnt:"",
    thumb88x88:""
  });

  useEffect(()=>{
    getList();
    getMyRank();
  },[]);

  const getList = ()=>{
    Api.inviteList({
      reqBody: true,
      data:{
        "memNo": globalState.token.memNo,
      }
    }).then((response)=>{
      setData({
        cnt:response.data.listCnt,
        list:response.data.list
      })
    })
  }

  const getMyRank = ()=>{
    Api.inviteMyRank({
      reqBody: true,
      data:{
        "memNo": globalState.token.memNo,
      }
    }).then((response)=>{
      console.log(response.data);

      setMyData({
        rankNo: response.data.rankNo,
        mem_sex: response.data.mem_sex,
        mem_nick: response.data.mem_nick,
        invitation_cnt:response.data.invitation_cnt,
        thumb88x88:response.data.profImg.thumb292x292
      })
    })
  }

  const popupOpen = () => {
    setPopup(true)
  }

  return (
    <>
      <div className='inviteRank'>
        <div className='imageBox'>
          <img src="https://image.dallalive.com/event/invite/eventPage_rank-benefit.png" alt="초대왕에게 드리는 놀라운 혜택!" className='fullImage'/>
          <button className='noticePopBtn' onClick={popupOpen}>유의사항</button>
        </div>
        <div className='imageBox'>
            <img src="https://image.dallalive.com/event/invite/eventPage_rank-title.png" alt="초대왕 랭킹" className='fullImage'/>
          </div>
        <div className='rankSection'>
          {
            data.cnt > 0 ?
            <>
              {globalState.token.isLogin &&
              <div className='inviteMyRank'>
                <div className='listFront'>
                  <span className='myrankText'>내순위</span>
                  <span className='rankingBadge'>{myData.rankNo === 0 ? "-" : myData.rankNo}</span>
                </div>
                <div className="photo">
                  <img src={myData.thumb292x292} alt="프로필이미지"/>
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
              }
              <div className='inviteRankWrap'>
              {
                data.list.map((member, index) => {
                  return (
                    <div className='inviteRankList' key={index} onClick={() => history.push(`/profile/${member.mem_no}`)}>
                      <div className='listFront'>
                        <span className={`rankingBadge`}>{index+1}</span>
                      </div>
                      <div className="photo">
                        <img src={member.profImg.thumb292x292} alt="프로필이미지" />
                      </div>
                      <div className='listContent'>
                        <div className='listItem'>
                          <GenderItems data={member.mem_sex}/>
                          <span className='nickNm'>{member.mem_nick}</span>
                        </div>
                      </div>
                      <div className='listBack'>
                        <DataCnt type="inviteCnt" value={member.invitation_cnt}/>
                      </div>
                    </div>
                  )
                })
              }
              </div>
            </>
            :
            <div className='listNone'>
              <NoResult ment="랭킹 내역이 없어요." />
            </div>
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
              1등, 2등일 경우 50 명 이상 초대 시 순위 인정,<br/>
              조건 충족 못할 시 50만원 + 한정판 달비 캐릭터 1개 지급
            </span>
            <span>
              3등 ~ 5등일 경우 30 명 이상 초대 시 순위 인정,<br/>
              조건 충족 못할 시 1,000달 + 한정판 달비 캐릭터 1개 지급
            </span>
            <span>
              현금 경품 시 메일(help@dallalive.com)로<br/>
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
