const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment')

let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        // relative path is where this function is called
        path.join(__dirname , '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err) { console.log('error in rendering template ! '); return;}

            mailHTML = template;
        }
    )

    return mailHTML;
}

//exporting
module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}
