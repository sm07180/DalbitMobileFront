/**
 * @file context/config.js
 * @brief 환경설정값
 * @todo 개발모드/프로덕션모드 분기할수있게.
 */

/**
 * @brief 서버분기
 */
export const SERVICE_SERVER = 'https://devwww2.wawatoc.com' //서비스서버
export const API_SERVER = 'https://devapi2.wawatoc.com' //API서버
export const IMG_SERVER = 'https://devphoto2.wawatoc.com' //이미지서버

/**
 * @brief 레이아웃
 */
export const HEADER_HEIGHT = '350px'

/**
 * @brief PC,Tablet,Moble 사이즈 분기
 * @code import {DEVICE_MOBILE} from 'Context/config'
 */
export const DEVICE_PC = '1024px'
export const DEVICE_MOBILE = '600px'
