import React from 'react'
const Posts = ({posts}) => {
  return (
    <ul>
      {posts.map((post, index) => (
        <li key={index}>{post.title}</li>
      ))}
    </ul>
  )
}
export default Posts
