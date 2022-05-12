import React, { useState } from "react";
// component
import ReceiveList from "./component/story_receiveList";
import PlusList from "./component/story_plusList";
import SendingReceive from "./component/story_receiveSend";
import SendingPlus from "./component/story_plusSend";


type storyTabType = "receive" | "plus";

export default function StoryList(props: any) {
  const { roomOwner, roomNo, roomInfo } = props;

  //state
  const [storyTab, setStoryTab] = useState<storyTabType>('receive');

  return (
    <div className="storyWrap">
      <StoryTab storyTab={storyTab} setStoryTab={setStoryTab} />
      {roomOwner === true ?
        <>
          {storyTab === 'receive' ?
              <ReceiveList roomNo={roomNo}/>
            :
              <PlusList roomNo={roomNo}/>
          }
        </>

        :
        <>
          {storyTab === 'receive' ?
                <SendingReceive roomNo={roomNo} roomInfo={roomInfo}/>
              :
                <SendingPlus roomNo={roomNo} roomInfo={roomInfo}/>
            }
        </>
      }
    </div>
  );
}

const StoryTab = ({ storyTab, setStoryTab }) => {
  return (
    <div className="storyTabWrap">
      <div className={`storyTabMenu ${storyTab === 'receive' ? 'active' : ''}`}
           onClick={() => setStoryTab('receive')}
      >
        받은 사연
      </div>
      <div className={`storyTabMenu ${storyTab === 'plus' ? 'active' : ''}`}
           onClick={() => setStoryTab('plus')}
      >
        사연 플러스
      </div>
    </div>
  )
}