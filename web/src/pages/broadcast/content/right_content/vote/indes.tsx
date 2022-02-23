// React
import React, {useState} from "react";

// global Component
import Tabmenu from '../component/tabmenu'

// component
import Voting from './voting'
import VoteClosed from "./voteClosed";

// style
import "./index.scss";

const tabmenu = ['진행중인 투표', '마감된 투표']

const Vote = () => {
  const [tabType, setTabType] = useState(tabmenu[0])

  return (
    <div id="vote">
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      <div className="contentWrap">
        {tabType === tabmenu[0] ?
          <Voting />
        :
          <VoteClosed />
        }
      </div>
    </div>
  )
};

export default Vote;