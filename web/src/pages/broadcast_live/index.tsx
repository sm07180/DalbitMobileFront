import { broadcastList, splash } from "common/api";
import SelectBox from "common/ui/dalbit_selectbox";
import React, { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router-dom";
import "./boardcastLive.scss";

type ActionType = {
  type: string;
  idx?: number;
  val?: any;
};

type OrderType = {
  isOpen: boolean;
  selectIdx: any;
  boxList: Array<{ text: string; value: any }>;
};

const selectReducer = (state: OrderType, action: ActionType) => {
  switch (action.type) {
    case "open":
      return {
        ...state,
        isOpen: action.val,
      };

    case "select":
      return {
        ...state,
        selectIdx: action.idx || 0,
        isOpen: !state.isOpen,
      };

    case "init":
      return {
        ...state,
        boxList: action.val || [],
      };
    default:
      throw new Error();
  }
};

const linkInit = {
  isOpen: false,
  selectIdx: 0,
  boxList: [
    { value: 0, text: "전체" },
    { value: 1, text: "추천" },
    { value: 2, text: "인기" },
    { value: 3, text: "신입" },
    { value: 4, text: "좋아요" },
  ],
};

const categoryInit = {
  isOpen: false,
  selectIdx: 0,
  boxList: [{ value: "", text: "전체" }],
};

let timer;

export default function BroadcastList() {
  const [list, setList] = useState<Array<any>>([]);
  const history = useHistory();
  const [linkState, linkDispatch] = useReducer(selectReducer, linkInit);
  const [categoryState, categoryDispatch] = useReducer(selectReducer, categoryInit);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const fetchData = async (next: boolean) => {
    const res = await broadcastList({
      records: 10,
      page: page,
      searchType: linkState.boxList[linkState.selectIdx].value,
      roomType: categoryState.boxList[categoryState.selectIdx].value,
    });

    if (res.result === "success") {
      if (next === true) {
        setList(list.concat(res.data.list));
      } else {
        setList(res.data.list);
        setTotalPage(res.data.paging.totalPage);
      }
    }
  };

  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(function() {
      //스크롤
      const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      const windowBottom = windowHeight + window.pageYOffset;

      if (docHeight === windowBottom) {
        if (page < totalPage) {
          setPage(page + 1);
        }
      } else {
      }
    }, 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollEvtHdr);
    return () => {
      window.removeEventListener("scroll", scrollEvtHdr);
    };
  }, []);
  useEffect(() => {
    fetchData(false);
  }, [categoryState.selectIdx, linkState.selectIdx]);
  useEffect(() => {
    if (page !== 1) {
      fetchData(true);
    } else {
      fetchData(false);
    }
  }, [page]);

  useEffect(() => {
    const initCategoryList = async () => {
      const res = await splash();

      if (res.result === "success") {
        const categoryList = res.data.roomType.map((v) => {
          return {
            text: v.cdNm,
            value: v.cd,
          };
        });

        categoryList.unshift({
          value: "",
          text: "전체",
        });

        categoryDispatch({ type: "init", val: categoryList });
      }
    };
    initCategoryList();
  }, []);
  return (
    <div id="liveBox">
      <h2 className="pageTitle">실시간 라이브</h2>

      <div className="selectBox">
        <div className="selectBox__select">
          <SelectBox state={linkState} dispatch={linkDispatch} />
        </div>
        <div className="selectBox__select">
          <SelectBox state={categoryState} dispatch={categoryDispatch} />
        </div>
      </div>
      <ul className="liveListBox">
        {list.map((v, idx) => {
          return (
            <React.Fragment key={idx}>
              <li
                className="liveList"
                onClick={() => {
                  history.push(`/profile/${v.bjMemNo}`);
                }}
              >
                <div className="liveList__number">{idx + 1}</div>

                <img src={v.bjProfImg.thumb120x120} className="liveList__img" />

                <div className="liveList__idBox">
                  <div className="liveList__title">{v.title}</div>
                  <div className="liveList__id">{v.bjNickNm}</div>
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}
