const path = require("path");

module.exports = {
    entry : "./src/client.js",
    mode : 'development',
    output : {
        path : path.resolve(__dirname, 'Public'),
        filename :  "client.js",
    }
    
}