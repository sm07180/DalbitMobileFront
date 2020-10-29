import React, {useState, useReducer, createContext} from 'react'

const RankContext = createContext()
const {Provider} = RankContext

const reducer = (state, action) => {
  switch (action.type) {
    case 'PAGE_TYPE':
      return {
        ...state,
        pageType: action.val,
        page: 1
      }
    case 'RANK_TYPE':
      return {
        ...state,
        [state.pageType]: {
          rankType: action.val,
          dateType: 1,
          currentDate: new Date()
        },
        page: 1
      }
    case 'DATE_TYPE':
      return {
        ...state,
        [state.pageType]: {
          ...state[state.pageType],
          dateType: action.val.dateType,
          currentDate: action.val.date
        },
        page: 1
      }
    case 'DATE':
      return {
        ...state,
        [state.pageType]: {
          ...state[state.pageType],
          currentDate: action.val
        },
        page: 1
      }
    case 'PAGE':
      return {
        ...state,
        page: state.page + 1
      }
    case 'INIT':
      return {
        ...state,
        page: 1
      }
    case 'RESET':
      return {
        pageType: 'ranking',
        ranking: {
          rankType: 1,
          dateType: 1,
          currentDate: new Date()
        },
        fame: {
          rankType: 4,
          dateType: 1,
          currentDate: new Date()
        },
        page: 1
      }
    case 'SEARCH':
      return {
        pageType: 'ranking',
        ranking: {
          rankType: action.val.rankType,
          dateType: action.val.dateType,
          currentDate: action.val.currentDate
        },
        fame: {
          rankType: 4,
          dateType: 1,
          currentDate: new Date()
        },
        page: 1
      }
    default:
      return {
        ...state
      }
  }
}

const formInitData = {
  pageType: 'ranking',
  ranking: {
    rankType: 1,
    dateType: 1,
    currentDate: new Date()
  },
  fame: {
    rankType: 4,
    dateType: 1,
    currentDate: new Date()
  },
  page: 1
}

const pageInitData = {
  // rankType:
}

function RankProvider(props) {
  const [rankList, setRankList] = useState([])
  const [levelList, setLevelList] = useState([])
  const [likeList, setLikeList] = useState([])
  const [specialList, setSpecialList] = useState([])
  const [formState, formDispatch] = useReducer(reducer, formInitData)
  const [myInfo, setMyInfo] = useState({
    isReward: false,
    myGiftPoint: 0,
    myListenerPoint: 0,
    myRank: 0,
    myUpDown: '',
    myBroadPoint: 0,
    myLikePoint: 0,
    myPoint: 0,
    myListenPoint: 0,
    time: ''
  })
  const [totalPage, setTotalPage] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  const rankState = {
    rankList,
    formState,
    levelList,
    likeList,
    specialList,
    myInfo,
    totalPage,
    scrollY
  }

  const rankAction = {
    setRankList,
    formDispatch,
    setLevelList,
    setLikeList,
    setMyInfo,
    setTotalPage,
    setSpecialList,
    setScrollY
  }

  const bundle = {
    rankState,
    rankAction
  }

  return <Provider value={bundle}>{props.children}</Provider>
}

export {RankContext, RankProvider}
