import 'dotenv/config'
import express from 'express'

const app = express()

const PORT = process.env.PORT || 5555

app.listen(PORT,(req,res) => {
  console.log(`Server is running on PORT ${PORT}`)
}
);

