import React, { createContext, useState, useReducer } from "react";

type StatusType = {
  invite: boolean; // 초대
  inviteCancle: boolean; // 초대취소
  accept: boolean; // 수락
  reject: boolean; // 거절
  apply: boolean; // 신청
  exit: boolean; // 퇴장
  applyCancle: boolean; // 신청취소
  connect: boolean; // 연결
  end: boolean; // 종료
};

type StateType = {
  newApplyGuest: boolean;
  inviteGuest: boolean;
  guestObj: any;
  guestStatus: StatusType;
  guestConnectStatus: boolean;
  disConnectMemNo: string;
};

type ActionType = {
  setNewApplyGuest?(data: boolean): void;
  setInviteGuest?(data: boolean): void;
  dispatchGuestObj?(action: { type: string; data?: any }): void;
  dispatchStatus?(data: any): void;
  setGuestConnectStatus?(data: boolean): void;
  setGuestInfo?(data: any): void;
  setDisConnectMemNo?(data: string): void;
};

type BundleType = {
  guestState: StateType;
  guestAction: ActionType;
};

const initialData = {
  guestState: {
    newApplyGuest: false,
    inviteGuest: false,
    guestObj: null,
    guestStatus: {
      invite: false, // 초대
      inviteCancle: false, // 초대취소
      accept: false, // 수락
      reject: false, // 거절
      apply: false, // 신청
      exit: false, // 퇴장
      applyCancle: false, // 신청취소
      connect: false, // 연결
      end: false, // 종료
    },
    guestConnectStatus: false,
    disConnectMemNo: "",
  },
  guestAction: {},
};

function guestObjReducer(state: any, action: { type: string; data: any }) {
  const { type, data } = action;

  switch (type) {
    case "INIT": {
      return null;
    }

    case "ADD": {
      return {
        ...state,
        [data.memNo]: data,
      };
    }

    case "REMOVE": {
      if (state[data.memNo]) {
        delete state[data.memNo];
      }

      if (Object.keys(state).length === 0) {
        return null;
      } else {
        return {
          ...state,
        };
      }
    }

    default: {
      return state;
    }
  }
}

function statusReducer(state: StatusType, action: any): StatusType {
  switch (action.type) {
    case "INIT":
      Object.keys(state).forEach((v) => {
        state[v] = false;
      });
      return {
        ...state,
      };
    case action.type:
      Object.keys(state).forEach((v) => {
        if (v === action.type) {
          state[v] = true;
        } else {
          state[v] = false;
        }
      });
      return {
        ...state,
      };
    default:
      return state;
  }
}

const GuestContext = createContext<BundleType>(initialData);

function GuestProvider(props: { children: JSX.Element }) {
  const [newApplyGuest, setNewApplyGuest] = useState(initialData.guestState.newApplyGuest);
  const [inviteGuest, setInviteGuest] = useState(initialData.guestState.inviteGuest);
  const [guestObj, dispatchGuestObj] = useReducer(guestObjReducer, initialData.guestState.guestObj);
  const [guestStatus, dispatchStatus] = useReducer(statusReducer, initialData.guestState.guestStatus);
  const [guestConnectStatus, setGuestConnectStatus] = useState(initialData.guestState.guestConnectStatus);
  const [disConnectMemNo, setDisConnectMemNo] = useState(initialData.guestState.disConnectMemNo);
  const guestState: StateType = {
    newApplyGuest,
    inviteGuest,
    guestObj,
    guestStatus,
    guestConnectStatus,
    disConnectMemNo,
  };

  const guestAction: ActionType = {
    setNewApplyGuest,
    setInviteGuest,
    dispatchGuestObj,
    dispatchStatus,
    setGuestConnectStatus,
    setDisConnectMemNo,
  };

  const bundle: BundleType = {
    guestState,
    guestAction,
  };

  return <GuestContext.Provider value={bundle}>{props.children}</GuestContext.Provider>;
}

export { GuestContext, GuestProvider };
