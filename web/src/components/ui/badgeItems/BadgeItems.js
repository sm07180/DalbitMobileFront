import React, {useEffect, useState} from 'react'

import './badgeItems.scss'

const BadgeItems = (props) => {
  const {data, type} = props
  
  const commonBadgeList = data.commonBadgeList
  const liveBadgeList =  data.liveBadgeList
  const fanBadge = [data.fanBadge]
  const isBadge = {
    special: true, //data.isSpecial,
    recommend: data.isRecomm,
    new: data.isNew,
    contents: data.isConDj,
    badgeSpecial: data.badgeSpecial
  }
  const isNew = {
    new: data.isNew,
    newListener: data.isNewListener,
  }

  return (
    <>
      {type === 'commonBadgeList' && commonBadgeList.map((list, index) => {
        const {icon, startColor, endColor, text} = list
        return (
          <React.Fragment key={index}>
            <em
              className={`badgeItem`}
              key={index}
              style={{
                background: `linear-gradient(to right, ${startColor}, ${endColor}`
              }}>
              {icon !== '' && <img src={icon} alt="뱃지아이콘" />}
              <span>{text}</span>
            </em>
          </React.Fragment>
        )
      })}
      {type === 'liveBadgeList' && liveBadgeList.map((list, index) => {
        const {icon, startColor, endColor, text} = list
        return (
          <React.Fragment key={index}>
            <em
              className={`badgeItem`}
              key={index}
              style={{
                background: `linear-gradient(to right, ${startColor}, ${endColor}`
              }}>
              {icon !== '' && <img src={icon} alt="뱃지아이콘" />}
              <span>{text}</span>
            </em>
          </React.Fragment>
        )
      })}
      {type === 'fanBadge' && fanBadge.icon !== undefined &&
        <em
          className={`badgeItem`}
          style={{
            background: `linear-gradient(to right, ${fanBadge.startColor}, ${fanBadge.endColor}`
          }}>
          {fanBadge.icon !== '' && <img src={fanBadge.icon} alt="뱃지아이콘" />}
          <span>{fanBadge.text}</span>
        </em>
      }
      {type === 'isBadge' && isBadge.badgeSpecial == 2 ? (
        <em className="badgeItem bestDj">베스트DJ</em>
      ) : isBadge.badgeSpecial === 1 ? (
        <em className="badgeItem contentsDj">콘텐츠DJ</em>
      ) : isBadge.special === true && (
        <em className="badgeItem specialDj">스페셜DJ</em>
      )}
      {type === 'isNew' && isNew.new ? 
        <em className='badgeItem newDj'>NEW DJ</em>
        : type === 'isNew' && isNew.newListener &&
        <em className='badgeItem new'>NEW</em>
      }
    </>
  )
}

BadgeItems.defaultProps = {
  data: [],
  type: ''
}

export default React.memo(BadgeItems)
