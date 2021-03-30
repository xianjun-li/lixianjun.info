// // install with: npm install @octokit/webhooks
// const { Webhooks } = require("@octokit/webhooks");
// const webhooks = new Webhooks({
//     secret: "mysecret",
// });

const port = 3000

// webhooks.onAny(({ id, name, payload }) => {
//     console.log(name, "event received");
// });

// require("http").createServer(webhooks.middleware).listen(port);
// // can now receive webhook events at port 3000

require("http").createServer((res, req) => {
    req.writeHead(200, { 'Content-Type': 'text/plain' });
    req.write('Hello World!');
    req.end();
}).listen(port);