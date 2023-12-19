module.exports.getCertificate = (config) => async (ctx, next) => {
    const buyerCode = ctx.cookies.get('buyerCode')

    const renderCheckout = () => ctx.render('certificate', { 
        username: config.users.filter((x) => x.buyer_code === buyerCode)[0].username,
        config: config  
    })
    const redirectToLoginPage = () =>  ctx.redirect(`/login?${ctx.request.querystring}`)

    buyerCode ? await renderCheckout() : redirectToLoginPage()
    return next()
}