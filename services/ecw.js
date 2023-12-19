const httpClient = require('superagent')

/* ***  getEditToken:  Sample Edit Token Response
    {
    "access_token": "122e8c41909242ca8bdd89462026b954"
    }
*/
module.exports.getEditToken = async (editTokenRequest, bearerToken, { wizard_base_address }) => {
    try {

        /* *** Sample Edit Token Request  
            {
                "buyerCode": "MITCH",
                "certificateUUID":"E3B4AD08-1E04-4CFB-AF7B-92E6E48A3E05"
            }              
        */

        return await httpClient
            .post(`${wizard_base_address}/ecw-service/wizard/v1/createEditToken`)
            .send(editTokenRequest)
            .set('Accept', 'application/json')
            .set('Authorization', bearerToken)

    } catch(exception) {
        console.log(`Failed on authorization token request: ${exception}`)
        console.log(`${(((exception || {}).response || {}).error || {}).text }`)
        return exception.response || exception    
    }
}

module.exports.getOverrides = (config, buyerCode) => {
    const user = config.users.filter(u => u.buyer_code === buyerCode)[0]
    return [ 
        { qId: 2, value: user.company_name }, 
        { qId: 3, value: user.street_address }, 
        { qId: 4, value: user.city }, 
        { qId: 5, value: user.state }, 
        { qId: 6, value: user.zip }, 
        { qId: 7, value: user.country }, 
        { qId: 19, value: user.email }]
}