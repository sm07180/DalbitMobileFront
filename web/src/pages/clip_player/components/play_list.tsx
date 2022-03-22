import React, { useContext, useState, useEffect, useRef } from "react";
import { DalbitScroll } from "common/ui/dalbit_scroll";
import { getPlayList, getClipType } from "common/api";
import PlayListEdit from "./play_list_edit";
import { useHistory } from "react-router-dom";
import Header from "../../../components/ui/header/Header";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus, setGlobalCtxClipPlayListTabAdd} from "../../../redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory();

  const { clipInfo, clipPlayListTab } = globalState;

  const [list, setList] = useState([]);
  const [clipType, setClipType] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const fetchDataClipType = async () => {
    const { result, data, message } = await getClipType({});
    if (result === "success") {
      setClipType(data);
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        content: `${message}`,
      }))
    }
  };

  const fetchPlayList = async () => {
    // console.log("clipPlayListTab", clipPlayListTab);
    // const { result, data, message } = await getPlayList({
    //   sortType: 5,
    //   records: 100,
    // });
    // if (result === "success") {
    //   setList(data.list);
    // } else {
    //   globalAction.setAlertStatus!({
    //     status: true,
    //     content: `${message}`,
    //   });
    // }
  };

  const createList = () => {
    if (clipPlayListTab === null) return null;
    if (clipPlayListTab.length === 0) return null;
    if (clipPlayListTab[0] === null) return null;
    return clipPlayListTab.map((item, idx) => {
      const { clipNo, title, nickName, subjectType, filePlay, filePlayTime, bgImg, gender } = item;
      const genderClassName = gender === "f" ? "female" : gender === "m" ? "male" : "";
      return (
        <li
          className={`playListItem ${clipNo === clipInfo?.clipNo ? "playing" : "off"}`}
          key={`${idx}-playList`}
          onClick={() => {
            if (clipNo !== clipInfo?.clipNo) {
              history.push(`/clip/${clipNo}`);
            }
          }}
        >
          <div className="playListItem__thumb">
            {clipNo === clipInfo?.clipNo && (
              <div className="playingbarWrap">
                <div className="playingbar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <img src={bgImg["thumb80x80"]} alt="thumb" />
            <span className="playListItem__thumb--playTime">{filePlay ? filePlay : filePlayTime}</span>
          </div>
          <div className="textBox">
            <div className="textBox__iconBox">
              <span className="textBox__iconBox--type">
                {clipType.map((v: any, index) => {
                  if (v.value === subjectType) {
                    return <React.Fragment key={idx + "typeList"}>{v.cdNm}</React.Fragment>;
                  }
                })}
              </span>
              <span className={`textBox__iconBox--gender ${genderClassName}`}></span>
            </div>
            <p className="textBox__subject">{title}</p>
            <p className="textBox__nickName">{nickName}</p>
          </div>
        </li>
      );
    });
  };

  useEffect(() => {
    if (localStorage.getItem("clipPlayListInfo")) {
      const { type } = JSON.parse(localStorage.getItem("clipPlayListInfo")!);
      const oneData = JSON.parse(sessionStorage.getItem("clip")!);
      if (type === "one") {
        dispatch(setGlobalCtxClipPlayListTabAdd(oneData));
      }
    }
    fetchDataClipType();
  }, []);

  useEffect(() => {
    if (!isEdit) fetchPlayList();
  }, [isEdit]);

  return (
    <div className="tabPlayList">
      <h2 className="tabContent__title">
        <span>재생목록</span>
      </h2>
      <p className="playListTotal">
        총 목록 수 <span>{globalState.clipPlayListTab?.length}</span>
      </p>
      <div className="playListWrap">
        <DalbitScroll width={362}>
          <ul className="playListBox">{createList()}</ul>
        </DalbitScroll>
      </div>
    </div>
  );
};
