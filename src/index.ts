import express, { Express } from 'express'
import cors from 'cors';
import morgan from 'morgan'
import dotenv from 'dotenv'
import dataGeneratorRouter from './routes/randomDataGenerator'
import exceptionFilter from './middleware/exception'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 6060

const v1Router = express.Router()

app.use(
    cors({
        origin: process.env.ORIGIN,
    }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.use(express.static('public'))

app.use(exceptionFilter)

v1Router.use('/generate-data', dataGeneratorRouter)

app.use('/api', v1Router)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
