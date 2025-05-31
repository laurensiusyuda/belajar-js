document.addEventListener('DOMContentLoaded', function() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    const submitButton = document.getElementById('form');
    const RENDER_EVENT = 'render-todo';

    submitButton.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodo();
    });

    document.addEventListener(RENDER_EVENT, function() {
        const uncompletedTODOList = document.getElementById('todos');
        const completedTODOList = document.getElementById('completed-todos');

        uncompletedTODOList.innerHTML = '';
        completedTODOList.innerHTML = '';

        console.log(uncompletedTODOList);

        for (const todoItem of todos) {
            const todoElement = makeTodo(todoItem);
            if (!todoItem.isCompleted) {
                uncompletedTODOList.append(todoElement);
            } else {
                completedTODOList.append(todoElement);
            }
        }
    });

    document.dispatchEvent(new Event(RENDER_EVENT));


    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function generatedId() {
        return +new Date();
    }

    function generatedTodoObject(id, task, timestamp, timeschedule, isCompleted) {
        return {
            id,
            task,
            timestamp,
            timeschedule,
            isCompleted
        };
    }

    function addTodo() {
        const textTodo = document.getElementById('title').value;
        const timestamp = document.getElementById('date').value;
        const timeschedule = document.getElementById('time').value;

        const generatedID = generatedId();
        const todoObject = generatedTodoObject(generatedID, textTodo, timestamp, timeschedule, false);

        todos.push(todoObject);
        saveTodos();
        document.dispatchEvent(new Event(RENDER_EVENT));

    }

    function makeTodo(todoObject) {
        const textTitle = document.createElement('h2');
        const textTimestamp = document.createElement('p');
        const textTimestampSchedule = document.createElement('p');

        const textContainer = document.createElement('div');
        const container = document.createElement('div');

        textTitle.innerText = todoObject.task;
        textTimestamp.innerText = todoObject.timestamp;
        textTimestampSchedule.innerText = todoObject.timeschedule;

        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTimestamp, textTimestampSchedule);

        container.classList.add('item', 'shadow');
        container.append(textContainer);

        container.setAttribute('id', `todo-${todoObject.id}`);

        if (todoObject.isCompleted) {
            const undoButton = document.createElement('button');
            const trashButton = document.createElement('button');
            undoButton.classList.add('undo-button');
            trashButton.classList.add('trash-button');

            undoButton.addEventListener('click', function() {
                undoTaskFromCompleted(todoObject.id);
            });

            trashButton.addEventListener('click', function() {
                removeTaskFromCompleted(todoObject.id);
            });

            container.append(undoButton, trashButton);
        } else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');
            checkButton.addEventListener('click', function() {
                addTaskToCompleted(todoObject.id);
            });
            container.append(checkButton);
        }
        return container;
    }

    function addTaskToCompleted(todoID) {
        const todoTarget = findTodo(todoID);
        if (todoTarget == null) return;
        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function findTodo(todoID) {
        for (const todoItem of todos) {
            if (todoItem.id == todoID) {
                return todoItem;
            }
        }
        return null;
    }

    function findTodoIndex(todoID) {
        for (const index in todos) {
            if (todos[index].id === todoID) {
                return index;
            }
        }
        return -1;
    }

    function undoTaskFromCompleted(todoID) {
        const todoTarget = findTodo(todoID);
        if (todoTarget == null) return;
        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function removeTaskFromCompleted(todoID) {
        const todoTarget = findTodoIndex(todoID);
        if (todoTarget === -1) return;
        todos.splice(todoTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

});