import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";

const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };
const client = new Client(config);

/*
client.subscribe("calculate-due-date", async function({ task, taskService }) {
	const startDate = task.variables.get("start_date");
	const type = task.variables.get("type");
	let numWeeks = 9;
	if (type == 'master') {numWeeks = 22};
	let dueDate = new Date();
    dueDate.setDate(startDate.getDate() + numWeeks * 7);
	const processVariables = new Variables();
    processVariables.set("due_date", dueDate);
	
    await taskService.complete(task, processVariables);
}); 
*/


// Füge Log-Statements hinzu
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

