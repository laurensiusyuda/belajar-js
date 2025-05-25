document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('form');

    const todos = [];
    const RENDER_EVENT = 'render-todo';

    submitButton.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodo();
    });

    document.addEventListener(RENDER_EVENT, function() {
        console.log(todos);
        const uncompletedTODOList = document.getElementById('todos');
        uncompletedTODOList.innerHTML = '';
        console.log(uncompletedTODOList);

        for (const todoItem of todos) {
            const todoElement = makeTodo(todoItem);
            uncompletedTODOList.append(todoElement);
        }

    });

    function generatedId() {
        return +new Date();
    }

    function generatedTodoObject(id, task, timestamp, isCompleted) {
        return {
            id,
            task,
            timestamp,
            isCompleted
        };
    }

    function addTodo() {
        const textTodo = document.getElementById('title').value;
        const timestamp = document.getElementById('date').value;

        const generatedID = generatedId();
        const todoObject = generatedTodoObject(generatedID, textTodo, timestamp, false);

        todos.push(todoObject);
        document.dispatchEvent(new Event(RENDER_EVENT));

    }

    function makeTodo(todoObject) {
        const textTitle = document.createElement('h2');
        const textTimestamp = document.createElement('p');
        const textContainer = document.createElement('div');
        const container = document.createElement('div');

        textTitle.innerText = todoObject.task;
        textTimestamp.innerText = todoObject.timestamp;

        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTimestamp);

        container.classList.add('item', 'shadow');
        container.append(textContainer);
        container.setAttribute('id', `todo-${todoObject.id}`);

        // ! check apakah todo sudah selesai atau tidak 
        if (todoObject.isCompleted) {
            const undoButton = document.createElement('button');
            const trashButton = document.createElement('button');
            undoButton.classList.add('undo-button');
            trashButton.classList.add('trash-button');
            undoButton.addEventListener('click', function() {});
            trashButton.addEventListener('click', function() {});
            container.append(undoButton, trashButton);
        } else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');
            checkButton.addEventListener('click', function() {});
            container.append(checkButton);
        }

        return container;
    }

});