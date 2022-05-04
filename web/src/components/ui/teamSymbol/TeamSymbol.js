import React from 'react';

import {IMG_SERVER} from 'context/config';

const TeamSymbol = (props) => {
  const {data} = props;

  return (
    <div className="teamSymbol">
      <img src={`${IMG_SERVER}/team/parts/B/${data.team_bg_code}.png`} />
      <img src={`${IMG_SERVER}/team/parts/E/${data.team_edge_code}.png`} />
      <img src={`${IMG_SERVER}/team/parts/M/${data.team_medal_code}.png`} />
    </div>
  )
}

export default TeamSymbol;