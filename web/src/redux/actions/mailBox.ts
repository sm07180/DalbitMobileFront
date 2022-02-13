import { createAction } from "typesafe-actions";

export const SET_MAILBOX_GIFT_ITEM_INFO               = 'mailBox/SET_MAILBOX_GIFT_ITEM_INFO';
export const SET_MAILBOX_CHAT_TARGET_DATA             = 'mailBox/SET_MAILBOX_CHAT_TARGET_DATA';
export const SET_MAILBOX_TAB_STATE                    = 'mailBox/SET_MAILBOX_TAB_STATE';
export const SET_MAILBOX_INFO                         = 'mailBox/SET_MAILBOX_INFO';
export const SET_MAILBOX_PUSH_CHAT_INFO               = 'mailBox/SET_MAILBOX_PUSH_CHAT_INFO';
export const SET_MAILBOX_USER_COUNT                   = 'mailBox/SET_MAILBOX_USER_COUNT';
export const SET_MAILBOX_IS_MAIL_BOX_NEW              = 'mailBox/SET_MAILBOX_IS_MAIL_BOX_NEW';
export const SET_MAILBOX_OTHER_INFO                   = 'mailBox/SET_MAILBOX_OTHER_INFO';
export const SET_MAILBOX_USE_MAIL_BOX                 = 'mailBox/SET_MAILBOX_USE_MAIL_BOX';
export const SET_MAILBOX_CHAT_LIST_INIT               = 'mailBox/SET_MAILBOX_CHAT_LIST_INIT';
export const SET_MAILBOX_CHAT_LIST_UPDATE             = 'mailBox/SET_MAILBOX_CHAT_LIST_UPDATE';
export const SET_MAILBOX_IMG_SLIDER_INIT              = 'mailBox/SET_MAILBOX_IMG_SLIDER_INIT';
export const SET_MAILBOX_IMG_SLIDER_CHANGE_CURRENT    = 'mailBox/SET_MAILBOX_IMG_SLIDER_CHANGE_CURRENT';
export const SET_MAILBOX_IMG_SLIDER_ADD_DELETE_IMG    = 'mailBox/SET_MAILBOX_IMG_SLIDER_ADD_DELETE_IMG';
export const SET_MAILBOX_IMG_SLIDER_POPUP_CLOSE       = 'mailBox/SET_MAILBOX_IMG_SLIDER_POPUP_CLOSE';

export const setMailBoxGiftItemInfo = createAction(SET_MAILBOX_GIFT_ITEM_INFO)<any>();
export const setMailBoxChatTargetData = createAction(SET_MAILBOX_CHAT_TARGET_DATA)<any>();
export const setMailBoxTabState = createAction(SET_MAILBOX_TAB_STATE)<number>();
export const setMailBoxInfo = createAction(SET_MAILBOX_INFO)<any>();
export const setMailBoxPushChatInfo = createAction(SET_MAILBOX_PUSH_CHAT_INFO)<any>();
export const setMailBoxUserCount = createAction(SET_MAILBOX_USER_COUNT)<any>();
export const setMailBoxIsMailBoxNew = createAction(SET_MAILBOX_IS_MAIL_BOX_NEW)<boolean>();
export const setMailBoxOtherInfo = createAction(SET_MAILBOX_OTHER_INFO)<any>();
export const setMailBoxUseMailBox = createAction(SET_MAILBOX_USE_MAIL_BOX)<boolean>();
export const setMailBoxChatListInit = createAction(SET_MAILBOX_CHAT_LIST_INIT)<any>();
export const setMailBoxChatListUpdate = createAction(SET_MAILBOX_CHAT_LIST_UPDATE)<any>();
export const setMailBoxImgSliderInit = createAction(SET_MAILBOX_IMG_SLIDER_INIT)<any>();
export const setMailBoxImgSliderChangeCurrent = createAction(SET_MAILBOX_IMG_SLIDER_CHANGE_CURRENT)<any>();
export const setMailBoxImgSliderAddDeleteImg = createAction(SET_MAILBOX_IMG_SLIDER_ADD_DELETE_IMG)<any>();
export const setMailBoxImgSliderPopupClose = createAction(SET_MAILBOX_IMG_SLIDER_POPUP_CLOSE)();



