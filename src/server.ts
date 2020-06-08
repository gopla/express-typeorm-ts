import 'reflect-metadata'
import app from './app'
import { connectDB } from './utils/database'

const port = process.env.PORT || 3000
connectDB().then(() => {
  app.listen(port, () => {
    console.log(` -> Server running on port ${port}`)
  })
})
