const httpClient = require('superagent')

/* ***  getToken:  Sample Token Response
    {
        "access_token": "83926e9509ff6b5eb8140f6e3841dfec",
        "expires_in": 1200,
        "token_type": "Bearer",
    }
*/
module.exports.getAccessToken = async ({ client_id, client_secret, auth_endpoint}) => {
    try {
        return await httpClient.post(auth_endpoint)
            .type('form')
            .send({ client_id: client_id })
            .send({ client_secret: client_secret })
            .send({ grant_type: 'client_credentials' })
            .send({ scope: 'vtms-internal-api ecw-wizard-api' })           
    } catch(exception) {
        console.log(`Failed on authorization token request: ${exception}`)
        console.log(`${(((exception || {}).response || {}).error || {}).text }`)
        return exception.response || exception
    }
}
