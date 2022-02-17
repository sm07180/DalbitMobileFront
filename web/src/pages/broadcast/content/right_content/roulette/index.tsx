// React
import React, {useContext, useState, useEffect} from "react";

// Component
import RouletteEditTab from './roulette_tab_edit';
import "./index.scss";
import RouletteTabWin from "./roulette_tab_win";
import {getHistoryMiniGame, getRouletteWinList} from "../../../../../common/api";
import {MiniGameType} from "../../../constant";
import {useDispatch, useSelector} from "react-redux";
import {setBroadcastCtxMiniGameInfo, setBroadcastCtxRouletteHistory} from "../../../../../redux/actions/broadcastCtx";

type rouletteTabType = "editOption" | "winList";

export default function Roulette ({ roomNo }) {
  const dispatch = useDispatch();
  const broadcastState = useSelector(({broadcastCtx})=> broadcastCtx);

  // editTab
  const [price, setPrice] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [toggleCaption, setToggleCaption] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(true);
  const [createAuto, setCreateAuto] = useState<boolean>(false);

  const [rouletteTab, setRouletteTab] = useState<rouletteTabType>('editOption');

  /* 당첨 내역 */
  const getWinListData = async () => {
    const {result, data} = await getRouletteWinList({
      roomNo
    });

    const pagingSize = broadcastState.rouletteHistory.pagingSize;

    if(result === 'success') {
      dispatch(setBroadcastCtxRouletteHistory({
        ...broadcastState.rouletteHistory,
        currentPage: 1,
        allData: data.list,
        renderingData: data.list.slice(0, pagingSize),
        totalCnt: Number(data.totalCnt),
      }))
    }
  }

  const winListScrollPaging = () => {
    const winListInfo = broadcastState.rouletteHistory;
    const currentPage = winListInfo.currentPage;
    const allData = winListInfo.allData;
    const pagingSize = winListInfo.pagingSize;

    if(allData.length > currentPage * pagingSize) {
      dispatch(setBroadcastCtxRouletteHistory({
        ...broadcastState.rouletteHistory,
        currentPage: currentPage + 1,
        renderingData: allData.slice(0,(currentPage+1) * pagingSize)
      }));
    }
  };

  const setMiniGameInfo = (data) => dispatch(setBroadcastCtxMiniGameInfo(data));

  /* 룰렛설정 이전 정보 세팅 */
  const getMiniGameInfo = async () => {
    const {result, data} = await getHistoryMiniGame({
      roomNo,
      gameNo: MiniGameType.ROLUTTE,
    });

    if(result === 'success') {
      setMiniGameInfo({
        status: broadcastState.miniGameInfo.status,
        gameNo: MiniGameType.ROLUTTE,
        defaultSettingYn: 'y',
        ...data,
      });
    }
  }

  /* 돌림판을 돌리면 새로운 데이터를 추가한다 */
  const getWinList = async () => {
    const {result, data} = await getRouletteWinList({
      roomNo: broadcastState.roomInfo?.roomNo,
    });

    if(result === 'success') {
      const currentPage = broadcastState.rouletteHistory.currentPage;
      const pagingSize = broadcastState.rouletteHistory.pagingSize;
      dispatch(setBroadcastCtxRouletteHistory({
        ...broadcastState.rouletteHistory,
        allData: data.list,
        renderingData: data.list.slice(0, currentPage * pagingSize), // 마지막에 그려진 데이터는 지워지고 앞에 새로운 데이터가 그려진다
        totalCnt: Number(data.totalCnt),
      }));

    }
  }

  useEffect(() => {
    getWinListData();
    getMiniGameInfo();
  }, []);

  useEffect(() => {
    const gameInfo = broadcastState.miniGameInfo;
    if (gameInfo.status === true || gameInfo.defaultSettingYn === 'y') {
      setIsFree(gameInfo.isFree);
      setPrice(gameInfo.payAmt);
      setOptions([...gameInfo.optList]);
      setCreateAuto(gameInfo.autoYn === 'y');
    }
  }, [broadcastState.miniGameInfo]);

  useEffect(() => {
    if(broadcastState.roomInfo?.auth === 3 && broadcastState.miniGameResult.winListSelect) {
      getWinList();
    }
  }, [broadcastState.miniGameResult]);

  return (
    <div id="roulette">
      <RouletteTab rouletteTab={rouletteTab} setRouletteTab={setRouletteTab} />
      {rouletteTab === 'editOption' ?
        <RouletteEditTab roomNo={roomNo} dispatch={dispatch}
                         broadcastState={broadcastState} isFree={isFree} setIsFree={setIsFree}
                         price={price} setPrice={setPrice} options={options} setOptions={setOptions}
                         toggleCaption={toggleCaption} setToggleCaption={setToggleCaption}
                         createAuto={createAuto} setCreateAuto={setCreateAuto} setMiniGameInfo={setMiniGameInfo}
        />
        :
        <RouletteTabWin renderingData={broadcastState.rouletteHistory.renderingData}
                        totalCnt={broadcastState.rouletteHistory.totalCnt} winListScrollPaging={winListScrollPaging}
        />
      }
    </div>
  )
};

const RouletteTab = ({ rouletteTab, setRouletteTab }) => {
  return (
    <div className="rouletteTabWrap">
      <div className={`rouletteTabMenu ${rouletteTab === 'editOption' ? 'active' : ''}`}
           onClick={() => setRouletteTab('editOption')}
      >
        룰렛설정
      </div>
      <div className={`rouletteTabMenu ${rouletteTab === 'winList' ? 'active' : ''}`}
           onClick={() => setRouletteTab('winList')}
      >
        당첨내역
      </div>
    </div>
  )
}
