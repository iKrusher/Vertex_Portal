const fs = require('fs')
const toml = require('toml')

// Why use TOML instea of a .env file?  TOML supports a richer
// set of data types, including arrays.  We needed arrays for the
// creating of our users.
module.exports.configuration = (path) => {
    const config = toml.parse(fs.readFileSync(path, 'utf-8'))
    
    overrideWithEnv(config.service) 
    overrideWithEnv(config.ecw)
    
    return config
}

function overrideWithEnv(config, prefix = 'BDB_') {
    Object.keys(config).forEach(
        k => {
            const envVar = `${prefix}${k.toUpperCase()}`
            config[k] = process.env[envVar] || config[k]
        }
    )
}