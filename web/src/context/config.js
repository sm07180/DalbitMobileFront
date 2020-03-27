/**
 * @file context/config.js
 * @brief 환경설정값
 * @todo 개발모드/프로덕션모드 분기할수있게.
 */
//---------------------------------------------------------------------

export const VERSION = ''
/**
 * @brief 서버분기
 */
export const API_SERVER = __API_SERVER_URL //API서버
export const IMG_SERVER = __STATIC_PHOTO_SERVER_URL //이미지 CDN
export const PHOTO_SERVER = __USER_PHOTO_SERVER_URL //이미지서버 (사용자가 올리는서버)
export const PAY_SERVER = __PAY_SERVE_URL

/**
 * @brief 레이아웃
 */
export const HEADER_HEIGHT = '350px'

/**
 * @brief PC,Tablet,Moble 사이즈 분기
 * @code import {WIDTH_TABLET} from 'context/config'
 */
export const WIDTH_PC = '1920px'
export const WIDTH_PC_S = '1280px' //디자인 시안 사이즈
export const WIDTH_TABLET = '1024px'
export const WIDTH_TABLET_S = '840px' //디자인 시안 사이즈
export const WIDTH_MOBILE = '600px'
export const WIDTH_MOBILE_S = '360px' //디자인 시안 사이즈
//---------------------------------------------------------------------
