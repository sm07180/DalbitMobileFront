import React, {useContext, useEffect, useState} from 'react';
import Header from 'components/ui/header/Header'
import ListRow from 'components/ui/listRow/ListRow'
import './todayWinning.scss'
import Api from "context/api";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

const todayWinning = () => {
  const history = useHistory();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //오늘의 당첨자 List State
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(true);

  //오늘의 당첨자 API
  useEffect(()=>{
    Api.keyboardHero({
      reqBody: false,
      params: {memNo: globalState.profile.memNo ? globalState.profile.memNo : "0", pageNo: 1, pagePerCnt: 1000},
      method: 'GET'
    }).then((res)=>{
      console.log(res.data)
      setList(res.data);
    })
  },[refresh]);

  //본인인증
  const selfAuthCheck = async () =>{
    const {result, data} = await Api.self_auth_check();
    if(result === 'success'){
      return {result : result, phoneNo : data.phoneNo};
    }else{
      history.push(`/selfauth?event=/event`)
    }
  }

  //선물받기 API
  const receiveGift = (data) => {
    selfAuthCheck().then((response) => {
      if (response.result === 'success') {
        Api.keyboardHero({
          reqBody: true,
          data: {
            theSeq : data.the_seq,
            memNo : data.mem_no,
            preCode : data.pre_code,
            preSlct : data.pre_slct
          },
          method: 'POST'
        }).then((res)=>{
          //fixme
          console.log(res)
          if(res.code === "C001"){
            if(res.data === 1){
              context.action.toast({
                msg: "선물받기완료"
              })
              setRefresh(!refresh);
            }else if(res.data === -1){
              context.action.toast({
                msg: `상품 최대지급수량 초과 <br/> 잠시 후에 다시 시도해주세요.`
              })
            }else if(res.data === -2) {
              context.action.toast({
                msg: "이미 선물을 받았습니다."
              })
            }else {
              context.action.toast({
                msg: "잠시 후에 다시 시도해주세요."
              })
            }
          }
        });
      }
    })
  }

  const imageNum = (preCode) => {
    switch (preCode){
      case "r01":
        return "1"    //10달
      case "r02":
        return "2"    //50달
      case "r03":
        return "3"    //100달
      case "k01":
        return "4"    //스타벅스 아메리카노
      case "k02":
        return "5"    //GS25 교환권 5000원
      case "k04":
        return "6"    //네이버페이 1만원 포인트
      case "k03":
        return "7"    //맘스터치 싸이버거 세트
      case "k05":
        return "8"    //배스킨라빈스31 2만원 교환권
    }
  }


  return (
    <div id="todayWinning">
      <Header title="오늘의 당첨자" type="back"/>
      <section className="winningTopWrap">
        <div className="topBox">
          <p className="mainText">당첨을 축하드립니다</p>
          <p className="subText">선물받기 버튼을 눌러 선물을 수령해주세요.</p>
        </div>
      </section>
      <section>
        {(list && list.length > 0) &&
          list.map((user, index)=>{
            let giftImg = `https://image.dalbitlive.com/event/keyboardHero/present-${imageNum(user.pre_code)}.png`;
            return(
              <ListRow photo={giftImg} key={index}>
                <div className="listContent" onClick={() => history.push(`/profile/${user.mem_no}`)}>
                  <div className="item">{user.code_name}</div>
                  <div className="item">{user.mem_nick}</div>
                </div>
                {(context.token.isLogin && context.token.memNo === user.mem_no) &&
                // { true &&
                <div className="listBack"><button className={user.rcv_yn === "y" ? "disabled" : ""} onClick={() => receiveGift(user)}>선물받기</button></div>
                }
              </ListRow>
            )
          })
        }
      </section>
    </div>
  );
};

export default todayWinning;