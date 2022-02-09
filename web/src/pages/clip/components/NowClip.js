import React from 'react'
import ListRow from "components/ui/listRow/ListRow";

const NowClip = (props) => {
  const { info } = props;

  return (
    <>
      <div className='listWrap' style={{backgroundImage:`url('${info.bgImg.url}')`}}>
        <ListRow photo={info.bgImg.url}>
          <div className='listContent'>
            <span className='title'>{info.title}</span>
            <span className='nick'>{info.nickName}</span>
          </div>
        </ListRow>
      </div>
    </>
  );
};

export default NowClip;