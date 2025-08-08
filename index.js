const renderTasksProgressData = (tasks) => {
    let tasksProgress;
    const tasksProgressDOM = document.getElementById('tasks-progress');

    if (tasksProgressDOM) {
        tasksProgress = tasksProgressDOM;
    } else {
        const newTasksPrograssDOM = document.createElement('div');
        newTasksPrograssDOM.id = 'tasks-progress';
        document.getElementById('todo-footer').appendChild(newTasksPrograssDOM);
        tasksProgress = newTasksPrograssDOM;
    }

    const doneTasks = tasks.filter(task => task.checked).length;
    const totalTasks = tasks.length;
    tasksProgress.textContent = `${doneTasks} de ${totalTasks} concluídas`;
}

const getTasksFromLOcalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
};

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
};

const removeTask = (taskId) => {
    const tasks = getTasksFromLOcalStorage();
    const updatedTasks = tasks.filter(({ id }) => parseInt(id) !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks);
    renderTasksList(updatedTasks);
};

const removeDoneTasks = () => {
    if (confirm('Tem certeza de que deseja remover todas as tarefas concluídas?')) {
        const tasks = getTasksFromLOcalStorage();
        const tasksToRemove = tasks.filter(({ checked }) => checked).map(({ id }) => id);
        const updatedTasks = tasks.filter(({ checked }) => !checked);
        setTasksInLocalStorage(updatedTasks);
        renderTasksList(updatedTasks);
    }
};

const onConcludeButtonClick = (taskId) => {
    const tasks = getTasksFromLOcalStorage();
    const updatedTasks = tasks.map(task => 
        parseInt(task.id) === parseInt(taskId)
            ? { ...task, checked: true }
            : task
    );
    setTasksInLocalStorage(updatedTasks);
    renderTasksList(updatedTasks);
};

const createTaskListItem = (task) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');
    toDo.id = `task-${task.id}`;

    const taskContentWrapper = document.createElement('div');
    taskContentWrapper.className = 'task-content-wrapper';
    
    const taskInfoWrapper = document.createElement('div');
    taskInfoWrapper.className = 'task-info-wrapper';

    const taskLabel = document.createElement('span');
    taskLabel.textContent = task.description;
    taskLabel.className = 'task-label';
    taskInfoWrapper.appendChild(taskLabel);

    const tagAndDateWrapper = document.createElement('div');
    tagAndDateWrapper.className = 'tag-and-date-wrapper';
    
    if (task.tag) {
        const taskTag = document.createElement('span');
        taskTag.textContent = task.tag;
        taskTag.className = 'task-tag';
        tagAndDateWrapper.appendChild(taskTag);
    }
    
    const taskDate = document.createElement('span');
    taskDate.textContent = task.date;
    taskDate.className = 'task-date';
    tagAndDateWrapper.appendChild(taskDate);
    
    taskInfoWrapper.appendChild(tagAndDateWrapper);

    const concludeTaskButton = document.createElement('button');
    concludeTaskButton.textContent = 'Concluir';
    concludeTaskButton.ariaLabel = 'Concluir tarefa';
    concludeTaskButton.className = 'conclude-task-btn';
    concludeTaskButton.onclick = () => onConcludeButtonClick(task.id);
    
    const removeTaskButton = document.createElement('button');
    removeTaskButton.ariaLabel = 'remover tarefa';
    removeTaskButton.className = 'remove-task-btn';
    removeTaskButton.onclick = () => removeTask(task.id);

    const checkIcon = document.createElement('img');
    checkIcon.src = './imagens/check.svg';
    checkIcon.alt = 'Ícone de check';
    checkIcon.className = 'check-icon';
    
    removeTaskButton.appendChild(checkIcon);

    taskContentWrapper.appendChild(taskInfoWrapper);
    
    if (task.checked) {
        taskContentWrapper.appendChild(removeTaskButton);
    } else {
        taskContentWrapper.appendChild(concludeTaskButton);
    }

    toDo.appendChild(taskContentWrapper);
    list.appendChild(toDo);

    if (task.checked) {
        toDo.classList.add('task-done');
    }

    return toDo;
};

const getNewTaskaid = () => {
    const tasks = getTasksFromLOcalStorage();
    const lastid = tasks[tasks.length - 1]?.id;
    return lastid ? parseInt(lastid) + 1 : 1;
};

const getNewTaskDate = (event) => {
    const description = event.target.elements.description.value;
    const tag = event.target.elements.tag.value;
    const date = new Date().toLocaleDateString('pt-BR');
    const id = getNewTaskaid();

    return { description, tag, date, id };
};

const createTask = async (event) => {
    event.preventDefault();
    document.getElementById('save-task').setAttribute('disabled', true);
    
    if (!event.target.elements.description.value.trim()) {
        alert('O nome da tarefa não pode ser vazio.');
        document.getElementById('save-task').removeAttribute('disabled');
        return;
    }
    
    const newTaskData = getNewTaskDate(event);

    const tasks = getTasksFromLOcalStorage();
    const updatedTasks = [
        ...tasks,
        { id: newTaskData.id, description: newTaskData.description, tag: newTaskData.tag, date: newTaskData.date, checked: false }
    ];
    setTasksInLocalStorage(updatedTasks);
    renderTasksList(updatedTasks);

    event.target.reset();
    document.getElementById('save-task').removeAttribute('disabled');
};

const renderTasksList = (tasks) => {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    tasks.forEach(createTaskListItem);
    renderTasksProgressData(tasks);
};

window.onload = function () {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);

    let tasks = getTasksFromLOcalStorage();
    
    if (tasks.length === 0) {
        const defaultTasks = [
            { id: 1, description: 'Estudar JavaScript', tag: 'Programação', date: '07/08/2025', checked: false },
            { id: 2, description: 'Fazer compras no mercado', tag: 'Casa', date: '07/08/2025', checked: false },
            { id: 3, description: 'Responder e-mails', tag: 'Trabalho', date: '07/08/2025', checked: true }
        ];
        setTasksInLocalStorage(defaultTasks);
        tasks = defaultTasks;
    }
    
    renderTasksList(tasks);
};