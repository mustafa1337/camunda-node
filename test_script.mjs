import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";
import nodemailer from 'nodemailer';

const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
const client = new Client(config);


client.subscribe("calculate-due-date", async function({ task, taskService }) {
    console.log("Processing task:", task);

    const startDate = new Date(task.variables.get("start_date"));
    console.log("Start Date:", startDate);
    
    const type = task.variables.get("type");
    console.log("Type:", type);
    
    let numWeeks = 9;
    if (type == 'master') { numWeeks = 22 };
    
    let dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + numWeeks * 7);
    console.log("Due Date:", dueDate);
    
    const processVariables = new Variables();
    processVariables.set("due_date", dueDate);
    
    await taskService.complete(task, processVariables);
    console.log("Task completed");
});


client.subscribe("email_versenden", async function({ task, taskService }) {
    var transporter = nodemailer.createTransport({
        service: 'ethereal',
        auth: {
          user: 'jamel.oreilly@ethereal.email',
          pass: 'uMWRV5EQWNp6yDg34N'
        }
      });
      
      var mailOptions = {
        from: 'jamel.oreilly@ethereal.email',
        to: 'jamel.oreilly@ethereal.email',
        subject: 'Sending Email using Node.js',
        text: 'Sending a mail with NodeJS yeeaa!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
    await taskService.complete(task);
    console.log("Task completed");
});
