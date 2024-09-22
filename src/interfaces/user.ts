import { Date } from "mongoose"

interface UserTypes {
  name: string
  email: string
  password: string
  createdAt: Date
  _id: string
}

export { UserTypes }
