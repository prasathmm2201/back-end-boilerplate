require('dotenv').config()
import express, { Request, Response } from 'express'
import routers from './routers'
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import { MQService, swaggerOption } from './extension';
import swaggerUi from 'swagger-ui-express'
import helmet from 'helmet';
import cors from 'cors'
import rateLimit from 'express-rate-limit';
import { config } from './configs';
import OS from "os";
import knex from 'knex';
import onHeaders from "on-headers";

const connection = require("./DB/knexfile");
const app = express()
const PORT = config?.port
const customFormat = ':method :url :status :res[content-length] - :response-time ms';
const RabbitMQ = new MQService();


global.status_codes = {
  success: { status: 200, api_status: "API-OK" },
  success_no_data: { status: 200, api_status: "API-OK-NO-CONTENT" },
  bad_request: { status: 400, api_status: "API-BAD-REQUEST" },
  un_authorised: { status: 401, api_status: "API-UN-AUTHORISED-ACCESS" },
  forbidden: { status: 403, api_status: "API-FORBIDDEN" },
  not_found: { status: 404, api_status: "API-NOT-FOUND" },
  error: { status: 500, api_status: "API-ERROR" },
  locked: { status: 423, api_status: "API-LOCKED" }
};

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Middleware to parse JSON requests
app.use(express.json())

// Use morgan middleware with the custom format
app.use(morgan(customFormat));

// CORS error
app.use(cors())


// Use helmet middleware
app.use(helmet({
  hidePoweredBy: true,
  contentSecurityPolicy: false,
}));

app.use(limiter);

// Define a route handler for the root path
app.get('/', (req: Request, res: Response) => {
  const status = {
    uptime: process.uptime(),
    message: "Server is running...",
    process_id: process.pid,
    date: new Date(),
    platform: OS.platform(),
    processor: OS.cpus()[0].model,
    architecture: OS.arch(),
    thread_count: OS.cpus().length,
    total_memory: `${(OS.totalmem() / 1e9).toFixed(2)} GB`,
    free_memory: `${(OS.freemem() / 1e9).toFixed(2)} GB`,
  };
  res.status(200).send(status);
})


// API routes
app.use("/api", routers);

// create knex instance && close it just before send header
app.use((req , res , next)=>{
  const DB = connection[config.environment]
  const Instance = knex(DB);
  req.body["DB"] = Instance
  onHeaders(res , ()=>{
    Instance.destroy()
  })
  next()
})

if (config?.environment === "development") {
  const specs = swaggerJSDoc(swaggerOption)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}

//Initiate RabbitMQ
RabbitMQ.InitiateRabbitMQ(["email"]);
//Closing Connection
app.on("close", () => RabbitMQ.closeConnection());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
