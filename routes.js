const Router = require('@koa/router')
const loginController = require('./controllers/login')
const checkoutController = require('./controllers/checkout')
const ecwController = require('./controllers/ecw')
const certificateController = require('./controllers/certificate')

const router = new Router()

module.exports = (config) => {

    router.get('/', async (ctx) => {
        ctx.redirect('/checkout')  
    })

    // Page rendering endpoints
    router.get('/login', loginController.getLogin(config))
    router.post('/login', loginController.postLogin)
    router.get('/checkout', checkoutController.getCheckout(config))
    router.get('/certificate', certificateController.getCertificate(config))

    // REST API endpoints
    router.get('/ecw-properties', ecwController.getEcwProperties(config))
    router.get('/ecw-access-token', ecwController.getAccessToken(config))
    router.post('/ecw-edit-token', ecwController.getCertificateEditToken(config))

    return router
}