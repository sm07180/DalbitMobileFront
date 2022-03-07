import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setVoteCallback} from "../../../../../redux/actions/vote";
import {VoteCallbackPromisePropsType} from "../../../../../redux/types/voteType";

const VoteCallback = () => {
  const voteRdx = useSelector(({vote})=> vote);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(voteRdx.callback === null) return;

    voteRdx.callback.then((results:VoteCallbackPromisePropsType)=>{
      results.map((result, index) => {
        if(voteRdx.step !== result.step){
          return;
        }
        if(result.step === 'vote'){
          if(!result.data.voteNo){
            return;
          }
          if(result.data.voteNo !== voteRdx.voteSel.voteNo){
            return;
          }
        }
        result.callback();
      })
    }).then(()=>{
      dispatch(setVoteCallback(null));
    });
  }, [voteRdx.callback])
  return <></>
}

export default VoteCallback;
