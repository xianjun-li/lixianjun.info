const promisify = require("util").promisify
// const exec = require('child_process').exec
const exec = promisify(require("child_process").exec)
const log4js = require("log4js")
const crypto = require("crypto")

/* github webhook handler
 * todo 接收到webhook后添加到定时任务，而非即时处理
 */

// load configuration and secrets from a .env file into process.env
require("dotenv").config()

// logger
log4js.configure({
  appenders: {
    webhook: {
      //以文件格式存储
      type: "dateFile",
      filename: "log/webhook",
      pattern: "yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
  },
  categories: { default: { appenders: ["webhook"], level: "info" } },
})

const logger = log4js.getLogger(`webhook`)

const WEBHOOK_SECRET = process.env.WEB_HOOK_SECRET

if (WEBHOOK_SECRET === "") {
  logger.error("secret is empty")
  throw new Error("secret is empty")
}

const cmd = `cd ./contents && git checkout . && git pull --ff-only origin master && yarn build && exit 0`

const exec_cmd = async () => {
  const { err, stdout, stderr } = await exec(cmd)
  return 0
}

function validateJsonWebhook(chunk, sig) {
  // calculate the signature
  const expectedSignature =
    "sha1=" +
    crypto
      .createHmac("sha1", WEBHOOK_SECRET)
      .update(JSON.stringify(chunk))
      .digest("hex")

  if (sig !== expectedSignature) {
    throw new Error("Invalid signature.")
  }
}

// // test
const handler = async (req, res) => {
  logger.info("start")
  let body = ""
  req.on("data", chunk => {
    body += chunk
  })

  req.on("end", async () => {
    try {
      validateJsonWebhook(body, req.headers["x-hub-signature"])
    } catch (error) {
      console.error(`validate error: ${error}`)
      logger.error(`validate error: ${error}`)
      res.writeHead(500, { "Content-Type": "text/plain" })
      res.write("error")
      res.end()
      return
    }

    const result = await exec_cmd()
    logger.info("end")

    req.writeHead(200, { "Content-Type": "text/plain" })
    req.write("success")
    req.end()
  })
}

const port = 3000

const server = require("http").createServer(handler).listen(port)
console.log("serve start")
