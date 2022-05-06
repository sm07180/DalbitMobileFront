import React, {useContext, useEffect, useState} from 'react'

// global components
import NoResult from 'components/ui/noResult/NoResult';
// components
import CheckList from '../../components/CheckList';
import SocialList from '../../components/SocialList';
import API from "context/api";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const FanboardSection = (props) => {
  const { fanBoardData, isMyProfile, deleteContents, profileData, openSlidePop, getFanBoardData, params } = props;
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [formState, setFormState] = useState({
    contents: "",
    others: 1,  //topFix 고정여부 [0:고정x, 1: 고정o] / viewOn 비밀글 여부 (등록만 가능, 수정불가 ) [0: 비밀글o, 1: 비밀글x]
  });

  //예외조건 확인
  const validChecker = () => {
    let confirm = true;
    let message = '';
    if(formState?.contents?.length === 0) {
      message = "내용을 입력해주세요.";
      confirm = false;
    }
    if(formState?.contents?.length > 1000) {
      message = "내용을 1,000자 이하로 입력해주세요.";
      confirm = false;
    }
    if(!confirm) {
      dispatch(setGlobalCtxMessage({type:'toast',msg: message}));
    }
    return confirm;
  };

  //팬보드 등록
  const contentsAdd = async () => {
    if(!validChecker()) return;
    const {contents, others} = formState;
    const {data, result, message} = await API.member_fanboard_add({
      data: {
        memNo: params.memNo ? params.memNo : globalState.profile.memNo,
        depth: 1,
        contents,
        viewOn: others
      }
    });
    dispatch(setGlobalCtxMessage({type:'toast',msg: message}));
    if(result === "success") {
      getFanBoardData();
      setFormState({...formState, contents: ""});
    }
  };

  //팬보드 내용 가져오기
  const onChange = (e) => {
    setFormState({
      ...formState,
      contents: e.target.value
    })
  }

  //팬보드 공개, 비공개
  const onClick = () => {
    setFormState({
      ...formState,
      others: formState.others === 1 ? 0 : 1
    })
  }

  return (
    <div className="fanboardSection">
      <div className="writeWrap">
        <div className="fanboardWrite">
          <textarea rows="7" maxLength={1000} placeholder="내용을 입력해 주세요." onChange={onChange} value={formState?.contents || ""} />
          <div className="writeBottom">
            <CheckList text="비공개" checkStatus={formState.others===0} onClick={onClick}/>
            <button className="btn" onClick={contentsAdd}>등록</button>
          </div>
        </div>
      </div>
      {fanBoardData.list.length > 0 ?
        <SocialList socialList={fanBoardData.list} isMyProfile={isMyProfile} type="fanBoard"
                    deleteContents={deleteContents} profileData={profileData} openSlidePop={openSlidePop} />
        :
        <NoResult />
      }
    </div>
  )
}

export default FanboardSection
