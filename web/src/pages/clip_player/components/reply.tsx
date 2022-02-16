import React, { useState, useCallback, useContext, useEffect } from "react";

import { DalbitScroll } from "common/ui/dalbit_scroll";
import { ClipContext } from "context/clip_ctx";
import ReplyItem from "./reply_item";

import { getClipReplyList, postClipReplyAdd, postClipReplyEdit } from "common/api";

import { tabType } from "../constant";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus, setGlobalCtxClipInfoAdd} from "../../../redux/actions/globalCtx";

export default (props) => {
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();
  const { clipState, clipAction } = useContext(ClipContext);
  const [registToggle, setRegistToggle] = useState<boolean>(false);
  const [contentValue, setContentValue] = useState("");
  const [replyList, setReplyList] = useState([]);
  const [replyPaging, setReplyPaging] = useState({
    total: 0,
  });

  const [replyIdx, setReplyIdx] = useState(-1);

  const SubmitTextChange = useCallback(
    (e) => {
      const { value } = e.target;
      const lines = value.split("\n").length;
      if (value.length > 100) return false;
      if (lines < 11) {
        setContentValue(value);
      } else {
        return false;
      }
    },
    [contentValue, replyIdx]
  );

  const RegistBtnToggle = () => {
    if (registToggle) {
      clipAction.setClipReplyIdx!(0);
      setRegistToggle(false);
      setContentValue("");
      setReplyIdx(-1);
    } else {
      setRegistToggle(true);
      setContentValue("");
      setReplyIdx(-1);
    }
  };

  async function fetchReplyList() {
    const { result, data, message } = await getClipReplyList({
      clipNo: globalState.clipInfo?.clipNo,
      records: 100,
    });
    if (result === "success") {
      setReplyList(data.list);
      setReplyPaging(data.paging);
      if (data.paging) {
        dispatch(setGlobalCtxClipInfoAdd({replyCnt: data.paging.total}))
      }
    } else {
      dispatch(setGlobalCtxAlertStatus({
        status: true,
        type: "alert",
        content: message,
        callback: () => {},
      }));
    }
  }

  const replyAdd = () => {
    async function fetchReplyAdd() {
      const { result, data, message } = await postClipReplyAdd({
        clipNo: globalState.clipInfo?.clipNo,
        contents: contentValue,
      });
      if (result === "success") {
        setRegistToggle(false);
        clipAction.setClipReplyIdx!(0);
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message,
          callback: () => {},
        }));
      }
    }
    fetchReplyAdd();
  };

  const replyEdit = (replyValue) => {
    setRegistToggle(true);
    setReplyIdx(replyValue.replyIdx);
    setContentValue(replyValue.contents);
  };

  const replyEditBtn = () => {
    async function fetchReplyEdit() {
      const { result, data, message } = await postClipReplyEdit({
        clipNo: globalState.clipInfo?.clipNo,
        replyIdx: replyIdx,
        contents: contentValue,
      });

      if (result === "success") {
        setReplyIdx(-1);
        clipAction.setClipReplyIdx!(0);
        setRegistToggle(false);
      } else {
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          type: "alert",
          content: message,
          callback: () => {},
        }));
      }
    }
    fetchReplyEdit();
  };

  useEffect(() => {
    if (registToggle === false) {
      fetchReplyList();
    }
  }, [registToggle]);

  return (
    <div className="tabReplyList">
      <h2 className="tabContent__title">{replyIdx !== -1 ? "댓글 수정" : "클립 댓글"}</h2>
      <button
        type="button"
        onClick={RegistBtnToggle}
        className={registToggle ? `tabContent__btnWrite tabContent__btnWrite--active` : `tabContent__btnWrite`}
      >
        {registToggle ? "취소" : "쓰기"}
      </button>

      <div className="replyLisWrap">
        <DalbitScroll width={362}>
          {registToggle ? (
            <div className="replyWriteBox">
              <textarea
                value={contentValue}
                placeholder="내용을 입력해주세요. "
                onChange={SubmitTextChange}
                className="replyWriteBox__textarea"
              />

              <p className="replyWriteBox__textCount">
                <span className="replyWriteBox__textCount--active">{contentValue.length}</span> / 100
              </p>

              <button
                type="button"
                className={`replyWriteBox__btnApply replyWriteBox__btnApply${contentValue.length > 2 ? "--active" : ""}`}
                onClick={() => {
                  if (replyIdx !== -1) {
                    replyEditBtn();
                  } else {
                    replyAdd();
                  }
                }}
              >
                {replyIdx !== -1 ? "수정" : "등록"}
              </button>
            </div>
          ) : (
            <div className="replyListBox">
              {replyList.length > 0 ? (
                <>
                  <p className="replyListBox__total">
                    댓글 <span className="replyListBox__total--num">{replyPaging && replyPaging.total}</span>
                  </p>

                  <ul className="replyListItemWrap">
                    {replyList.map((value, idx) => {
                      return (
                        <li className="replyListItem" key={idx}>
                          <ReplyItem replyValue={value} fetchReplyList={fetchReplyList} replyEdit={replyEdit} />
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <>
                  <p className="replyListBox__noReply">등록된 클립 댓글이 없습니다.</p>
                </>
              )}
            </div>
          )}
        </DalbitScroll>
      </div>
    </div>
  );
};
