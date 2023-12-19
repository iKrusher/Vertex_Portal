const ecwService = require('../services/ecw')
const ecwAuthService = require('../services/ecw-auth')

module.exports.getEcwProperties = (config) => async (ctx, next) => {
    const buyerCode = ctx.cookies.get('buyerCode')

    ctx.body = { 
        wizardPath: `${config.ecw.wizard_base_address}/wizard/`,
        clientCode: config.ecw.client_code,
        sellerCode: config.ecw.seller_code,
        buyerCode: buyerCode,
        overrides: ecwService.getOverrides(config, buyerCode)
    }

    return next()   
}

module.exports.getAccessToken = ( { ecw } ) => async (ctx, next) => {
    const response = await ecwAuthService.getAccessToken(ecw) 

    const success = () => ctx.body = response.body
    const failure = () => {
        ctx.body = response.body || response
        ctx.status = response.status || 500
    }

    (((response) || {}).body || {}).access_token ? success() : failure()
    return next()  
}

module.exports.getCertificateEditToken = ( { ecw } ) => async (ctx, next) => {
    const response = await ecwService.getEditToken(
        ctx.request.body, 
        ctx.header.authorization, 
        ecw) 

    const success = () => ctx.body = response.body
    const failure = () =>  {
        ctx.body = response.body || response
        ctx.status = response.status || 500
    }

    (((response) || {}).body || {}).access_token ? success() : failure()
    return next()
}
