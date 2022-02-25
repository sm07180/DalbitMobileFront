// React
import React from "react";

// global Component

// component
import MakeVote from "./MakeVote";
import VoteContent from "./VoteContent";

// style
import "./index.scss";
import {useSelector} from "react-redux";
import vote from "../../../../../redux/sagas/vote";
import VoteList from "./VoteList";


const Vote = ({ roomInfo, roomOwner, roomNo }) => {
  const voteRdx = useSelector(({vote})=> vote);

  return (
    <div id="vote">
      {
        voteRdx.step === 'list' &&
        <VoteList roomInfo={roomInfo} roomNo={roomNo} roomOwner={roomOwner}/>
      }
      {
        voteRdx.step === 'vote' &&
        <VoteContent />
      }
      {
        voteRdx.step === 'ins' &&
        <MakeVote roomNo={roomNo}/>
      }
    </div>
  )
};


export default Vote;
