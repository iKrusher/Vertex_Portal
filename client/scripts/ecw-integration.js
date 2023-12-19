/*global vertex*/
(async function () {
    const { ecwProperties, ecwAccessToken, bindWizard } = await initializeWizard()

    setTokenTimeOut(ecwAccessToken)

    // Launch Wizard in edit/renew mode, if we receive URL params (rejection email url)
    const { certUuidParam,actionTypeParam,editTokenParam  } = getUrlSearchParams()

    bindWizard(document.querySelector('#tax-exemption-button'), actionTypeParam, certUuidParam, editTokenParam)
    certUuidParam && document.querySelector('#tax-exemption-button').click() // Click if Edit or Renew!

    // Listen for events being posted from the ECW iframe
    window.addEventListener('message', async (event) => {
        if (event.data && event.data.type == 'createdCertificates') {

            document.querySelector('#edit-renew-container').removeAttribute('hidden')

            // We have a createdCertificates event.  We will now loop through, and create EDIT/RENEW links
            event.data.data.forEach(async (cert) => {

                const certificateEditTokenResponse = await fetch(`${window.origin}/ecw-edit-token`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${ecwAccessToken.access_token}`
                    },
                    body: JSON.stringify({
                        buyerCode: ecwProperties.buyerCode,
                        certificateUUID: cert.id
                    })
                })
                const { access_token: editToken } = await certificateEditTokenResponse.json()

                const { editNode, renewNode } = appendEditRenewNode(cert, editToken)
                bindWizard(editNode, 'EDIT', cert.id, editToken)
                bindWizard(renewNode, 'RENEW', cert.id, editToken)
            })
        }
    })

    function showError(error) {
        document.querySelector('#error').innerText = JSON.stringify(error)
        document.querySelector('#error').removeAttribute('hidden')
    }
    
    async function initializeWizard() {
        const ecwAccessTokenResponse = await fetch(`${window.origin}/ecw-access-token`)
        const ecwAccessToken = await ecwAccessTokenResponse.json()
    
        if (!ecwAccessToken.access_token) {
            showError(ecwAccessToken)
            throw ecwAccessToken
        }
    
        const ecwPropertiesResponse = await fetch(`${window.origin}/ecw-properties`)
        const ecwProperties = await ecwPropertiesResponse.json()
    
        // Binds Wizard to a domNode which launches ECW in an iframe, when clicked
        return {
            ecwProperties: ecwProperties,
            ecwAccessToken: ecwAccessToken,
            bindWizard: (domNode, action, certificateId, editToken) => new vertex.Wizard({
                wizardPath: ecwProperties.wizardPath,
                domNode: domNode,
                accessToken: ecwAccessToken.access_token,
                clientCode: ecwProperties.clientCode,
                sellerCodes: [ecwProperties.sellerCode],
                buyerCode: ecwProperties.buyerCode,
                overrides: action ? {} : ecwProperties.overrides,
                action: action,
                editToken: editToken,
                certificateId: certificateId
            })
        }
    }
    
    function appendEditRenewNode(cert, editToken) {
        const template = document.querySelector('#certificate-template')
        const newNode = document.importNode(template.content, true)
    
        newNode.querySelector('strong[name="certificate-title"]').innerText = cert.certTitle
        newNode.querySelector('span[name="certificate-id"]').innerText = cert.id
        newNode.querySelector('a[name="edit-token"]').innerText = editToken

        newNode.querySelector('a[name="edit-link"]').setAttribute('href', `${window.location.origin}/certificate?cert=${cert.id}&token=${editToken}&action=EDIT`)
        newNode.querySelector('a[name="renew-link"]').setAttribute('href', `${window.location.origin}/certificate?cert=${cert.id}&token=${editToken}&action=RENEW`)
        newNode.querySelector('a[name="edit-link"]').innerText = `${window.location.origin}/certificate?cert=${cert.id}&token=${editToken}&action=EDIT`
        newNode.querySelector('a[name="renew-link"]').innerText = `${window.location.origin}/certificate?cert=${cert.id}&token=${editToken}&action=RENEW`
        
        document.querySelector('#edit-renew-list').appendChild(newNode)
    
        const editButton = document.querySelector('[name="certificate-edit-renew-section"]:last-child [name="edit-link"]')
        const renewButton = document.querySelector('[name="certificate-edit-renew-section"]:last-child [name="renew-link"]')
    
        return { editNode: editButton, renewNode: renewButton }
    }
    
    function setTokenTimeOut(ecwAccessToken) {
        const expires = new Date(Date.now() + ecwAccessToken.expires_in * 1000)
        const timeOutElement = document.querySelector('#token-time-out')
    
        const pad = (num) => `0${num}`.substr(num > 9 ? 1 : 0)
    
        timeOutElement && window.setInterval(() => {
            const diff = expires - Date.now()
            const minutes = pad(Math.floor((diff / 1000) / 60))
            const seconds = pad(Math.floor((diff / 1000)) - minutes * 60)
            timeOutElement.innerText = `${minutes}:${seconds}`
        }, 1000)
    }
    
    function getUrlSearchParams() {
        // In case of an Edit or Renew link
        const urlParams = new URLSearchParams(window.location.search)
        return {
            certUuidParam: urlParams.get('cert'),
            actionTypeParam: urlParams.get('action'),
            editTokenParam: urlParams.get('token')
        }
    }    

})()