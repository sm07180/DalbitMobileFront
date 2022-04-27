import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { printNumber } from "lib/common_fn";
import {RoomValidateFromClip, RoomValidateFromClipMemNo} from "common/audio/clip_func";
import BadgeList from "../../../common/badge_list";
import {useDispatch, useSelector} from "react-redux";

function RealTimeLive(props: any) {
  const { list, liveListType, categoryList } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  return (
    <>
      {list.map((list, idx) => {
        const {
          roomNo,
          roomType,
          bjMemNo,
          bjProfImg,
          bjNickNm,
          bjGender,
          title,
          likeCnt,
          entryCnt,
          entryType,
          giftCnt,
          boostCnt,
          rank,
          os,
          liveBadgeList,
          isNew,
          isConDj,
          totalCnt,
          gstProfImg,
          isGoodMem,
          nickNm,
          goodMem,
          mediaType,
          badgeSpecial,
          newFanCnt,
        } = list;

        return (
          <div
            className={`${
              liveListType === "v" ? "liveList__flex" : "liveList__item"
            }`}
            key={`live-${idx}`}
            onClick={() => {
              RoomValidateFromClipMemNo(roomNo, bjMemNo, dispatch, globalState, history, bjNickNm);
            }}
          >
            <div
              className="broadcast-img"
              style={{ backgroundImage: `url(${bjProfImg["thumb190x190"]})` }}
            >
              {gstProfImg.thumb292x292 && (
                <span className="thumb-guest">
                  <img src={gstProfImg.thumb292x292} alt="게스트" />
                </span>
              )}
            </div>

            {liveListType !== "v" ? (
              <div className="broadcast-content">
                <div className="title">
                  {/* {categoryList && (
                    <div className="category">
                      {(() => {
                        const target = categoryList.find((category) => category["cd"] === roomType);
                        if (target && target["cdNm"]) {
                          return target["cdNm"];
                        }
                      })()}
                    </div>
                  )}
                  <i className="line"></i> */}
                  {mediaType === "a" ? (
                    <em className="icon_wrap icon_roomtype">오디오</em>
                  ) : (
                    <em className="icon_wrap icon_roomtype icon_roomtype_video">
                      영상
                    </em>
                  )}
                  <strong>{title}</strong>
                </div>
                <div className="nickname">
                  {bjGender !== "n" && (
                    <em
                      className={`icon_wrap ${
                        bjGender === "m" ? "icon_male" : "icon_female"
                      }`}
                    >
                      <span className="blind">성별</span>
                    </em>
                  )}
                  {os === 3 && <em className="icon_wrap icon_pc">PC</em>}
                  {badgeSpecial > 0 && badgeSpecial === 2 ? (
                    <em className="icon_wrap icon_bestdj_half">베스트DJ</em>
                  ) : isConDj === true ? (
                    <em className="icon_wrap icon_contentsdj_half">콘텐츠DJ</em>
                  ) : badgeSpecial === 1 ? (
                    <em className="icon_wrap icon_specialdj_half">스페셜DJ</em>
                  ) : (
                    <></>
                  )}
                  {isNew === true && (
                    <em className="icon_wrap icon_newdj">신입DJ</em>
                  )}
                  {liveBadgeList && liveBadgeList.length !== 0 && (
                    <BadgeList list={liveBadgeList} />
                  )}

                  <span className="nick">{bjNickNm}</span>
                </div>
                <div className="detail">
                  <div className="value">
                    <i className="value--people">누적청취자</i>
                    <span>{printNumber(totalCnt)}</span>
                  </div>

                  <div className="value">
                    <i className="value--hit">청취자</i>
                    <span>{printNumber(entryCnt)}</span>
                  </div>
                  {boostCnt > 0 ? (
                    <div className="value isBoost">
                      <i className="value--boost">부스트사용</i>
                      <span className="txt_boost">{printNumber(likeCnt)}</span>
                    </div>
                  ) : (
                    <div className="value">
                      <i className="value--like">좋아요</i>
                      <span>{printNumber(likeCnt)}</span>
                    </div>
                  )}

                  <div className="value">
                    <i className="value--newFan"></i>
                    <span>{printNumber(newFanCnt)}</span>
                  </div>

                  {goodMem && goodMem.length > 0 && (
                    <div className="value isGoodMember">
                      {goodMem.map((idx) => {
                        return (
                          <i className={`value--goodMem${idx}`} key={idx}>
                            사랑꾼{idx}
                          </i>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="top-status">
                  {badgeSpecial > 0 && badgeSpecial === 2 ? (
                    <em className="icon_wrap icon_bestdj">베스트DJ</em>
                  ) : isConDj === true ? (
                    <em className="icon_wrap icon_contentsdj">콘텐츠DJ</em>
                  ) : badgeSpecial === 1 ? (
                    <em className="icon_wrap icon_specialdj">스페셜DJ</em>
                  ) : (
                    <></>
                  )}
                  {bjGender !== "" && (
                    <em
                      className={`icon_wrap ${
                        bjGender === "m"
                          ? "icon_male_circle"
                          : "icon_female_circle"
                      }`}
                    >
                      성별
                    </em>
                  )}
                  {os === 3 && <em className="icon_wrap icon_pc_circle">PC</em>}
                </div>

                <div className="entry-count">
                  <span className="count-txt">{printNumber(entryCnt)}</span>
                  <i className="entry-img">방송 참여자</i>
                </div>

                <div
                  className={`bottom-wrap ${
                    gstProfImg.thumb292x292 ? "text_cut" : ""
                  }`}
                >
                  <div className="dj-nickname">{bjNickNm}</div>
                  <span className="roomTitle">{title}</span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
export default RealTimeLive;
