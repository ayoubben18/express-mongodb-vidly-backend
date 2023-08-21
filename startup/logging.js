// require('winston-mongodb');
const winston = require('winston');
require('express-async-errors');


module.exports = function(){
    process.on('uncaughtException',(ex)=>{
        winston.error(ex.message,ex);
        process.exit(1);
    })
    
    winston.handleExceptions(
        winston.transports.File,{filename:'uncaughtException.log'});
    
    process.on('unhandledRejection',(ex)=>{
        throw ex;
    })
    
    winston.add(winston.transports.File,{ filename: 'logfile.log' });
    // winston.add( winston.transports.MongoDB,{
    //     db:'mongodb://127.0.0.1:27017/vidly',
    //     level:'info'
    // });
    
}