import React, {useState, useReducer, createContext} from 'react'

const ClipRankContext = createContext()
const {Provider} = ClipRankContext
import {convertDateFormat} from 'components/lib/dalbit_moment'
import {convertMonday} from "pages/common/rank/rank_fn";
import {DATE_TYPE} from 'pages/clip_rank/constant'

const reducer = (state, action) => {
  switch (action.type) {
    case 'DATE_TYPE':
      return {
        ...state,
        dateType: action.val,
        rankingDate:
          convertDateFormat((() => {
            switch (action.val) {
              case DATE_TYPE.DAY:
                return new Date();
              case DATE_TYPE.WEEK:
                return convertMonday();
              default:
                return new Date();
            }
          })(), 'YYYY-MM-DD'),
        page: 1
      }
      case 'CHANGE_DATE':
        return {
          ...state,
          rankingDate: action.val,
          page: 1
        }
    default:
      return {
        ...state
      }
  }
}


const formInitData = {
  dateType: DATE_TYPE.DAY,
  rankingDate: convertDateFormat(new Date(), 'YYYY-MM-DD'),
  page: 1
}

function ClipRankProvider(props) {
  const [clipRankList, setClipRankList] = useState([]);
  const [myInfo, setMyInfo] = useState([])
  const [formState, formDispatch] = useReducer(reducer, formInitData)
  const [winnerRankMsgProf, setWinnerRankMsgProf] = useState([])

  const clipRankState = {
    clipRankList,
    winnerRankMsgProf,
    myInfo,
    formState,
  }

  const clipRankAction = {
    setClipRankList,
    setWinnerRankMsgProf,
    setMyInfo,
    formDispatch,
  }

  const bundle = {
    clipRankState,
    clipRankAction
  }

  return <Provider value={bundle}>{props.children}</Provider>
}

export {ClipRankContext, ClipRankProvider}
