import axios from 'axios'
import {API_SERVER} from 'context/config'
import {cacheAdapterEnhancer} from 'axios-extensions'

//팀랭킹
export const getRankTeam = (cache) => http.get("/rank/list/team", {
  cache: cache,
  forceUpdate: history.action === 'PUSH',
});

//랭킹페이지(타임랭킹)
export const getRankTime = (param, cache) => http.get("/rank/list/time", {
  params: param,
  cache: cache,
  forceUpdate: history.action === 'PUSH',
});


//랭킹페이지(랭킹)
export const getRank = (param, cache) => http.get("/rank/list", {
  params: param,
  cache: cache,
  forceUpdate: history.action === 'PUSH',
});

const http = axios.create({
  baseURL: API_SERVER,
  adapter: cacheAdapterEnhancer(axios.defaults.adapter),
  withCredentials: true,
});


