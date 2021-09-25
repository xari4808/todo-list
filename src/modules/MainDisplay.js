import DOMFactory from "./FactoryFunctions.js";
import { createTaskForm } from "./InitDisplay.js";
import { pubsub } from "./Pubsub.js";
import { updateTask } from "./Task.js";


function getData() {
    pubsub.subscribe('addTaskDOM', log);
    pubsub.subscribe('addTaskDOM', displayTasks);
    pubsub.subscribe('updateThisTask', updateTaskFormView);
    //pubsub.subscribe('updateThisTask', updateTaskFormSubmit);
    //pubsub.subscribe('updateTaskDOM', displayTasks);
    pubsub.subscribe('addProjectDOM', log);
    pubsub.subscribe('addProjectDOM', displayProjects);
    pubsub.subscribe('addTaskInProjectDOM', displayTaskInProject);
}

function log(data) {
    console.log(data);
}

function displayTaskInProject() {       // INCOMPLETE

}

function displayTasks(tasks) {
    deleteAllTasks();
    const projectTitle = document.querySelector('.projectTitle');   //to append at right location
    for (const task of tasks) {
        document.body.insertBefore(createTaskCard(task), projectTitle)
    }
}

function deleteAllTasks() {
    const taskDivNodeList = document.querySelectorAll('.taskDiv');
    if (taskDivNodeList) {
        taskDivNodeList.forEach(taskDiv => taskDiv.remove());
    }
}

function createTaskCard(task) {
    const taskDiv = DOMFactory('div', {className: 'taskDiv'});
    const taskCardObj = {
        init: function() {
            this.createElements();
            this.appendElements();
            this.bindEvents();
        },
        createElements: function() {
            this.taskTitle = DOMFactory('h4', {className: 'taskTitle', textContent: task.title});
            this.taskDesc = DOMFactory('p', {className: 'taskDesc', textContent: task.description});
            this.taskDueDate = DOMFactory('p', {className: 'taskDueDate', textContent: task.dueDate});
            this.taskDelete = DOMFactory('button', {className: 'deleteTask', textContent: "Delete Task", id: task.id});
            this.taskUpdate = DOMFactory('button', {className: 'updateTask', textContent: "Update Task", id: task.id});
        },
        appendElements: function() {
            taskDiv.append(this.taskTitle, this.taskDesc, this.taskDueDate, this.taskDelete, this.taskUpdate);
        },
        bindEvents: function() {
            this.taskDelete.addEventListener('click', this.deleteTaskDOM);
            this.taskUpdate.addEventListener('click',(e) => pubsub.publish('requireTask', e.target.id));
        },
        deleteTaskDOM: function(e) {
            pubsub.publish('deleteTask', e.target.id);
            e.target.parentNode.remove();
        },
    }
    taskCardObj.init();
    return taskDiv
}

function updateTaskFormView(task) {
    const formSection = document.querySelector('section');
    formSection.style.display = "block";
    const form = formSection.firstChild;
    form.elements[0].value = task.title;
    form.elements[1].value = task.description;
    form.elements[2].value = task.dueDate;
    form.elements[3].value = task.priority;
}

// function updateTaskFormSubmit(task) {
//     document.querySelector('.UpdateTask').firstChild.addEventListener('submit', (e) => {
//         e.preventDefault();
//         updateTask(task, document.querySelector('.UpdateTask'));
//         document.querySelector('.UpdateTask').remove();
//     })
// }

function displayProjects(projects) {            // NEED FIX FOR NAMES WITH SAME ALPHABETS DIFFERENT PUNCTUATION
    projects = projects.filter(project => { 
        if (document.getElementById(`${project.filteredTitle}Project`)) return false
        return true
    })
    for (const project of projects) {
        const projectName = DOMFactory('h3', {id: `${project.filteredTitle}Project`, className: "projectName",
                                              textContent: `${project.title}`});
        const addTaskInProjectButton = DOMFactory('button', {id: `${project.filteredTitle} button`,
                                                             textContent: `Add Task in ${project.title}`})
        const taskInProjectForm = createTaskForm(`TaskIn${project.filteredTitle}`);
        addTaskInProjectButton.addEventListener('click', () => {
            taskInProjectForm.style.display = "block";
        })                                     
        document.body.append(projectName, addTaskInProjectButton);
        document.body.append(taskInProjectForm);
    }
}

export default getData;