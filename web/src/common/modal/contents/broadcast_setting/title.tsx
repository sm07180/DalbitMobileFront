import React, { useContext, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { getBroadcastOption, deleteBroadcastOption, insertBroadcastOption, modifyBroadcastOption } from "common/api";

import "./index.scss";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastOption} from "../../../../redux/actions/modal";
import {setGlobalCtxSetToastStatus} from "../../../../redux/actions/globalCtx";
function BroadcastSettingTitle() {
  const history = useHistory();
  const dispatch = useDispatch();

  const modalState = useSelector(({modalCtx}) => modalCtx);

  const [list, setList] = useState<Array<any>>([]);
  const [title, setTitle] = useState<string>("");
  const [deleteIdx, setDeleteIdx] = useState<number>(-1);

  const deleteTitle = useCallback(async () => {
    const res = await deleteBroadcastOption({
      optionType: 1,
      idx: deleteIdx,
    });

    if (res.result === "success") {
      setTitle("");
      setList(res.data.list);
      setDeleteIdx(-1);
    }
  }, [deleteIdx, list]);

  const modifyTitle = useCallback(async () => {
    if (title === "" || title.length < 2) {

      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "제목을 2자 이상 입력하세요.",
      }));
      return;
    }

    const res = await modifyBroadcastOption({
      optionType: 1,
      idx: deleteIdx,
      contents: title,
    });

    if (res.result === "success") {
      setList(res.data.list);
    }
  }, [deleteIdx, list, title]);

  const insertTitle = useCallback(async () => {
    if (title === "" || title.length < 2) {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "제목을 2자 이상 입력하세요.",
      }));
    } else {
      const res = await insertBroadcastOption({
        optionType: 1,
        contents: title,
      });
      if (res.result === "success") {
        setList(res.data.list);
        setTitle("");
      }
    }
  }, [title, list]);

  const apply = useCallback(() => {
    const findItem = list.find((v) => {
      return v.idx === deleteIdx;
    });

    if (findItem) {
      dispatch(setBroadcastOption({
        ...modalState,
        title: findItem.contents,
      }));
      history.goBack();
    } else {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "적용할 제목을 선택하세요.",
      }));
    }
  }, [deleteIdx, list]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBroadcastOption({
        optionType: 1,
      });

      if (res.result === "success") {
        setList(res.data.list);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      id="broadcastSettingTitleWrap"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <h3>제목 설정</h3>
      <div className="title">
        <span>최대 3개까지 저장 가능</span>
        <span>
          <span className="bold">{title.length}</span> / 20
        </span>
      </div>
      <textarea
        placeholder={`${list.length === 3 ? "더이상 추가 등록은 되지 않습니다." : "내용을 입력해주세요"}`}
        value={title}
        disabled={list.length === 3 && deleteIdx === -1 && true}
        onChange={(e) => {
          if (e.target.value.length <= 20) {
            setTitle(e.target.value);
          }
        }}
      />
      <div className="buttonWrap">
        {deleteIdx !== -1 && (
          <button className="buttonWrap__delete" onClick={deleteTitle}>
            삭제
          </button>
        )}
        {deleteIdx === -1 ? (
          <button
            className={`buttonWrap__add ${list.length === 3 && "disabled"}`}
            onClick={() => {
              if (list.length < 3) {
                insertTitle();
              }
            }}
          >
            등록
          </button>
        ) : (
          <button
            className={`buttonWrap__add`}
            onClick={() => {
              modifyTitle();
            }}
          >
            수정
          </button>
        )}

        {deleteIdx !== -1 && (
          <button
            className="buttonWrap__cancel"
            onClick={() => {
              setTitle("");
              setDeleteIdx(-1);
            }}
          >
            취소
          </button>
        )}
      </div>
      {list.length > 0 && (
        <div className="contentsWrap">
          <p>
            등록 된 제목<span>{list.length}</span>
          </p>
          {list.map((v, idx) => {
            return (
              <button
                key={idx}
                className={`${v.idx === deleteIdx && "on"}`}
                onClick={() => {
                  if (deleteIdx !== v.idx) {
                    setDeleteIdx(v.idx);
                    setTitle(v.contents);
                  }
                }}
              >
                {v.contents}
              </button>
            );
          })}
        </div>
      )}
      <div className="buttonBottomWrap">
        <button
          onClick={() => {
            history.goBack();
          }}
        >
          취소
        </button>
        <button className="on" onClick={apply}>
          적용
        </button>
      </div>
    </div>
  );
}

export default React.memo(BroadcastSettingTitle);
