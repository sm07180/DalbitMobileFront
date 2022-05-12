import { API_SERVER, PAY_SERVER, PHOTO_SERVER } from "constant/define";
import { getCookie, setCookie } from "common/utility/cookie";
import API from "../context/api";

type headerType = {
  authToken: string;
  "custom-header": string;
  "Content-Type": string;
};

type fetchOption = {
  method: string;
  headers?: headerType;
  body?: string | FormData;
};

type responseType = {
  result: string;
  data: any;
  message: string;
  code: string;
};

type dataType = {
  [key: string]: any;
};

enum HttpStatus {
  OK = 200,
  NotModified = 304,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}

enum Method {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

type newResponseType = {
  code: string;
  data: any;
  message: string;
};

const ajax = async (method: Method, path: string, data?: dataType) => {
  const createDeviceUUid = () => {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };
  let deviceUUid = getCookie("deviceUUid");
  if (deviceUUid === null || deviceUUid === undefined || deviceUUid === "") {
    deviceUUid = createDeviceUUid();
  }
  setCookie("deviceUUid", deviceUUid, 60);

  // Set Header
  const headers: headerType = {
    authToken: API.authToken || '',
    'custom-header': API.customHeader || '',
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  };
  const option: fetchOption = { method };
  option["headers"] = headers;
  option["credentials"] = "include";

  let url: string = (() => {
    if (path.includes("/rest/pay/")) {
      return PAY_SERVER + path;
    }
    return API_SERVER + path;
  })();

  if (data !== undefined) {
    if (method === Method.GET) {
      let queryString = "?";
      Object.keys(data).forEach((key, i, self) => {
        if (self.length === i + 1) {
          queryString += `${key}=${data[key]}`;
        } else {
          queryString += `${key}=${data[key]}&`;
        }
      });
      url += queryString;
    } else {
      const formData = new FormData();
      delete headers["Content-Type"];
      if (path.includes("/photo/chat")) url = PHOTO_SERVER + path;
      if (path.includes("/upload")) {
        url = PHOTO_SERVER + path;
        // headers["Content-Type"] = "multipart/form-data";
        if (path.includes("/file")) {
          formData.append("file", data.file);
        } else {
          formData.append("dataURL", data.dataURL);
        }
        formData.append("uploadType", data.uploadType);
        option["body"] = formData;
      } else {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
      }
      option["body"] = formData;
    }
  }

  return await fetch(url, option).then((res) => {
    if (res.status === HttpStatus.OK) {
      return res.json();
    }
    return {
      result: "fail",
      data: null,
    };
  });
};

export async function splash(): Promise<responseType> {
  return await ajax(Method.GET, "/splash");
}

export async function getTokenAndMemno(): Promise<responseType> {
  return await ajax(Method.GET, "/token");
}

export async function getMain(): Promise<responseType> {
  return await ajax(Method.GET, "/main");
}

export async function getProfile(data: {
  memNo: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/profile", data);
}

export async function getItems(): Promise<responseType> {
  return await ajax(Method.GET, "/items");
}

export async function postLogin(data: {
  memType: string;
  memId: string;
  memPwd: string;
  room_no: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/member/login", data);
}

export async function postLogout(): Promise<responseType> {
  const res = await ajax(Method.POST, "/member/logout");
  return res;
}
export async function getNewAlarm(): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/newalarm");
}
export async function getMypageNew(data: dataType): Promise<responseType> {
  let mypageNewStg: any;
  mypageNewStg = localStorage.getItem("mypageNew");
  let mypageNew = {
    fanBoard: 0,
    dal: 0,
    byeol: 0,
    notice: "",
    qna: "",
    targetMemNo: data.data,
  };
  if (
      mypageNewStg !== undefined &&
      mypageNewStg !== null &&
      mypageNewStg !== ""
  ) {
    mypageNewStg = JSON.parse(mypageNewStg);
    if (
        mypageNewStg.fanBoard !== undefined &&
        mypageNewStg.fanBoard !== null &&
        mypageNewStg.fanBoard !== ""
    ) {
      mypageNew.fanBoard = mypageNewStg.fanBoard;
    }
    if (
        mypageNewStg.dal !== undefined &&
        mypageNewStg.dal !== null &&
        mypageNewStg.dal !== ""
    ) {
      mypageNew.dal = mypageNewStg.dal;
    }
    if (
        mypageNewStg.byeol !== undefined &&
        mypageNewStg.byeol !== null &&
        mypageNewStg.byeol !== ""
    ) {
      mypageNew.byeol = mypageNewStg.byeol;
    }
    if (
        mypageNewStg.notice !== undefined &&
        mypageNewStg.notice !== null &&
        mypageNewStg.notice !== ""
    ) {
      mypageNew.notice = mypageNewStg.notice.join(",");
    }
    if (
        mypageNewStg.qna !== undefined &&
        mypageNewStg.qna !== null &&
        mypageNewStg.qna !== ""
    ) {
      mypageNew.qna = mypageNewStg.qna.join(",");
    }
  }
  mypageNew.targetMemNo = data.data;
  if(typeof mypageNew.fanBoard !== 'number') {
    mypageNew.fanBoard = 0;
  }
  return await ajax(Method.POST, "/mypage/new", mypageNew);
}

export async function signup(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/member/signup", data);
}

export async function postPwdChange(data: {
  memId: string;
  memPwd: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/member/pwd", data);
}

export async function postImage(data: {
  dataURL: string | ArrayBuffer;
  uploadType: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/upload", data);
}

export async function getRankList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, `/rank/${data.type}`, data);
}

export async function getRankTimeList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, `/time/rank`, data);
}

