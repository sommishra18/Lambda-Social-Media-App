const commentMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');

queue.process('emails', function(job, done){
    console.log("Emails working is processing the job!", job.data);
    commentMailer.newComment(job.data);
    done();
});
