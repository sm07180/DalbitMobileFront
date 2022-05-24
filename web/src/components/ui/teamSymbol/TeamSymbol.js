import React from 'react';

import {IMG_SERVER} from 'context/config';

const TeamSymbol = (props) => {
  const { bgCode, edgeCode, medalCode } = props;

  return (
    <div className="teamSymbol">
      <img src={`${IMG_SERVER}/team/parts/B/${bgCode}.png`} />
      <img src={`${IMG_SERVER}/team/parts/E/${edgeCode}.png`} />
      <img src={`${IMG_SERVER}/team/parts/M/${medalCode}.png`} />
    </div>
  )
}

export default TeamSymbol;