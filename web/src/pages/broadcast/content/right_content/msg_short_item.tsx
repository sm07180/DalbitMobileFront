import React, { useRef, useEffect } from "react";

function MsgContent(props) {
  const TextAreaRef = useRef<any>(null);
  const { item, idx, dispatch, state, modifyState } = props;

  useEffect(() => {
    if (TextAreaRef.current) {
      if (TextAreaRef.current.scrollHeight >= 36) {
        TextAreaRef.current.style.height = "0";
        TextAreaRef.current.style.height = TextAreaRef.current.scrollHeight + "px";
      } else {
        TextAreaRef.current.style.height = "24px";
      }
    }
  }, [state[idx].text]);

  return (
    <>
      <div className="msgContents__header">
        퀵 메시지 <span className="msgContents__header--count">{idx + 1}</span>
        <div className="msgContents__header--buttonWrap">
          <button className="msgContents__header--button" onClick={() => modifyState(idx)}>
            저장
          </button>
        </div>
      </div>
      <div>
        <div className="msgContents__contents">
          <span className="msgContents__contents--inputTitle">명령어</span>
          <input
            value={item.order}
            onChange={(e) => {
              if (e.target.value.length <= 2) {
                dispatch({ type: "order", val: e.target.value, idx: idx });
              }
            }}
          />
        </div>
        <div className="msgContents__contents">
          <span className="msgContents__contents--title">내용</span>
          <textarea
            ref={TextAreaRef}
            value={item.text}
            onChange={(e) => {
              if (e.target.value.length <= 200) dispatch({ type: "text", val: e.target.value, idx: idx });
            }}
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(MsgContent);
