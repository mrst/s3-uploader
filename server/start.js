import express from 'express'
import { generateUploadURL } from './s3.js'

const app = express()

app.use(express.static('static'))

app.get('/s3Url/:itemID/:albumID', async (req, res) => {
  const url = await generateUploadURL(req)
  res.send({url})
})

app.listen(8080, () => console.log("listening on port 8080"))