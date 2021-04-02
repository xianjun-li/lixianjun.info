const promisify = require("util").promisify
const exec = require("child_process").exec
// const exec = promisify(require("child_process").exec)
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

const cmd = `at -f ${__dirname}/update_contents.sh now`

const exec_cmd = () => {
  logger.info(`run cmd start:${cmd}`)
  exec(cmd)
  logger.info("cmd end")
  return 0
}

function validateJsonWebhook(algorithm, chunk, sig, secret) {
  // calculate the signature
  const expectedSignature =
    `${algorithm}=` +
    crypto.createHmac(algorithm, secret).update(chunk).digest("hex")

  const result = crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expectedSignature)
  )

  return result
}

const handler = async (req, res) => {
  logger.info("request handle start")
  let body = ""
  const sig = req.headers["x-hub-signature-256"] || "" //防止不存在而报错
  req.on("data", chunk => {
    body += chunk.toString("utf8")
  })

  req.on("end", async () => {
    const validatedResult = validateJsonWebhook(
      "sha256",
      JSON.stringify(JSON.parse(body)),
      sig,
      WEBHOOK_SECRET
    )

    if (validatedResult === false) {
      console.error(`validate error: ${error}`)
      logger.error(`validate error: ${error}`)
      res.writeHead(500, { "Content-Type": "text/plain" })
      res.write("error")
      res.end()
    } else {
      exec_cmd()
      logger.info("request handle end")

      res.writeHead(200, { "Content-Type": "text/plain" })
      res.write("success")
      res.end()
    }
  })
}

const port = 3000

const server = require("http").createServer(handler).listen(port)
console.log("serve start")
