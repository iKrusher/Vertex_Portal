module.exports.getCheckout = (config) => async (ctx, next) => {

    const buyerCode = ctx.cookies.get('buyerCode')

    const renderCheckout = () => ctx.render('checkout', { 
        username: config.users.filter((x) => x.buyer_code === buyerCode)[0].username,
        config: config  
    })
    const redirectToLoginPage = () =>  ctx.redirect('/login')

    buyerCode ? await renderCheckout() : redirectToLoginPage()
    return next()
}
