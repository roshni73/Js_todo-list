let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
let taskTitle = document.getElementById('new-task-title');
let taskDesc = document.getElementById('new-task-desc');
let taskCat = document.getElementById('new-task-categoty');
let errorMessage = document.getElementById('errorMessage');
let successMessage = document.getElementById('successMessage');
let taskTable = document.getElementById('task-table-body');
let filterSelectStatus = document.getElementById('filter-select-status');
let filterSelectCategory = document.getElementById('filter-select-category');

let todoList = document.getElementById('todoList');
let doingList = document.getElementById('doingList');
let doneList = document.getElementById('doneList');

let listItems = document.querySelectorAll('li');

let cardView = document.getElementById('card-view');
let tableView = document.getElementById('task-html');


function addTask() {
    successMessage.style.display = 'none';
    let taskTitleValue = taskTitle.value.trim();
    let taskDescValue = taskDesc.value.trim();
    let taskCatValue = taskCat.value.trim();

    if (taskTitleValue === '' || taskDescValue === '' || taskCatValue === '') {
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
        tasks.push({ title: taskTitleValue, desc: taskDescValue, category: taskCatValue, status: 'todo' });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        successMessage.style.display = 'block';
        taskTitle.value = '';
        taskDesc.value = '';
        taskCat.value = '';
        displayTasks();
    }
}

function deleteTask(index) {
    let confirmation = confirm("Are you sure you want to delete this task?");
    if (confirmation) {
        tasks = tasks.filter((_, taskIndex) => taskIndex !== index);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();

    }
}

function editTask(index, newText) {
    let updatedTasks = tasks.map((task, i) => {
        if (i === index) {
            return newText.trim() == "" ? task : {...task, title: newText};
        } else {
            return task;
        }
    });
    tasks = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function filterTask(category) {
    if (category === 'all') {
        return displayTasks();
    }
    let filteredTasks;

    if (category.trim() == 'completed' || category.trim() == "todo" || category.trim() == "doing")
    {
        filteredTasks = tasks.filter(task => task.status === category);

    }else{
        filteredTasks = tasks.filter(task => task.category === category);
    }
    displayTasks(filteredTasks);
}

function displayTasks(arr = tasks) {
    taskTable.innerHTML = arr.map((task, index) => `
    <tr>
        <td>
        ${task.title}
        </td>
        <td>${task.desc}</td>
        <td>${task.category}</td>
        <td>${task.status}</td>
        <td>
            <i class="icon-edit-sign" onclick="editTask(${index}, prompt('Enter new text:'))"></i>
            <i class="icon-eye-open" onclick="openModal(tasks[${index}])"></i>
            <i class="icon-thumbs-up" onclick="completeTask(${index})"></i>
            <i class="icon-trash" onclick="deleteTask(${index})"></i>
        </td>
    </tr>
    `).join('');
    populateList(arr);
}

function populateList(arr = tasks) {
    todoList.innerHTML = '';
    doingList.innerHTML = '';
    doneList.innerHTML = '';

    arr.forEach((task,index) => {
        let li = document.createElement('li');

        let title = document.createElement('h3');
        title.textContent = task.title;
        li.appendChild(title);

        let description = document.createElement('p');
        description.textContent = task.desc;
        li.appendChild(description);

        let iconsDiv = document.createElement('div');
        iconsDiv.className = 'icons-cards';


        let editIcon = document.createElement('i');
        editIcon.className = 'icon-edit-sign';
        editIcon.onclick = function() { editTask(task, prompt('Enter new text:'))};
        iconsDiv.appendChild(editIcon);

        let viewIcon = document.createElement('i');
        viewIcon.className = 'icon-eye-open';
        viewIcon.onclick = function() { openModal(task); };
        iconsDiv.appendChild(viewIcon);

        let completeIcon = document.createElement('i');
        completeIcon.className = 'icon-thumbs-up';
        completeIcon.onclick = function() { completeTask(index); };
        iconsDiv.appendChild(completeIcon);

        let deleteIcon = document.createElement('i');
        deleteIcon.className = 'icon-trash';
        deleteIcon.onclick = function() { deleteTask(index); };
        iconsDiv.appendChild(deleteIcon);

        li.appendChild(iconsDiv); 

        if (task.status === 'todo') {
            todoList.appendChild(li);
        } else if (task.status === 'doing') {
            doingList.appendChild(li);
        } else if (task.status === 'completed') {
            doneList.appendChild(li);
        }
        if (task.status === 'completed') {
            doingList.appendChild(li);
           
        } else if (task.status === 'doing') {
            todoList.appendChild(li);
        }

    });
}

function completeTask(index) {
    if(tasks[index].status === 'todo') {
        tasks[index].status = 'doing';
    }else if(tasks[index].status === 'doing') {
        tasks[index].status = 'completed';
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function showHtml(page = "add") {
    const taskForm = document.getElementById('task-form');
    const taskHtml = document.getElementById('task-html');
    if (page == 'add') {
        taskHtml.style.display = 'none';
        taskForm.style.display = 'block';
    } else {
        taskHtml.style.display = 'block';
        taskForm.style.display = 'none';
    }
}

function openModal(task) {
    let modal = document.getElementById("show-task-modal");
    let span = document.getElementsByClassName("close")[1];
    let taskData = document.getElementById("taskData");

    let newElement = document.createElement('p');
    newElement.innerHTML = `Title: ${task.title}<br>Description: ${task.desc}<br>Category: ${task.category}<br>Status: ${task.status ? 'Completed' : 'Pending'}`;
    newElement.setAttribute('class', 'myClass');
    newElement.style.color = 'blue';
    document.body.appendChild(newElement);

    taskData.innerHTML = '';
    taskData.appendChild(newElement);

    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function addTaskForm() {
    document.getElementById("add-task-modal").style.display = "block";
    let modal = document.getElementById("add-task-modal");
    let span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
        modal.style.display = "none";
    }
}

function switchview()
{
    if (tableView.style.display == 'none') {
        tableView.style.display = 'block';
        cardView.style.display = 'none';
    }else{
        tableView.style.display = 'none';
        cardView.style.display = 'flex';
    }
}


window.onload = function () {
    displayTasks();
    tableView.style.display = 'block';
};
