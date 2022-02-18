import { createReducer } from "typesafe-actions";
import {ClipActions, ClipState} from "../../types/clipType";

const initialState:ClipState = {
    // 검색조건 1, 타입(주제)
    subjectType: [{
        cd: "clip_type",
        cdNm: "전체",
        value: "",
        sortNo: 0,
        isUse: 1,
        icon: 'ico_clipAll.png'
    }, {
        cd: "clip_type",
        cdNm: "커버",
        value: "01",
        sortNo: 1,
        isUse: 1,
        icon: 'ico_clipSong.png'
    }, {
        cd: "clip_type",
        cdNm: "작사/작곡",
        value: "02",
        sortNo: 2,
        isUse: 1,
        icon: 'ico_clipCompose.png'
    }, {
        cd: "clip_type",
        cdNm: "더빙",
        value: "03",
        sortNo: 3,
        isUse: 1,
        icon: 'ico_clipDubbing.png'
    }, {
        cd: "clip_type",
        cdNm: "수다/대화",
        value: "04",
        sortNo: 4,
        isUse: 1,
        icon: 'ico_clipChat.png'
    }, {
        cd: "clip_type",
        cdNm: "고민/사연",
        value: "05",
        sortNo: 5,
        isUse: 1,
        icon: 'ico_clipTrouble.png'
    }, {
        cd: "clip_type",
        cdNm: "힐링",
        value: "06",
        sortNo: 6,
        isUse: 1,
        icon: 'ico_clipHealing.png'
    }, {
        cd: "clip_type",
        cdNm: "성우",
        value: "07",
        sortNo: 7,
        isUse: 1,
        icon: 'ico_clipVoiceAct.png'
    }, {
        cd: "clip_type",
        cdNm: "ASMR",
        value: "08",
        sortNo: 8,
        isUse: 1,
        icon: 'ico_clipASMR.png'
    }],

    // 검색조건 1, 타입(주제)
    categoryType: [{
        index: 1,
        name: '최신순',
    },{
        index: 2,
        name: '인기순',
    },{
        index: 3,
        name: '선물순',
    },{
        index: 4,
        name: '재생순',
    },{
        index: 5,
        name: '스폐셜DJ',
    },{
        index: 6,
        name: '랜덤',
    }],

    // 검색조건 2, 타입(기간)
    termType: [{
        index: 0,
        name: '전체 기간',
    },{
        index: 1,
        name: '1일',
    },{
        index: 2,
        name: '1주일',
    }],
};

const clip = createReducer<ClipState>(initialState,{

});


export default clip;