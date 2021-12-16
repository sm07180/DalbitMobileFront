import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import styled, {css} from 'styled-components'
import Api from 'context/api'
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

// component
import NoResult from 'components/ui/new_noResult'

export default (props) => {
  const globalCtx = useContext(Context)
  const history = useHistory()

  return (
    <>
      <section>
        <img src={`${IMG_SERVER}/event/tree/treeBg-4.png`} className="bgImg" />
      </section>
      <section className="rankContainer">
        <div class="detailView">
          <button class="prev active">
            <img src={`${IMG_SERVER}/event/tree/arrow.png`} />
            이전
          </button>
          <div class="title">
            <div class="titleWrap">실시간</div>
            <span>(PM 18:52 기준)</span>
          </div>
          <button class="next false">
            다음
            <img src={`${IMG_SERVER}/event/tree/arrow.png`} />
          </button>
        </div>
        {true && (
          <div className="rankList my">
            <div className="rankNum">
              <span>내순위</span>
              <span className="num">4</span>
            </div>
            <div className="photo">{/* <img src={globalCtx.profile.profImg.thumb50x50} /> */}</div>
            <div className="listBox">
              <span className="level">Lv {globalCtx.profile.level}</span>
              <span className="userNick">asdfasdfasdf</span>
            </div>
            <div className="listBack">
              <img src="" />
              {Utility.addComma(80000)}
            </div>
          </div>
        )}
        <div className="rankUl">
          <div className="rankList">
            <div className="rankNum">
              <span className="num">4</span>
            </div>
            <div className="photo">{/* <img src={globalCtx.profile.profImg.thumb50x50} /> */}</div>
            <div className="listBox">
              <span className="badge">
                <img src="" />
              </span>
              <span className="userNick">asdfasdf</span>
            </div>
            <div className="listBack">
              <img src="" />
              {Utility.addComma(80000)}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
