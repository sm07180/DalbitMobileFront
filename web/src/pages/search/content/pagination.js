/**
 * @title 결과값이 없습니다.
 */
import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import Posts from './posts'
import Page from './page'
import styled from 'styled-components'
//context
import {Context} from 'context'
import API from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  const context = useContext(Context)
  //---------------------------------------------------------------------
  const [posts, setPosts] = useState([])
  const [broadList, setBroadList] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(4)

  //context
  //---------------------------------------------------------------------
  //   useEffect(() => {
  //     const fetchPosts = async () => {
  //       const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
  //       setPosts(res.data)
  //     }
  //     fetchPosts()
  //   }, [])
  //   console.log(posts)

  //api
  async function fetchData(obj) {
    const res = await API.broad_list({
      url: '/broad/list',
      method: 'get'
    })
    if (res.result === 'success') {
      setBroadList(res.data)
    }
    console.log(res)
    console.log(res.data.list)
    setPosts(res.data.list)
  }

  useEffect(() => {
    fetchData({
      data: {
        roomType: '',
        page: 1,
        records: 10
      }
    })
  }, [])

  //현재페이지
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  //체인지페이지
  const paginate = pageNumer => setCurrentPage(pageNumer)
  return (
    <div className="container mt-5">
      <h1 className="text-primart mb-3">페이지네이션</h1>
      <Posts posts={currentPosts} />
      <Page postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
    </div>
  )
}
//------------------------------------------------------------------

//styled
