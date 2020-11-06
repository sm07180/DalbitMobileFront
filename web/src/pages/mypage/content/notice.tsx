// Api
import { deleteMypageNotice, getMypageNotice, modifyMypageNotice, postMypageNotice } from "common/api";
// Modules : CheckBox , pagenation
import DalbitCheckbox from "common/ui/dalbit_checkbox";
import Pagenation from "common/ui/pagenation/Pagenation";
import { GlobalContext } from "context/global_ctx";
// context
import { MypageContext } from "context/mypage_ctx";
import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
// router
import { useParams } from "react-router-dom";
import { DalbitTextArea } from "common/ui/dalbit_textarea";
import NoResult from "common/ui/no_result";
// scss
import "../../notice.scss";

// ----------------------------------------------------------------------
export default function Notice() {
  //context
  const { MypageState, MypageAction } = useContext(MypageContext);
  const { globalState, globalAction } = useContext(GlobalContext);
  // location
  const { memNo } = useParams<{ memNo: string }>();
  const yourMemNo = memNo;
  // module state
  const [check, setCheck] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // state
  const [noticeList, setNoticeList] = useState([
    {
      title: "",
      isTop: false,
      writeDt: "",
      contents: "",
      noticeIdx: 0,
    },
  ]);
  //클릭 해당 공지사항 인덱스 state
  const [noticeIndexCheck, setNoticeIndexCheck] = useState<Number>(0);
  //토글 공지사항
  const [noticeToggle, setNoticeToggle] = useState<boolean>(false);
  //공지사항 작성 내용
  const [titlevalue, setTitleValue] = useState<any>("");
  //공지사항 작성 스티키
  const [isTop, setIsTop] = useState<boolean>(false);
  const [contentvalue, setContentValue] = useState<any>("");
  //공지사항 작성 토글
  const [registToggle, setRegistToggle] = useState<boolean>(false);
  //공지사항 수정 토글
  const [modifyToggle, setModiftyToggle] = useState<boolean>(false);
  //공지사항 이니셜 수정 컨텐츠
  const [modifyItem, setModiftItem] = useState<any>({
    Modifytitle: "",
    ModifyIsTop: false,
    Modifycontents: "",
  });
  //공지사항 수정된 타이틀
  const [modiTitle, setModititle] = useState<string>(modifyItem.Modifytitle);
  //공지사항 수정된 컨텐츠
  const [modiContent, setModContent] = useState<string>(modifyItem.Modifycontents);
  //공지사항 수정 공통 인덱스
  const [modifyIndex, setModifyIndex] = useState<number>(0);
  //공지사항 수정된 스티키
  const [modiSticky, setModiSticky] = useState<boolean>(modifyItem.ModifyIsTop);
  // 토탈페이지
  const [totalPage, setTotalPage] = useState<number>(0);

  const TextAreaRef = useRef<any>(null);
  //Api
  //마이페이지 공지사항 조회
  async function GetNotice() {
    const { result, data } = await getMypageNotice({
      memNo: yourMemNo,
      page: currentPage,
      records: 10,
    });
    if (result === "success") {
      setNoticeList(data.list);
      if (data.paging) {
        setTotalPage(data.paging.totalPage);
      }
    }
  }
  //공지사항 등록
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContentValue("");
    setTitleValue("");
    async function AddNotice() {
      const { result, data } = await postMypageNotice({
        memNo: yourMemNo,
        title: titlevalue,
        contents: contentvalue,
        isTop: isTop,
      });
      if (result === "success") {
        GetNotice();
        setRegistToggle(false);
        setIsTop(false);
        setCheck(false);
      }
    }
    AddNotice();
  };
  //공지사항 삭제
  const DeleteNotice = (noticeIdx: number) => {
    async function DeleteNoiceContent() {
      const { result, data } = await deleteMypageNotice({
        memNo: yourMemNo,
        noticeIdx: noticeIdx,
      });
      if (result === "success") {
        GetNotice();
      }
    }
    DeleteNoiceContent();
  };
  //공지사항 수정등록
  const ModionSubmit = () => {
    async function ModiRegistNotice() {
      const { result, data } = await modifyMypageNotice({
        memNo: yourMemNo,
        noticeIdx: modifyIndex,
        contents: modiContent,
        title: modiTitle,
        isTop: check,
      });
      if (result === "success") {
        GetNotice();
        setModiftyToggle(false);
      }
    }
    ModiRegistNotice();
  };
  //function--------------------------------------------------------------------------
  //체크박스
  const changeCheckStatus = useCallback(() => {
    const checked = check === true ? false : true;
    setCheck(checked);
    setTimeout(() => {
      if (check === true) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    }, 10);
  }, [check]);
  //타임포맷팅
  const timeFormat = (strFormatFromServer: string) => {
    let date = strFormatFromServer.slice(0, 8);
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join(".");
    let time = strFormatFromServer.slice(8, 12);
    time = [time.slice(0, 2), time.slice(2, 4)].join(":");
    return `${date} ${time}`;
  };
  //클릭 토글 공지사항 인덱스 이벤트
  const toggleNotice = (noticeIdx: number) => {
    setNoticeToggle(false);
    if (noticeIdx === noticeIndexCheck) {
      setNoticeIndexCheck(0);
    } else {
      setNoticeIndexCheck(noticeIdx);
    }
  };
  //공지사항 토글
  const toggleNoticeFunc = () => {
    if (noticeToggle === true) {
      setNoticeToggle(false);
    } else {
      setNoticeToggle(true);
    }
  };
  //공지사항 등록 취소
  const Cancel = () => {
    setCheck(false);
    setIsTop(false);
    setContentValue("");
    setTitleValue("");
    setRegistToggle(false);
  };
  //공지사항 수정체인징
  const ModifyNotice = (noticeIdx: number, title: string, isTop: boolean, contents: string) => {
    setTimeout(() => {
      setNoticeIndexCheck(0);
      setModiftyToggle(true);
      setModifyIndex(noticeIdx);
      setModiftItem({
        Modifytitle: title,
        ModifyIsTop: isTop,
        Modifycontents: contents,
      });
      setModititle(title);
      setModContent(contents);
      setModiSticky(isTop);
    }, 10);
    if (isTop === true) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  };
  //공지사항 수정취소
  const ModifyCancel = () => {
    setModiftyToggle(false);
  };
  //수정하기 온체인지 : 타이틀
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length > 20) return;
    if (modiTitle !== "" || modiTitle !== undefined) {
      setModititle(value);
    } else if (modiTitle === "" || modiTitle === undefined) {
      setModititle(modifyItem.Modifytitle);
    }
  };
  //수정하기 온체인지 :본문
  const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    const lines = value.split("\n").length;
    if (lines < 11) {
      if (modiContent !== "" || modiContent !== undefined) {
        setModContent(value);
      } else if (modiContent === "" || modiContent === undefined) {
        setModContent(modifyItem.Modifycontents);
      }
    } else {
      return false;
    }
  };
  //공지등록버튼 토글
  const RegistBtnToggle = () => {
    if (registToggle) {
      setRegistToggle(false);
    } else {
      setRegistToggle(true);
    }
  };
  //공지등록 본문 온체인지
  const TextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let { value } = e.target;
    const lines = value.split("\n").length;
    const a = value.split("\n");
    const cols = 50;
    if (lines < 11) {
      if (a[lines - 1].length % cols === 0 && a[lines - 1].length > 0) {
        value += "\n";
      } else if (a[lines - 1].length > cols) {
        const b = a[lines - 1].substr(0, cols) + "\n" + a[lines - 1].substr(cols, a[lines - 1].length - 1);
        a.pop();
        value = a.join("\n") + "\n" + b;
      }
      setContentValue(value);
    } else if (lines > 10) {
      return;
    }
  };

  const test = (e: any) => {
    const { value } = e.target;
    if (value.length > 500) return;
    setContentValue(e.target.value);
  };

  //-----------------------------------------------------------
  useEffect(() => {
    GetNotice();
  }, [yourMemNo, currentPage]);
  //-----------------------------------------------------------
  const titleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length > 20) return;
    setTitleValue(value);
  };
  return (
    <div className="notice">
      <div className="noticeInfo">
        <h2 className="headtitle">방송공지</h2>
        {globalState.baseData.memNo === yourMemNo && (
          <button
            onClick={RegistBtnToggle}
            className={registToggle === true ? `noticeWriter noticeWriter--active` : `noticeWriter`}
          >
            <span className="noticeButton">공지 작성하기</span>
          </button>
        )}
      </div>
      {/*공지사항작성영역*/}
      {registToggle === true && (
        <div className="writeWrapper">
          <form className="writeWrapper__form">
            <h2 className="writeTitle">공지사항 작성</h2>
            <input
              value={titlevalue}
              placeholder="공지사항 제목을 입력해주세요"
              className="writeWrapper__titleInput"
              onChange={(e) => titleOnchange(e)}
            />
            <textarea
              // ref={TextAreaRef}
              value={contentvalue}
              onChange={(e) => test(e)}
              className="writeWrapper__contentTextarea"
              placeholder="작성하고자 하는 글의 내용을 입력해주세요."
            />
          </form>
          <div className="writeController">
            <label className="writeController__checkLabel">
              <DalbitCheckbox callback={changeCheckStatus} status={check} />
              <span className="writeController__labelTxt">고정 공지사항</span>
            </label>
            <div className="writeController__btnWrapper">
              <button onClick={Cancel} className="writeWrapper__btn writeWrapper__btn__cancel">
                취소
              </button>
              <button onClick={onSubmit} className="writeWrapper__btn">
                등록
              </button>
            </div>
          </div>
        </div>
      )}
      {/*공지사항수정영역*/}
      {modifyToggle === true && (
        <div className="writeWrapper">
          <form className="writeWrapper__form">
            <h2 className="writeTitle">공지사항 수정</h2>
            <input
              placeholder="공지사항 제목을 입력해주세요"
              onChange={onChangeTitle}
              value={modiTitle}
              className="writeWrapper__titleInput"
            />
            <textarea
              value={modiContent}
              placeholder="공지사항 내용을 입력해주세요"
              onChange={onChangeContent}
              className="writeWrapper__contentTextarea"
            />
          </form>
          <div className="writeController">
            <label className="writeController__checkLabel">
              <DalbitCheckbox callback={changeCheckStatus} status={check} />
              <span className="writeController__labelTxt">고정공지사항</span>
            </label>

            <div className="writeController__btnWrapper">
              <button onClick={ModifyCancel} className="writeWrapper__btn writeWrapper__btn__cancel">
                취소
              </button>
              <button onClick={ModionSubmit} className="writeWrapper__btn">
                수정
              </button>
            </div>
          </div>
        </div>
      )}
      {/*공지사항리스트영역*/}

      <ul className="noticeList">
        {noticeList !== [] &&
          noticeList.map((item, index) => (
            <li key={index} className="noticeItem">
              <div
                onClick={() => toggleNotice(item.noticeIdx)}
                className={item.noticeIdx === noticeIndexCheck ? "noticeItem__Info noticeItem__Info--active" : "noticeItem__Info"}
              >
                {item.isTop === true && <span className="noticeItem__icon">필독</span>}
                <span className={item.isTop === true ? "noticeItem__title noticeItem__title--active" : "noticeItem__title"}>
                  {item.title}
                </span>
                <span className="noticeItem__date">{timeFormat(item.writeDt)}</span>
              </div>
              {item.noticeIdx === noticeIndexCheck && (
                <div className="noticeSubject">
                  {yourMemNo === globalState.baseData.memNo && <button onClick={toggleNoticeFunc} className="moreBtn" />}
                  {noticeToggle === true && (
                    <div className="moreBox">
                      <button
                        onClick={() => ModifyNotice(item.noticeIdx, item.title, item.isTop, item.contents)}
                        className="moreBox__list"
                      >
                        수정하기
                      </button>
                      <button onClick={() => DeleteNotice(item.noticeIdx)} className="moreBox__list">
                        삭제하기
                      </button>
                    </div>
                  )}
                  <div className="noticeSubject__content">
                    <span className="noticeSubject__title">{item.title}</span>
                    <pre className="noticeSubject__innerTxt">{item.contents}</pre>
                  </div>
                </div>
              )}
            </li>
          ))}
      </ul>
      {totalPage !== 0 && noticeList.length !== 0 && (
        <Pagenation
          setPage={(param) => {
            setCurrentPage(param);
          }}
          currentPage={currentPage}
          totalPage={totalPage}
          count={5}
        />
      )}
    </div>
  );
}
