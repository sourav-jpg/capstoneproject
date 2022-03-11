const {createLogger , transports , format } = require('winston')

const logger = createLogger({
    transports:[
        new transports.File({
               filename:'data.log',
               level:'error',
               format:format.combine(format.timestamp(),format.json())
        })
    ]
})

module.exports = logger;