export async function getRankReward(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/rank/reward/popup", data);
}

export async function postRandomboxReward(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/rank/randombox", data);
}

export async function getSpecialPoint(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/member/special/point/list", data);
}

export async function getMyStar(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/profile/star/list/new", data);
}
/*
방송방 리스트 & sorting
searchType //-1,0 or null:전체,1:추천,2:인기,3:신입
*/

export async function broadcastList(data: {
  searchType?: number;
  mediaType?: string;
  roomType?: string;
  page: number;
  records: number;
  search?: any;
  djType?: any;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/list", data);
}

export async function broadcastJoin(data: {
  roomNo: string;
  shadow: number;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/vw/join", data);
}

export async function broadcastExit(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.DELETE, "/broad/exit", data);
}

export async function broadcastInfo(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/info", data);
}

export async function broadcastInfoNew(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/vw/info", data);
}
export async function broadcastNomalize(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/vw/normalize", data);
}

export async function broadcastEdit(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/broad/edit", data);
}

export async function broadcastAllExit(): Promise<responseType> {
  return await ajax(Method.POST, "/member/reset/listen");
}

export async function broadcastCreate(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/broad/vw/create", data);
}

export async function broadcastCheck(): Promise<responseType> {
  return await ajax(Method.GET, "/broad/check");
}

export async function broadcastContinue(): Promise<responseType> {
  return await ajax(Method.POST, "/broad/vw/continue");
}

export async function broadcastRetoken(data: {
  roomNo: string;
  state: number;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/reToken", data);
}

/* broadcast feature api */
export async function broadcastLike(data: {
  roomNo: string;
  memNo: string; //bj MemNo
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/likes", data);
}

export async function broadcastShare(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/share", data);
}

export async function modifyBroadcastState(data: {
  roomNo: string;
  mediaState: string;
  mediaOn: boolean;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/state/edit", data);
}

export async function getBroadcastListeners(data: {
  roomNo: string;
  page: number;
  records: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/listeners", data);
}

export async function getBroadcastMemberInfo(data: {
  memNo: string;
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/member/profile", data);
}

export async function broadKickOut(data: {
  roomNo: string;
  blockNo: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/kickout", data);
}

export async function broadManagerSet(data: {
  roomNo: string;
  memNo: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/manager", data);
}

export async function broadManagerDelete(data: {
  roomNo: string;
  memNo: string;
}): Promise<responseType> {
  return await ajax(Method.DELETE, "/broad/manager", data);
}

export async function getBroadcastGiftList(data: {
  roomNo: string;
  page: number;
  records: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/history", data);
}

export async function getBroadcastBoost(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/boost", data);
}

export async function postBroadcastBoost(data: {
  roomNo: string;
  itemNo: string;
  itemCnt: number;
  isItemUse: boolean;
  memNo: string;  //bjMemNo
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/boost", data);
}

export async function postBroadcastRoomExtend(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/extend", data);
}

export async function getNoticeList(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/notice", data);
}
export async function postNoticeWrite(data: {
  roomNo: string;
  notice: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/notice", data);
}
export async function deleteNoticeWrite(data: {
  roomNo: string;
  notice: string;
}): Promise<responseType> {
  return await ajax(Method.DELETE, "/broad/notice", data);
}
export async function postStory(data: {
  roomNo: string;
  contents: string;
  djMemNo?: string;
  plusYn?: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/story", data);
}
export async function deleteStory(data: {
  roomNo: string;
  storyIdx: number;
}): Promise<responseType> {
  return await ajax(Method.DELETE, "/broad/story", data);
}
export async function getStory(data: {
  roomNo: string;
  page?: number;
  records?: number;
  plusYn?: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/story", data);
}
export async function getLikeList(data: {
  roomNo: string;
  records: number;
  page: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/good/history", data);
}
export async function postSendGift(data: {
  roomNo: string;
  memNo: string;
  itemNo: string;
  itemCnt: number;
  isSecret: boolean;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/gift", data);
}

export async function guestManagement(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/broad/guest/management", data);
}

export async function guestList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/broad/guest/list", data);
}

export async function guest(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/broad/guest", data);
}

export async function postFreezeRoom(data: {
  roomNo: string;
  isFreeze: boolean;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/freeze", data);
}

export async function broadcastSummary(
    data: { roomNo: string },
    type: string
): Promise<responseType> {
  return await ajax(Method.GET, `/broad/summary/${type}`, data);
}

export async function broadMoon(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/moon", data);
}

export async function postBroadFanAdd(data: {
  memNo: string;
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/fan", data);
}
export async function postBroadFanRemove(data: {
  memNo: string;
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.DELETE, "/broad/fan", data);
}

export async function postSms(data: {
  phoneNo: string;
  authType: number;
}): Promise<responseType> {
  return await ajax(Method.POST, "/sms", data);
}

export async function postSmsAuth(data: {
  CMID: number;
  code: number;
}): Promise<responseType> {
  return await ajax(Method.POST, "/sms/auth", data);
}

export async function getNickCheck(data: {
  nickNm: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/member/nick", data);
}
export async function postRankSetting(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/member/rank/setting", data);
}

export async function infoSecession(): Promise<responseType> {
  return await ajax(Method.POST, "/member/withdrawal");
}

export async function postEditProfile(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/profile", data);
}

export async function postAddProfileImg(data: {
  profImg: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/profile/add/img", data);
}

export async function postDeleteProfileImg(data: {
  idx: number;
}): Promise<responseType> {
  return await ajax(Method.POST, "/profile/delete/img", data);
}

export async function postSetLeaderProfileImg(data: {
  idx: number;
}): Promise<responseType> {
  return await ajax(Method.POST, "/profile/leader/img", data);
}

export async function getMypage(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage", data);
}

export async function getEmoticon(): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/emoticon");
}

export async function getFanBoardList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/profile/board", data);
}

export async function postFanBoardRegist(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/profile/board", data);
}

export async function getFanBoardReply(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/profile/board/reply", data);
}

export async function deleteFanBoard(data: dataType): Promise<responseType> {
  return await ajax(Method.DELETE, "/profile/board", data);
}

export async function postFanBoardModify(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/profile/board/edit", data);
}

export async function getMypageNotice(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/notice", data);
}

export async function postMypageNotice(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/notice/add", data);
}

export async function deleteMypageNotice(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.DELETE, "/mypage/notice", data);
}

export async function modifyMypageNotice(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/notice/edit", data);
}

export async function getMypageNoticeReply(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/notice/reply/list", data);
}

export async function insertMypageNoticeReply(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/notice/reply/add", data);
}

export async function modifyMypageNoticeReply(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/notice/reply/edit", data);
}

export async function deleteMypageNoticeReply(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/notice/reply/delete", data);
}

export async function postMypageNoticeReadCnt(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/notice/read", data);
}

export async function MypageWalletDal(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/dal", data);
}

export async function MypageWalletByeol(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/byeol", data);
}

export async function getMypageWalletList(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/wallet/list", data);
}

export async function MypageWalletPop(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/wallet/pop", data);
}

export async function MypageBanWordSave(data: {
  banWord: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/banword", data);
}

export async function MypageBanWordList(): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/banword");
}

export async function MypageManagerSearch(data: {
  userType: number;
  search: string;
  page: number;
  records: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/search", data);
}

export async function MypagePushStatus(): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/notify");
}
export async function MypagePushUpdate(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/notify", data);
}

export async function MypageManagerList(): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/manager");
}

export async function MypageAddList(data: {
  memNo: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/manager/add", data);
}

export async function MypageDeleteList(data: {
  memNo: string;
}): Promise<responseType> {
  return await ajax(Method.DELETE, "/mypage/manager", data);
}

export async function BroadBlackListAddKickOut(data: {
  blockNo: string;
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/broad/black/add", data);
}

export async function MypageBlackList(data: {
  page: number;
  records: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/black", data);
}

export async function MypageBlackListAdd(data: {
  memNo: string;
  chatNo?: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/black/add", data);
}

export async function MypageDeleteBlackList(data: {
  memNo: string;
}): Promise<responseType> {
  return await ajax(Method.DELETE, "/mypage/black", data);
}

export async function getReportBroad(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/report/broad", data);
}

export async function getReportListen(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/report/listen", data);
}

export async function getBroadcastShortCut(): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/shortcut");
}

export async function broadcastShortCutModify(data: {
  orderNo: number;
  order: string;
  text: string;
  isOn: boolean;
  endDt?: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/shortcut", data);
}

export async function getBroadcastSetting(): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/broadcast/setting");
}

export async function modifyBroadcastSetting(data: {
  giftFanReg?: boolean;
  djListenerIn?: boolean;
  djListenerOut?: boolean;
  listenerIn?: boolean;
  listenerOut?: boolean;
  djTtsSound?: boolean | null;
  djNormalSound?: boolean | null;
  ttsSound?: boolean;
  normalSound?: boolean;
  listenOpen?: number;
  bjMemNo?: string | null;
  roomNo?: string | null;
}): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/broadcast/setting/edit", data);
}

export async function getBroadcastOption(data: {
  optionType: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/broadcast/option", data);
}
export async function insertBroadcastOption(data: {
  optionType: number;
  contents: string;
}): Promise<responseType> {
  return await ajax(Method.POST, `/mypage/broadcast/option/add`, data);
}
export async function deleteBroadcastOption(data: {
  idx: number;
  optionType: number;
}): Promise<responseType> {
  return await ajax(Method.POST, `/mypage/broadcast/option/delete`, data);
}
export async function modifyBroadcastOption(data: {
  idx: number;
  optionType: number;
  contents: string;
}): Promise<responseType> {
  return await ajax(Method.POST, `/mypage/broadcast/option/edit`, data);
}

/* Customer API Start */
export async function getCustomerNotice(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/center/notice", data);
}

export async function getCustomerNoticeDetail(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/center/notice/detail", data);
}

export async function getCustomerFaq(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/center/faq", data);
}

export async function getCustomerFaqDetail(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/center/faq/detail", data);
}

export async function getCustomerQnaList(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/center/qna/list", data);
}

export async function addCustomerQna(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/center/qna/add", data);
}

export async function deleteCustomerQna(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/center/qna/del", data);
}
/* Customer API End */

/*modal- mypage */
export async function getFanList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/profile/fan/list/new", data);
}
export async function postAddFan(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/fan", data);
}
export async function deleteFan(data: dataType): Promise<responseType> {
  return await ajax(Method.DELETE, "/mypage/fan", data);
}
export async function postMultiAddFan(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/multi/fan", data);
}

export async function getStarList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/profile/star/list/new", data);
}

export async function getStarListNew(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/profile/star/list/new", data);
}

export async function bestdjInfo(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/dj/best/fan/rank/list");
}

export async function getFanRankList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/profile/fan", data);
}
export async function getFanRankListNew(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/profile/fan/list/new", data);
}

export async function getGoodRankList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/good/list", data);
}
export async function postGiftDal(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/gift", data);
}
export async function postReportUser(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/declar", data);
}
export async function selfAuthCheck(): Promise<responseType> {
  return await ajax(Method.GET, "/self/auth/check");
}

export async function getExchangeHistory(): Promise<responseType> {
  return await ajax(Method.POST, "/member/exchange/select");
}

export async function getExchangeCalc(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/member/exchange/calc", data);
}

export async function exchangeApply(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/member/exchange/apply", data);
}

export async function exchangeReApply(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/member/exchange/reapply", data);
}
export async function postWithdraw(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/member/withdrawal", data);
}
export async function getNotification(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/notification", data);
}
export async function deleteAlarm(data: dataType): Promise<responseType> {
  return await ajax(Method.DELETE, "/mypage/notification/delete", data);
}

export async function getRoomType(): Promise<responseType> {
  return await ajax(Method.GET, "/room/type");
}

export async function getChargeItem(): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/change/item");
}

export async function postChargeItem(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/change/item", data);
}

// export async function postClickUpdate(data: dataType): Promise<responseType> {
//   return await ajax(Method.POST, "/mypage/click/update", data);
// }

/* Pay */
export async function payCard(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/card", data);
}
export async function payPhone(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/phone", data);
}
export async function payGiftCulture(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/gm", data);
}
export async function payGiftHappyMoney(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/hm", data);
}
export async function payGiftGame(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/gg", data);
}
export async function payGiftBook(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/gc", data);
}
export async function payLetter(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/payletter", data);
}
export async function payCoocon(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/coocon", data);
}
export async function payKakaomoney(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/kakao/ready", data);
}
export async function paySimple(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/simple", data);
}
export async function selfAuthReq(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/self/auth/req", data);
}
//

export async function getBanner(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/banner", data);
}

//event
export async function postEventRisingLive(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/rising/live", data);
}

export async function getPackageEventStateCheck(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/cam/check", data);
}

export async function getPackageEventWrite(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/cam/apply", data);
}

export async function event_specialdj(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/specialDj/status", data);
}

export async function event_specialdj_upload(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/specialDj/request", data);
}

export async function postEventAttend(): Promise<responseType> {
  return await ajax(Method.POST, "/event/attendance/check/status");
}

export async function postEventAttendIn(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/attendance/check/in", data);
}

export async function postEventAttendGift(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/attendance/random/gift", data);
}

export async function getEventAttendCheck(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/attendance/check", data);
}

export async function getEventRouletteCoupon(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/roulette/coupon", data);
}

export async function getEventRouletteCouponHistory(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/roulette/coupon/history", data);
}

export async function getEventRouletteInfo(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/roulette/info", data);
}

export async function getEventRouletteStart(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/roulette/start", data);
}

export async function getEventRouletteWin(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/roulette/win", data);
}

export async function getEventRouletteApply(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/roulette/apply", data);
}

export async function postEventRoulettePhone(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/roulette/phone", data);
}

export async function postEventAttendInput(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/phone/input", data);
}

export async function getEventAttendWinList(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/gifticon/win/list", data);
}

export async function getEventAttendLunarDate(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/lunar/date", data);
}

export async function knowhow_list(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/knowhow/list", data);
}

export async function knowhow_insert(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/knowhow/insert", data);
}

export async function knowhow_detail(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/knowhow/detail", data);
}

export async function knowhow_like(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/good", data);
}

export async function knowhow_delete(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/knowhow/delete", data);
}

export async function knowhow_modify(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/knowhow/update", data);
}

export async function postEventOneYearCheck(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/oneYear/dal/check", data);
}

export async function postEventOneYearInsert(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/oneYear/dal/ins", data);
}

export async function postEventOneYearComment(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/oneYear/tail/list", data);
}

export async function postEventOneYearCommentInsert(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/oneYear/tail/ins", data);
}

export async function postEventOneYearCommentUpdate(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/oneYear/tail/upd", data);
}

export async function postEventOneYearCommentDelete(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/oneYear/tail/del", data);
}

//인증샷 이벤트
export async function event_proofshot_list(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/photo/list", data);
}

export async function event_proofshot_detail(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/photo/detail", data);
}

export async function eventPackageJoinCheck(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/004/apply", data);
}

export async function eventPackageWrite(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/004/apply", data);
}

export async function event_proofshot_insert(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/photo/insert", data);
}

export async function event_proofshot_update(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/photo/update", data);
}

export async function event_proofshot_dellete(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/photo/delete", data);
}

export async function event_proofshot_status(): Promise<responseType> {
  return await ajax(Method.GET, "/event/photo/status");
}

export async function postMemberListen(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/member/reset/listen", data);
}

//clip
export async function postAudio(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/file/upload", data);
}

export async function postAudioEdit(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/edit", data);
}

export async function postAudioDelete(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/delete", data);
}

export async function postClip(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/add", data);
}

export async function getUploadList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/upload/list", data);
}

export async function getClipType(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/type", data);
}

export async function postClipPlay(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/play", data);
}

export async function getHistoryList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/listen/list", data);
}

export async function getGiftRankTop(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/gift/rank/top3", data);
}

export async function getPopularList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/main/pop/list", data);
}

export async function getLatestList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/main/latest/list", data);
}

export async function getClipRankingList(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/clip/rank", data);
}

export async function getClipRankingDayPop(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/clip/day/pop", data);
}

export async function getClipRankingWeekPop(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/clip/week/pop", data);
}

export async function postClipWinMsg(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/win/msg", data);
}

export async function getMarketingClipList(data: {
  recDate: string;
  isLogin: boolean;
  isClick: boolean;
}): Promise<responseType> {
  return await ajax(Method.GET, "/clip/recommend/list", data);
}

export async function getClipList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/list", data);
}

export async function getMyClipData(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/myclip", data);
}
export async function postClipSendGift(data: {
  clipNo: string;
  memNo: string;
  itemCode: string;
  itemCnt: number;
}): Promise<responseType> {
  return await ajax(Method.POST, "/clip/gift", data);
}

export async function getClipGiftRank(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/gift/rank/list", data);
}

export async function getClipGift(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/gift/list", data);
}

export async function postClipReport(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/declar", data);
}

export async function getMainTop3List(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/main/top3/list", data);
}

export async function postClipGood(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/good", data);
}

export async function getClipReplyList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/reply/list", data);
}

export async function postClipReplyAdd(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/reply/add", data);
}

export async function postClipReplyDelete(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/clip/reply/delete", data);
}

export async function postClipReplyEdit(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/reply/edit", data);
}

export async function eventTimeCheck(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/timeEvent/info", data);
}
export async function eventJoinlevelPopup(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/join/check", data);
}
export async function eventJoinlevelDetail(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/join/detail", data);
}
export async function eventJoinlevelReward(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/join/reward", data);
}
export async function getPlayList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/play/list", data);
}
export async function postPlayListEdit(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/play/list/edit", data);
}
export async function getClipShare(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/share", data);
}

export async function getSpecialDjHistory(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/specialDj/history", data);
}

export async function postAdmin(): Promise<responseType> {
  return await ajax(Method.POST, "/admin/auth/check");
}
export async function postErrorSave(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/error/log", data);
}
export async function getChooseokCheck(): Promise<responseType> {
  return await ajax(Method.GET, "/event/chooseok/check");
}
export async function getChooseokDalCheck(): Promise<responseType> {
  return await ajax(Method.GET, "/event/chooseok/freeDal/check");
}
export async function getChooseokPurchase(): Promise<responseType> {
  return await ajax(Method.GET, "/event/chooseok/purchase/select");
}
export async function getChooseokBonus(): Promise<responseType> {
  return await ajax(Method.GET, "/event/chooseok/purchase/bonus");
}
//search
export async function getSearchList(
    data: dataType,
    type: string
): Promise<responseType> {
  return await ajax(Method.GET, `/search/${type}`, data);
}
export async function getSearchRecomend(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/search/room/recommand/list", data);
}
export async function getMemberSearch(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/search/member", data);
}
//환전 리뉴얼
export async function getExchangeSearchAccount(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/member/exchange/account/list", data);
}
export async function postExchangeAddAccount(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/member/exchange/account/add", data);
}
export async function postExchangeEditAccount(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/member/exchange/account/edit", data);
}
export async function postExchangeDeleteAccount(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/member/exchange/account/delete", data);
}

export async function getStoryList(data: {
  page: number;
  records: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/story", data);
}
export async function getSentStoryList(data: {
  page: number;
  records: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/story/send", data);
}
// 왕큐피드
export async function getLikeRank(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/good/list", data);
}
// 스디
export async function getSpecialList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/member/special/history", data);
}
// 팬애딧 삭제
export async function deleteFanEditList(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/profile/fan/edit", data);
}
export async function postFanEditMemo(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/profile/fan/memo", data);
}
export async function postStarEditMemo(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/profile/star/memo", data);
}
// 1일 1회 본인인증 체크
export async function certificationCheck(): Promise<newResponseType> {
  return await ajax(Method.GET, "/profile/certification/check");
}
// 달 교환
export async function postDalAutoExchange(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/auto/change", data);
}
export async function getDalAutoExchange(): Promise<responseType> {
  return await ajax(Method.GET, "/mypage/auto/change");
}
// 환전취소
export async function postExchangeCancel(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mypage/exchange/cancel", data);
}
// 이벤트 페이지
export async function getEventList(): Promise<responseType> {
  return await ajax(Method.GET, "/event/page/list");
}
export async function getEventResult(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/page/winResult", data);
}
export async function getEventWinner(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/page/winList", data);
}
export async function prizeReceiveWay(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/page/receiveWay", data);
}
export async function winnerInfoSelect(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/page/winnerAddInfo/select", data);
}
export async function winnerInfoFormat(): Promise<responseType> {
  return await ajax(Method.GET, "/event/page/winnerAddInfo/infoFormat");
}
export async function winnerInfoAddEdit(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/page/winnerAddInfo/edit", data);
}
export async function clipPlayConfirm(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/play/confirm", data);
}
// 위클리픽
export async function getWeeklyList(data: {
  pageNo: number;
  pageCnt: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/marketing/weekly", data);
}
// 15초 광고모델
export async function getSecondList(data: {
  pageNo: number;
  pageCnt: number;
}): Promise<responseType> {
  return await ajax(Method.GET, "/marketing/second", data);
}
// 상세화면
export async function getMarketingDetail(data: {
  idx: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/marketing/detail", data);
}

//이벤트댓글
export async function getEventTerm(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/event/ranking/term", data);
}
export async function getEventComment(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/event/reply", data);
}

export async function postEventComment(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/reply", data);
}

export async function deleteEventComment(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.DELETE, "/event/reply", data);
}

//어워드이벤트
export async function getAwardList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/award/list", data);
}

export async function postAwardVote(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/award/vote", data);
}

export async function getAwardResult(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/award/result", data);
}

export async function getAwardHonors(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/award/honor", data);
}

// mailbox
export async function getMailboxChatList(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/mailbox/chat/list", data);
}
export async function getMailboxChatTargetList(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/mailbox/chat/target/list", data);
}
// mailbox - chat
export async function mailChatExit(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mailbox/chat/exit", data);
}
export async function mailChatEnter(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mailbox/chat/enter", data);
}
export async function mailChatSend(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mailbox/chat/send", data);
}
export async function mailChatPrevChatting(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/mailbox/chat/msg", data);
}
export async function mailChatRead(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/mailbox/chat/read", data);
}
export async function postChatImage(data: {
  roomNo: string;
  dataURL: any;
  os: string;
}): Promise<responseType> {
  return await ajax(Method.POST, "/photo/chat", data);
}
export async function getChatImageList(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mailbox/chat/image/list", data);
}
export async function postChatImageDelete(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mailbox/chat/image/delete", data);
}
export async function editPushMembers(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/member/recv", data);
}

export async function getPushMembers(): Promise<responseType> {
  return await ajax(Method.GET, "/member/recv");
}

export async function deletePushMembers(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/member/recv/delete", data);
}
export async function checkIsMailboxNew(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/mailbox/chat/new");
}
export async function postReportImg(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/report/image", data);
}
// get DJ 추천
export async function getRecommendedDJ(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/dj/recommend", data);
}

export async function getVideoOpenEvent(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/event", data);
}
export async function getMyClipDetail(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/clip/myclip/detail", data);
}
export async function postMyClipEdit(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/clip/myclip/edit", data);
}
export async function getVideoOpenBest(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/event/best", data);
}
// 보름달 이벤트
export async function getMoonRiseTime(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/event/fullmoon/info", data);
}
// 보름달 이벤트
export async function getMoonRiseRank(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/fullmoon/rank", data);
}
export async function PostMailboxChatUse(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/mailbox/chat/use", data);
}

export async function getSpecialLeague(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/event/special", data);
}

export async function getChampionship(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/event/championship", data);
}

export async function getChampionshipPoint(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/event/championship/point", data);
}

export async function postChampionshipGift(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/championship/gift", data);
}

export async function getTTSActorList(): Promise<responseType> {
  return await ajax(Method.GET, "/broad/tts/actor/list");
}

export async function getRaffleEventTotalInfo(): Promise<responseType> {
  return await ajax(Method.GET, "/event/raffle/fan/total/list");
}

export async function putEnterRaffleEvent(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, "/event/raffle/enter", data);
}

export async function getRaffleEventRoundInfo(): Promise<responseType> {
  return await ajax(Method.GET, "/event/raffle/fan/round/list");
}

export async function getRaffleEventDjInfo(): Promise<responseType> {
  return await ajax(Method.GET, "/event/raffle/dj/main/list");
}

export async function eventItemIns(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/event/raffle/dj/ins/item", data);
}

/*********** MiniGame 관련 Api ***************/
export async function getMiniGameList(data: {
  roomNo: string;
}): Promise<responseType> {
  return await ajax(Method.GET, "/broad/game/list", data);
}

export async function insertMiniGame(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/broad/game/add", data);
}

export async function modifyMiniGame(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/broad/game/edit", data);
}

export async function getMiniGame(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, "/broad/game/select", data);
}

export async function miniGameStart(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/broad/game/start", data);
}

export async function miniGameEnd(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/broad/game/end", data);
}

export async function getRouletteWinList(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/broad/game/win/list", data);
}

export async function getHistoryMiniGame(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.GET, "/broad/game/history/select", data);
}

// 추억의 뽑기 이벤트 뽑기
export async function putDrawSelect(data: dataType): Promise<newResponseType> {
  return await ajax(Method.POST, "/event/draw/select", data);
}

// 추억의 뽑기 이벤트 응모권 조회
export async function getDrawTicketCnt(): Promise<newResponseType> {
  return await ajax(Method.GET, "/event/draw/ticketCnt");
}

// 추억의 뽑기 이벤트 당첨내역 조회
export async function getDrawWinningInfo(): Promise<newResponseType> {
  return await ajax(Method.GET, "/event/draw/winningInfo");
}

// 추억의 뽑기 이벤트 뽑기 리스트 조회
export async function getDrawListInfo(): Promise<newResponseType> {
  return await ajax(Method.GET, "/event/draw/listInfo");
}

// 좋아요 트리 사연 장식리스트
export async function getLikeTreeDecoList(data): Promise<newResponseType> {
  return await ajax(Method.GET, "/event/likeTree/decoList", data);
}

// 좋아요 트리 사연 메인리스트
export async function getLikeTreeMainList(): Promise<newResponseType> {
  return await ajax(Method.GET, "/event/likeTree/mainList");
}

// 좋아요 트리 사연리스트
export async function getLikeTreeStoryList(data): Promise<newResponseType> {
  return await ajax(Method.GET, "/event/likeTree/storyList", data);
}

// 좋아요 트리 랭킹리스트
export async function getLikeTreeRankList(data): Promise<newResponseType> {
  return await ajax(Method.GET, "/event/likeTree/rankList", data);
}

// 좋아요 트리 회원 랭킹 정보
export async function getLikeTreeRankUserInfo(data): Promise<newResponseType> {
  return await ajax(Method.GET, "/event/likeTree/rankUserInfo", data);
}

// 좋아요 트리 사연 등록
export async function likeTreeStoryIns(data): Promise<newResponseType> {
  return await ajax(Method.POST, "/event/likeTree/registStory", data);
}

// 좋아요 트리 사연 삭제
export async function likeTreeStoryDel(data): Promise<newResponseType> {
  return await ajax(Method.POST, "/event/likeTree/deleteStory", data);
}

// 좋아요 트리 사연 신고
export async function likeTreeStoryRptIns(data): Promise<newResponseType> {
  return await ajax(Method.POST, "/event/likeTree/reportStory", data);
}

// 좋아요 선물 받기
export async function likeTreeRewardIns(data): Promise<newResponseType> {
  return await ajax(Method.POST, "/event/likeTree/reward/ins", data);
}

export async function getInnerServerList(): Promise<responseType> {
  return await ajax(Method.GET, "/main/ip/web");
}

// 법정대리인 동의 ins
export async function parentCertIns(data): Promise<newResponseType> {
  return await ajax(Method.POST, "/parent/cert/ins", data);
}

// 법정대리인 동의 chk
export async function parentCertChk(): Promise<newResponseType> {
  return await ajax(Method.GET, "/parent/cert/chk");
}

// WELCOME 이벤트
/*--- 이벤트 자격 여부 */
export async function getWelcomeAuthInfo(): Promise<responseType> {
  return await ajax(Method.GET, "/event/welcome/authInfo");
}
/*--- 이벤트 청취자 정보 */
export async function getWelcomeUserInfo(): Promise<responseType> {
  return await ajax(Method.GET, "/event/welcome/userInfo");
}
/*--- 이벤트 DJ 정보 */
export async function getWelcomeDjInfo(): Promise<responseType> {
  return await ajax(Method.GET, "/event/welcome/djInfo");
}
/*--- 이벤트 선물 받기 */
export async function postWelcomeGiftRcv(
    type: string,
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, `/event/welcome/reqGift/${type}`, data);
}

export async function getMoonLandInfoData(
): Promise<responseType> {
  return await ajax(Method.GET, `/event/moonLand/info/sel`);
}

export async function getMoonLandMyRank(
    data: dataType
): Promise<responseType> {
  const {moonNo} = data;
  return await ajax(Method.GET, `/event/moonLand/rank/my/sel/${moonNo}`);
}

export async function getMoonLandRankList(
    data: dataType
): Promise<responseType> {
  const {moonNo, pageNo, pagePerCnt} = data;
  return await ajax(Method.GET, `/event/moonLand/rank/list/${moonNo}/${pageNo}/${pagePerCnt}`);
}

export async function getMoonLandMissionSel(
    data: dataType
): Promise<responseType> {
  const {roomNo} = data;
  return await ajax(Method.GET, `/event/moonLand/mission/sel?roomNo=${roomNo}`);
}

export async function setMoonLandScore(
    data: dataType
): Promise<responseType> {
  return await ajax(Method.POST, `/event/moonLand/score`, data);
}

//방송방 웰컴 페이지 이동 버튼 클릭시 (하루 한번만 띄울때 쓰는 체크값 업데이트)
export async function welcomeEventDayCheckerUpdate(): Promise<responseType> {
  return await ajax(Method.POST, '/event/welcome/chkInfoUpd');
}

/*--- 굿 스타트 이벤트 */
// Dj 페이지 (dj 랭킹, 전체 회차정보)
export async function getGoodStartDjInfo(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, `/event/goodStart/dj/page`,data);
}
// Dj 랭킹 (param: pageNo, pagePerCnt)
export async function getGoodStartDjRank(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, `/event/goodStart/dj/rank`, data);
}
// 신입 Dj 랭킹 (param: pageNo, pagePerCnt)
export async function getGoodStartNewDjRank(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, `/event/goodStart/dj/new/rank`, data);
}
// Fan 페이지 (fan 랭킹, 전체 회차정보)
export async function getGoodStartFanInfo(data: dataType): Promise<responseType> {
  return await ajax(Method.GET, `/event/goodStart/fan/page`, data);
}

// 휴면 회원 인증
export async function postSleepMemUpd(data): Promise<responseType> {
  return ajax(Method.POST, '/sleep/member/update', data)
}

export async function payTryAOSInApp(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/aos/try", data);
}
export async function payEndAOSInApp(data: dataType): Promise<responseType> {
  return await ajax(Method.POST, "/rest/pay/aos/end", data);
}

/********************************************/
