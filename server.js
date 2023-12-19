const Koa = require('koa')
const serve = require('koa-static')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')
const util = require('./services/utility')

const config = util.configuration('./config/settings.toml')
const router = require('./routes.js')(config)

const server = new Koa()

// For parsing request bodies
server.use(bodyParser())

// Setup server side templating engine --> https://mozilla.github.io/nunjucks/
server.use(views(`${__dirname}/views`, { map: { html: 'nunjucks' }, extension: 'html' }))

// Create routes
server.use(router.routes())
server.use(router.allowedMethods())

// Serve static content from ./client folder for browser
server.use(serve('./client'))

// Start Koa Service
const port = config.service.port || 5000
server.listen(port, () => {
    console.log(`Server start listening on http://localhost:${port}`)
})