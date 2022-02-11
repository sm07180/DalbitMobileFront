import React, {useEffect, useState} from 'react'

import './badgeItems.scss'

const BadgeItems = (props) => {
  const {data, type} = props
  const commonBadgeList = data.commonBadgeList
  const liveBadgeList =  data.liveBadgeList
  const fanBadge = [data.fanBadge]
  const isBadges = {
    special: true, //data.isSpecial,
    recommend: data.isRecomm,
    new: data.isNew,
    contents: data.isConDj,
    badgeSpecial: data.badgeSpecial
  }

  console.log(data,isBadges,fanBadge.icon);

  return (
    <>
      {commonBadgeList.map((list, index) => {
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
      {/* {liveBadgeList.map((list, index) => {
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
      })} */}
      {fanBadge.icon !== undefined ?
        <em
          className={`badgeItem`}
          style={{
            background: `linear-gradient(to right, ${fanBadge.startColor}, ${fanBadge.endColor}`
          }}>
          {fanBadge.icon !== '' && <img src={fanBadge.icon} alt="뱃지아이콘" />}
          <span>{fanBadge.text}</span>
        </em>
        :
        <></>
      }
      {isBadges && isBadges.badgeSpecial === 2 ? (
        <em className="icon_wrap icon_bestdj">베스트DJ</em>
      ) : isBadges.special === true ? (
        <em className="icon_wrap icon_contentsdj">콘텐츠DJ</em>
      ) : isBadges.badgeSpecial === 1 ? (
        <em className="badgeItem icon_specialdj">스페셜DJ</em>
      ) : (
        <></>
      )}
    </>
  )
}

export default React.memo(BadgeItems)
