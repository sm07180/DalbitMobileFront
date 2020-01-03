/**
 * @file context/config.js
 * @brief 환경설정값
 * @todo 개발모드/프로덕션모드 분기할수있게.
 */

/**
 * @brif 서버분기
 */

export const CDN_SERVER = '/'

/**
 * @brif PC,Tablet,Moble 사이즈 분기
 * @code import {DEVICE_MOBILE} from 'Context/config'
 */
export const DEVICE_PC = '1024px'
export const DEVICE_MOBILE = '600px'
