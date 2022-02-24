import React, { useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";

import { getBroadcastOption, deleteBroadcastOption, insertBroadcastOption, modifyBroadcastOption } from "common/api";

import "./index.scss";
import {setBroadcastOption} from "../../../../redux/actions/modal";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxSetToastStatus} from "../../../../redux/actions/globalCtx";
function BroadcastSettingWelcome() {
  const history = useHistory();
  const dispatch = useDispatch();

  const modalState = useSelector(({modalCtx}) => modalCtx);

  const [title, setTitle] = useState("");
  const [list, setList] = useState<Array<any>>([]);
  const [deleteIdx, setDeleteIdx] = useState(-1);
  const [fetching, setFetching] = useState(false);

  const insertTitle = useCallback(async () => {
    if (title === "" || title.length < 10) {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "인사말을 10자 이상 입력하세요.",
      }));
    } else {
      const res = await insertBroadcastOption({
        optionType: 2,
        contents: title,
      });
      if (res.result === "success") {
        setList(res.data.list);
        setTitle("");
      }
    }
  }, [title, list]);

  const deleteTitle = useCallback(async () => {
    const res = await deleteBroadcastOption({
      optionType: 2,
      idx: deleteIdx,
    });

    if (res.result === "success") {
      setTitle("");
      setList(res.data.list);
      setDeleteIdx(-1);
    }
  }, [deleteIdx, list]);

  const modifyTitle = useCallback(async () => {
    if (title === "" || title.length < 10) {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "인사말을 10자 이상 입력하세요.",
      }));
      return;
    }

    const res = await modifyBroadcastOption({
      optionType: 2,
      idx: deleteIdx,
      contents: title,
    });

    if (res.result === "success") {
      setList(res.data.list);
    }
  }, [title, deleteIdx, list]);

  const apply = useCallback(() => {
    const findItem = list.find((v) => {
      return v.idx === deleteIdx;
    });

    if (findItem) {
      dispatch(setBroadcastOption({
        ...modalState,
        welcome: findItem.contents,
      }));

      history.goBack();
    } else {
      dispatch(setGlobalCtxSetToastStatus({
        status: true,
        message: "적용할 인사말을 선택하세요.",
      }));
    }
  }, [deleteIdx, list]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBroadcastOption({
        optionType: 2,
      });

      if (res.result === "success") {
        setList(res.data.list);

        setFetching(true);
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
      <h3>인사말 설정</h3>
      {fetching === true && (
        <>
          <div className="title">
            <span>최대 3개까지 저장 가능</span>
            <span>
              <span className="bold">{title.length}</span> / 100
            </span>
          </div>
          <textarea
            placeholder={`${list.length === 3 ? "더이상 추가 등록은 되지 않습니다." : "내용을 입력해주세요"}`}
            value={title}
            disabled={list.length === 3 && deleteIdx === -1 && true}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
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
                등록 된 인사말<span>{list.length}</span>
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
        </>
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

export default React.memo(BroadcastSettingWelcome);
