import React, {useContext, useEffect, useState, useCallback} from 'react'
import styled, {css} from 'styled-components'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

import {changeDate} from '../lib/common_fn'

import NoResult from 'components/ui/noResult'

import like from '../static/like_g_s.svg'
import people from '../static/people_g_s.svg'
import time from '../static/time_g_s.svg'

function SpecialList({empty, fetching}) {
  const context = useContext(Context)
  const {rankState, rankAction} = useContext(RankContext)

  const {specialList, formState} = rankState

  const formDispatch = rankAction.formDispatch

  const handleDate = (type) => {
    const handle = changeDate(type, 3, formState.currentDate)

    formDispatch({
      type: 'DATE',
      val: handle
    })
  }

  const formatDate = useCallback(() => {}, [formState])

  const prevLast = () => {
    const yy = formState.currentDate.getFullYear()
    const mm = formState.currentDate.getMonth() + 1
    const dd = formState.currentDate.getDate()

    const cdt = new Date('2020-07-01')
    const cyy = cdt.getFullYear()
    const cmm = cdt.getMonth() + 1

    if (yy === cyy && cmm === mm) {
      return false
    } else {
      return true
    }
  }

  const nextLast = () => {
    const yy = formState.currentDate.getFullYear()
    const mm = formState.currentDate.getMonth() + 1
    const dd = formState.currentDate.getDate()

    const cdt = new Date()
    const cyy = cdt.getFullYear()
    const cmm = cdt.getMonth() + 1

    if (yy === cyy && cmm === mm) {
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    formatDate()
  }, [formState])

  return (
    <>
      <div className="detailView">
        <button
          className={`prevButton ${prevLast() && fetching === false && 'active'}`}
          onClick={() => {
            if (prevLast() && fetching === false) {
              handleDate('back')
            }
          }}>
          이전
        </button>

        <div className="title">
          <div className="titleWrap">이번달</div>
        </div>

        <button
          className={`nextButton ${nextLast() && fetching === false && 'active'}`}
          onClick={() => {
            if (nextLast() && fetching === false) {
              handleDate('front')
            }
          }}>
          다음
        </button>
      </div>
      <ul>
        {empty === true ? (
          <NoResult />
        ) : (
          <>
            {specialList.map((v, idx) => {
              let genderName
              if (v.gender == 'm' || v.gender == 'f') {
                genderName = `genderBox gender-${v.gender}`
              } else {
                genderName = `genderBox`
              }

              return (
                <li key={idx} className="levelListBox">
                  <div className="specialBox">{v.specialCnt}회</div>
                  <div
                    className="thumbBox"
                    onClick={() => {
                      if (context.token.isLogin) {
                        if (context.token.memNo === memNo) {
                          history.push(`/menu/profile`)
                        } else {
                          history.push(`/mypage/${v.memNo}`)
                        }
                      } else {
                        history.push('/login')
                      }
                    }}>
                    <img src={v.holder} className="thumbBox__frame" />
                    <img src={v.profImg.thumb120x120} className="thumbBox__pic" />
                  </div>
                  <div className="test">
                    <div className="nickNameBox">{v.nickNm}</div>
                    <div className="genderBox">
                      <LevelBox levelColor={v.levelColor}>Lv{v.level}</LevelBox>
                      <span className={genderName} />
                    </div>
                    <div className="countBox">
                      <span>
                        <img src={like} /> {v.goodCnt}
                      </span>
                      <span>
                        <img src={people} /> {v.listenerCnt}
                      </span>
                      <span>
                        <img src={time} /> {v.broadMin}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </>
        )}
      </ul>
    </>
  )
}

export default React.memo(SpecialList)

const LevelBox = styled.div`
  ${(props) => {
    if (props.levelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${props.levelColor[0]}, ${props.levelColor[1]} 51%, ${props.levelColor[2]});
      `
    } else {
      return css`
        background-color: ${props.levelColor[0]};
      `
    }
  }};
  width: 44px;
  height: 16px;
  border-radius: 14px;
  font-weight: bold;
  font-size: 12px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.3px;
`
