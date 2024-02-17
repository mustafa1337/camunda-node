import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";
import nodemailer from 'nodemailer';

const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
const client = new Client(config);

// Abgabedatum ausrechnen
client.subscribe("calculate_due_date", async function({ task, taskService }) {
  console.log("Processing task:", task);

  const startDate = new Date(task.variables.get("start_date"));
  console.log("Start Date:", startDate);
  
  let dueDate = new Date(startDate);
  const thesisType = task.variables.get("thesis_type")

  //Abgabedatum abhängig von Abschlussart automatisch ausrechnen
  if (thesisType == 'bachelor'){
    dueDate.setDate(startDate.getDate() + 9 * 7);
  }
  if (thesisType == 'master_3_semester' || thesisType == 'master_4_semester') {
    dueDate.setDate(startDate.getDate() + 22 * 7);
  }

  //Abgabedatum übergeben
  const processVariables = new Variables();
  processVariables.set("due_date", dueDate);
  console.log("Abgabedatum: " + dueDate)

  //Task abschliessen
  await taskService.complete(task, processVariables);
  console.log("Task completed: Abgabedatum berechnen");

});

// Student über die Genehmigung per Email informieren
client.subscribe("genehmigung_an_student_abschicken", async function({ task, taskService }) {

  const namen = task.variables.get("student_name")
  const topic = task.variables.get("thesis_title")
  const thesisType = task.variables.get("thesis_type")
  const supervisor1 = task.variables.get("first_supervisor")
  const supervisor2 = task.variables.get("second_supervisor")
  const startDate = task.variables.get("start_date")
  let endDate = task.variables.get("due_date")

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
        subject: 'Information zur Abschlussarbeit',
        text: 'Hallo Herr/Frau ' + namen + '. Sie wurden zur Abschlussarbeit ' + topic + ' zugelassen.' + '\n' +
        'Ihre Betreuer sind: ' + '\n' +
        supervisor1 + '\n' +
        supervisor2 + '\n' +
        'Startdatum: ' + startDate + '\n' +
        'Enddatum: ' + endDate

      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
    await taskService.complete(task);
    console.log("Task completed: Student per E-Mail informieren");
});

//Späteste Abgabedatum ausrechnen
client.subscribe("calculate_maximal_dueDate", async function({ task, taskService }) {

  let dueDate = task.variables.get("due_date");
  
  console.log("Due Date is: " +  dueDate);

  let latestDueDatePossible = new Date(dueDate);
  const maxPostponingWeeks = task.variables.get("postponing_weeks"); //integer Wert aus der DMN Entscheidungstabelle 
  console.log("Maximum Postponing Weeks: " + maxPostponingWeeks);

  //Abgabedatum + Maximale Verlängerung in Wochen = Maximales Verlängerungsdatum
  latestDueDatePossible.setDate(new Date(dueDate).getDate() + maxPostponingWeeks * 7);
  console.log("Latest due date possible : " + latestDueDatePossible);

  const processVariables = new Variables();
  processVariables.set("latestPostponeDate", latestDueDatePossible);
  
  //Task abschliessen
  await taskService.complete(task, processVariables);
  console.log("Task completed: Spätesten Verlängerungsdatum ausrechnen");
});

client.subscribe("calculate_postpone_duedate", async function({ task, taskService }) {
  console.log("AAAAA")
  let postponeDays = task.variables.get("days_to_prolong");
  let dueDate = new Date(task.variables.get("due_date"));
  let latestDueDatePossible = new Date(task.variables.get("latestPostponeDate"));
  const processVariables = new Variables();
  console.log("BBBBB")

  if (dueDate.getTime() + (postponeDays * 24 * 60 * 60 * 1000) <= latestDueDatePossible.getTime()) {
    // Wenn maximale Dauer nicht überschritten ist, dann setze neues verlängertes Abgabedatum
    console.log("CCCCCC")
    dueDate.setDate(dueDate.getDate() + postponeDays);
    console.log("New due_date: " + dueDate);
    
    // Das Abgabedatum in den Prozessvariablen aktualisieren
    processVariables.set("due_date", dueDate);
    console.log("Neues Abgabedatum: " + dueDate);
  } else {

    console.log("Maximales Abgabedatum/Verlängerung überschritten!")

    processVariables.set("due_date", latestDueDatePossible);
    console.log("Späteste Abgabedatum zugewiesen: " + latestDueDatePossible);

  }

  // Task abschließen und Ergebnis zurückgeben
  await taskService.complete(task, processVariables);
  console.log("Task completed: Neues Abgabedatum berechnen " + dueDate);

});


client.subscribe("student_verlaengerung_informieren", async function({ task, taskService }) {

  const namen = task.variables.get("student_name")
  let endDate = task.variables.get("due_date")

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
        subject: 'Information zur Abschlussarbeit',
        text: 'Hallo Herr/Frau ' + namen + '. Das neue Abgabedatum ist: ' + endDate
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
    await taskService.complete(task);
    console.log("Task completed: Student über Verlängerung informieren");
});

