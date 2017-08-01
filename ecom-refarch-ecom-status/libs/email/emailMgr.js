/**
 * Email manager is used to manage email queue / sending / error handling etc
 */
var nodemailer=require("nodemailer");
var emailQueue=[];

//Init email manager component. This needs be called when system starts.
function init(cb){

}
//enqueue an email. This will return immediately and email will be processed shortly
function enqueueEmail(params){

}

//retrieve email agent according to email configuration
function getEmailAgent(params){

}
//send an email
function sendEmail(params,cb){

}
//process email queue. each time will only process one email.
function processQueue(cb){

}
