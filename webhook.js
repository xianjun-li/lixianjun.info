const promisify = require("util").promisify
// const exec = require('child_process').exec
const exec = promisify(require("child_process").exec)

// load configuration and secrets from a .env file into process.env
require("dotenv").config()

// todo 接收到webhook后添加到定时任务，而非即时处理

const webhook_secret = process.env.WEB_HOOK_SECRET

if (webhook_secret === "") {
  throw new Error("secret is empty")
}

// install with: npm install @octokit/webhooks
const { Webhooks } = require("@octokit/webhooks")
const webhooks = new Webhooks({
  secret: process.env.WEB_HOOK_SECRET,
})

const cmd = `cd ./contents && git checkout . && git pull --ff-only origin master && yarn build && exit 0`

const exec_cmd = async () => {
  const { err, stdout, stderr } = await exec(cmd)
  return 0
}

webhooks.onAny(async ({ id, name, payload }) => {
  console.log(name, "event received")
  const result = await cmd()

  console.log(`result: ${JSON.stringify(result)}`)
})

const handler = webhooks.middleware

// // test
// const handler = async (res, req) => {
//   const result = await exec_cmd()
//   req.writeHead(200, { "Content-Type": "text/plain" })
//   req.write("success")
//   req.end()
// }

const port = 3000

const server = require("http").createServer(handler).listen(port)
console.log("serve start")
