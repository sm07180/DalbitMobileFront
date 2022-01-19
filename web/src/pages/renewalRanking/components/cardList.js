import React from 'react'

import '../style.scss'

const CardList = (props) => {
  const {list, isRanking} = props

  return (
    <React.Fragment>
      <div className="cardList">
        {isRanking &&
          <div className='rankWrap'>
            <div className='rank'>{list.rank}</div>
            {list.roomNo && <div className='live'>LIVE</div>}
          </div>
        }
        <div className="photo">
          {list.nickNm !== 'banner' ? 
            <img src={list.profImg.thumb190x190} alt={list.nickNm} />
            :
            <img src={list.bannerUrl} alt={list.nickNm} />
          }
        </div>
        <div className='userNick'>{list.nickNm}</div>
      </div>
    </React.Fragment>
  )
}

CardList.defaultProps = {
  list: [],
}

export default CardList
