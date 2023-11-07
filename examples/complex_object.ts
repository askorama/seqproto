import { createSer, createDes } from '../src/index.js'
import type { Ser, Des } from '../src/index'

interface User {
  id: number
  username: string
}

interface Comment {
  id: number
  body: string
  user: User
}

interface Post {
  id: number
  title: string
  creator: User
  comments: Comment[]
}

function serializeUser(ser: Ser, user: User) {
  ser.serializeUInt32(user.id)
  ser.serializeString(user.username)
}
function deserializeUser(des: Des): User {
  const id = des.deserializeUInt32()
  const username = des.deserializeString()
  return { id, username }
}
function serializeComment(ser: Ser, comment: Comment) {
  ser.serializeUInt32(comment.id)
  ser.serializeString(comment.body)
  serializeUser(ser, comment.user)
}
function deserializeComment(des: Des): Comment {
  const id = des.deserializeUInt32()
  const body = des.deserializeString()
  const user = deserializeUser(des)
  return { id, body, user }
}
function serializePost (ser: Ser, post: Post) {
  ser.serializeUInt32(post.id)
  ser.serializeString(post.title)
  serializeUser(ser, post.creator)
  ser.serializeArray(post.comments, serializeComment)
}
function deserializePost (des: Des): Post {
  const id = des.deserializeUInt32()
  const title = des.deserializeString()
  const creator = deserializeUser(des)
  const comments = des.deserializeArray(deserializeComment)
  return { id, title, creator, comments }
}

const ser: Ser = createSer()
serializePost(ser, {
  id: 1,
  title: 'hello',
  creator: { id: 1, username: 'bob' },
  comments: [
    { id: 1, body: 'hello', user: { id: 1, username: 'bob' } },
    { id: 2, body: 'world', user: { id: 2, username: 'alice' } },
  ]
})
const buffer = ser.getBuffer()

const des: Des = createDes(buffer)
const post = deserializePost(des)

console.log(JSON.stringify(post, null, 2))
