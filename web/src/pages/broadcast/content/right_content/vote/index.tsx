// React
import React from "react";
import {useSelector} from "react-redux";
import vote from "../../../../../redux/sagas/vote";

// component
import MakeVote from "./MakeVote";
import VoteContent from "./VoteContent";
import VoteList from "./VoteList";

// style
import "./index.scss";
import VoteCallback from "./VoteCallback";


const Vote = ({ roomInfo, roomOwner, roomNo }) => {
  const voteRdx = useSelector(({vote})=> vote);
  return (
    <div id="vote">
      {
        voteRdx.step === 'list' && voteRdx.voteList.list &&
        <VoteList roomInfo={roomInfo} roomNo={roomNo} roomOwner={roomOwner}/>
      }
      {
        voteRdx.step === 'vote' && voteRdx.voteSel && voteRdx.voteDetailList &&
        <VoteContent />
      }
      {
        voteRdx.step === 'ins' &&
        <MakeVote roomInfo={roomInfo} roomNo={roomNo}/>
      }
      {
        voteRdx.callback !== null &&
        <VoteCallback/>
      }
    </div>
  )
};


export default Vote;
