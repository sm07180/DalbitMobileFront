import React, {useEffect, useState} from 'react';
// global components
import ListRow from 'components/ui/listRow/ListRow';
import NoResult from 'components/ui/noResult/NoResult';
// components
import Tabmenu from '../Tabmenu';

import '../../scss/Invite.scss';

const tabmenu = ['팬','스타'];

const InvitePop = (props) => {

  const [tabType, setTabType] = useState(tabmenu[0]);

  // 페이지 시작
  return (
    <section className="invitePop">
      <Tabmenu data={tabmenu} tab={tabType} setTab={setTabType} />
      <div className="listContainer">
        <div className="listWrap">
          {true ? 
            <ListRow photo="" photoClick={() => photoClick()}>
              <div className="listContent">
                <div className="nick">일이삼사오육칠팔구십</div>
              </div>
              <div className="listBack">
                <button className={true  ? 'complete' : ''}>완료</button>
              </div>
            </ListRow>
          :
            <NoResult />
          }
        </div>
      </div>
    </section>
  )
}

export default InvitePop;

