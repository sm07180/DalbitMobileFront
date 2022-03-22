import React, { useContext, useState, useEffect, useCallback } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
// api
import { getSpecialList, getProfile } from "common/api";
// scss
// constant
import { tabType } from "../constant";
import {useDispatch, useSelector} from "react-redux";
import {setClipCtxRightTabType, setClipCtxUserMemNo} from "../../../redux/actions/clipCtx";

export default (props) => {
  // ctx && commons

  const globalState = useSelector(({globalCtx}) => globalCtx);
  const clipState = useSelector(({clipCtx}) => clipCtx);
  const { userMemNo } = clipState;

  const dispatch = useDispatch();
  const history = useHistory();
  // state
  const [list, setList] = useState<any>("");
  const [userInfo, setUserInfo] = useState<any>("");
  // icons Url
  const SpecialBadgeOff = "https://image.dalbitlive.com/svg/specialdj_off_s.svg";
  const SpecialBadgeOn = "https://image.dalbitlive.com/svg/specialdj_on_s.svg";
  // 프로필 보기
  const viewProfile = useCallback((memNo: string) => {
    if (globalState.baseData.isLogin === true) {
      dispatch(setClipCtxRightTabType(tabType.PROFILE));
      dispatch(setClipCtxUserMemNo(memNo));
    } else {
      return history.push("/login");
    }
  }, []);
  //make View
  const makeContents = () => {
    return (
      <ul className="historyWrap">
        <h3
          className="tabTitle tabTitle__back"
          onClick={() => {
            viewProfile(userMemNo);
          }}
        >
          스페셜 DJ 약력
        </h3>
        <div className={`historyWrap__header ${userInfo.badgeSpecial > 0 ? "isSpecial" : ""}`}>
          {userInfo.badgeSpecial > 0 ? (
            <img src={SpecialBadgeOn} className="historyWrap__badge" />
          ) : (
            <img src={SpecialBadgeOff} className="historyWrap__badge" />
          )}
          <div className="historyWrap__info">
            <span className="historyWrap__info__nick">{userInfo.nickNm}</span> 님은 <br />
            {userInfo.badgeSpecial > 0 ? "현재 스페셜 DJ입니다." : "스페셜 DJ 출신입니다."} <br />총{userInfo.specialDjCnt}회
            선정되셨습니다.
          </div>
        </div>
        <div className="historyWrap__tableWrap">
          <table>
            <colgroup>
              <col width="50%" />
              <col width="50%" />
            </colgroup>
            <thead>
              <tr>
                <th>선정 일자</th>
                <th>선정 기수</th>
              </tr>
            </thead>
            {list && list.list.length > 0 ? (
              <tbody>
                {list.list.map((item, index) => {
                  const { roundNo, selectionDate } = item;
                  return (
                    <tr key={`idx` + index}>
                      <td>{selectionDate}</td>
                      <td>{roundNo}</td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody></tbody>
            )}
          </table>
        </div>
      </ul>
    );
  };

  // --------------------------------------------------

  useEffect(() => {
    // api Call
    async function fetchProfileData() {
      const { result, data } = await getProfile({ memNo: userMemNo });
      if (result === "success") {
        setUserInfo(data);
      }
    }
    async function GetList() {
      // flag
      let page = 1;
      let records = 100;
      //fetch
      const { result, data } = await getSpecialList({
        memNo: userMemNo,
        page,
        records,
      });
      if (result === "success") {
        setList(data);
      }
    }
    fetchProfileData();
    GetList();
  }, []);
  // --------------------------------------------------
  return <div>{makeContents()}</div>;
};
