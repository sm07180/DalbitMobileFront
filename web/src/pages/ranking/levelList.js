import React from 'react'
import {useHistory} from 'react-router-dom'
import styled, {css} from 'styled-components'
import NoResult from 'components/ui/noResult'
// context

//static
import guideIcon from './static/guide_s.png'
import fanIcon from './static/ic_circle_fan_s_dkgr.svg'
import people from './static/people_g_s.svg'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const {levelList} = props
  return (
    <>
      <ul>
        <li className="renewalBox">
          <span>매일 00시 집계 및 갱신</span>
          <img
            src={guideIcon}
            onClick={() => {
              dispatch(setGlobalCtxUpdatePopup({popup: ['RANK_POP', 'level']}))
            }}
          />
        </li>
        {levelList.length > 0 &&
          levelList.map((list, index) => {
            const {
              nickNm,
              fanNickNm,
              fanMemNo,
              profImg,
              holder,
              level,
              grade,
              fanCnt,
              roomNo,
              memNo,
              levelColor,
              listenerCnt
            } = list

            return (
              <li key={index} className="levelListBox">
                <div className="levelListBox__levelBox">
                  <div className="levelListBox__levelBox--levelText">Lv</div>
                  <LevelBox levelColor={levelColor}>{level}</LevelBox>
                </div>

                {/* <div className="levelListBox__levelBox">
                <span>{level}</span>
              </div> */}
                <div
                  className="thumbBox"
                  onClick={() => {
                    history.push(`/mypage/${memNo}`)
                  }}>
                  <img src={holder} className="thumbBox__frame" />
                  <img src={profImg.thumb120x120} className="thumbBox__pic" />
                </div>
                <div className="textBox">
                  <div className="nickNameBox">{nickNm}</div>
                  <div className="countBox">
                    <span>
                      <img src={fanIcon} /> {fanCnt}
                    </span>
                    <span>
                      <img src={people} /> {listenerCnt}
                    </span>
                  </div>
                  <div className="bestFanBox">
                    <span className="bestFanBox__label">최고팬</span>
                    <span
                      className="bestFanBox__nickNm"
                      onClick={() => {
                        history.push(`/mypage/${fanMemNo}`)
                      }}>
                      {fanNickNm}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        {levelList.length === 0 && <NoResult />}
      </ul>
    </>
  )
}

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
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 44px;
  height: 22px;
  border-radius: 14px;
  font-weight: bold;
  font-size: 16px;
  color: #fff;
  text-align: center;
`
