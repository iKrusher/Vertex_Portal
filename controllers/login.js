module.exports.getLogin = (config) => async (ctx, next) => {
    ctx.cookies.set('buyerCode', '')
    await ctx.render('login', { 
        config: config, 
        queryString: ctx.request.querystring ? `?${ctx.request.querystring}` : ctx.request.querystring
    })
    return next() 
}

module.exports.postLogin = async (ctx) => {
    ctx.cookies.set('buyerCode', ctx.request.body.buyerCode)
    ctx.request.querystring ? ctx.redirect(`/certificate?${ctx.request.querystring }`)  : ctx.redirect('/checkout') 
}