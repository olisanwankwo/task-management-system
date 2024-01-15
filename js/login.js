window.addEventListener('load', () => {
    const storedFullName = localStorage.getItem('fullName');
    if (storedFullName) {
        document.getElementById('userNameDisplay').innerText = storedFullName;
        document.getElementById('user').style.display = 'block';
        document.getElementById('signout').style.display = 'block';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('signout').style.display = 'none';
    }

    const formCategory = document.querySelector("#new-category-form");
    const inputCategory = document.querySelector("#new-category-input");
    const listCategory = document.querySelector("#categories");

    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];

    storedCategories.forEach(category => {
        const taskEl = createCategoryElement(category);
        listCategory.appendChild(taskEl);
    });

    formCategory.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!inputCategory.value.trim()) {
            alert('Please enter a category name.');
            return;
        }

        const category = {
            id: generateCategoryId(),
            name: inputCategory.value
        };

        const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];

        storedCategories.push(category);
        localStorage.setItem('categories', JSON.stringify(storedCategories));

        const taskEl = createCategoryElement(category);
        listCategory.appendChild(taskEl);

        inputCategory.value = '';
    });

    function createCategoryElement(category) {
        const taskEl = document.createElement('div');
        taskEl.classList.add('category');
        taskEl.id = category.id;

        const taskContentEl = document.createElement('div');
        taskContentEl.classList.add('contents');

        taskEl.appendChild(taskContentEl);

        const taskInputEl = document.createElement('input');
        taskInputEl.classList.add('texts');
        taskInputEl.type = 'text';
        taskInputEl.value = category.name;
        taskInputEl.setAttribute('readonly', 'readonly');

        const spanEl = document.createElement('span');
        spanEl.addEventListener('click', () => {
            copyText(category.id);
        });
        spanEl.appendChild(taskInputEl);
        taskContentEl.appendChild(spanEl);

        const taskActionsEl = document.createElement('div');
        taskActionsEl.classList.add('actionss');

        const taskEditEl = document.createElement('button');
        taskEditEl.classList.add('edits');
        taskEditEl.innerText = 'Edit';

        const taskDeleteEl = document.createElement('button');
        taskDeleteEl.classList.add('deletes');
        taskDeleteEl.innerText = 'Delete';

        taskActionsEl.appendChild(taskEditEl);
        taskActionsEl.appendChild(taskDeleteEl);

        taskEl.appendChild(taskActionsEl);

        taskEditEl.addEventListener('click', () => {
            if (taskEditEl.innerText.toLowerCase() == 'edit') {
                taskEditEl.innerText = 'Save';
                taskInputEl.removeAttribute('readonly');
                taskInputEl.focus();
            } else {
                taskEditEl.innerText = 'Edit';
                taskInputEl.setAttribute('readonly', 'readonly');
            }
        });

        taskDeleteEl.addEventListener('click', () => {
            listCategory.removeChild(taskEl);

            const updatedCategories = storedCategories.filter(savedCategory => savedCategory.id !== category.id);
            localStorage.setItem('categories', JSON.stringify(updatedCategories));
        });

        return taskEl;
    }

    function copyText(categoryId) {
        const categoryElement = document.getElementById(categoryId);
        const categoryName = categoryElement.querySelector('.texts').value.trim();

        if (!categoryName) {
            alert('Category name is empty. Please enter a category name.');
            return;
        }

        window.location.href = `task.html?categoryId=${categoryId}`;
    }

    function generateCategoryId() {
        return Date.now().toString();
    }
});









window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categoryId');

    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const formTask = document.querySelector("#new-task-form");
    const inputTask = document.querySelector("#new-task-input");
    const listTask = document.querySelector("#tasks");

    if (categoryId) {
        const tasksForCategory = storedTasks.filter(task => task.categoryId === categoryId);
        tasksForCategory.forEach(task => {
            const taskEl = createTaskElement(task);
            listTask.appendChild(taskEl);
        });
    }

    formTask.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskName = inputTask.value.trim();

        if (!taskName) {
            alert('Please enter a task name.');
            return;
        }

        const task = {
            categoryId: categoryId,
            name: taskName,
            status: getStatusValue(),
            dueDate: getDueDateValue()
        };

        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

        storedTasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));

        const taskEl = createTaskElement(task);
        listTask.appendChild(taskEl);

        inputTask.value = '';
    });

    function createTaskElement(task) {
        const taskEl = document.createElement('div');
        taskEl.classList.add('task');

        const taskContentEl = document.createElement('div');
        taskContentEl.classList.add('content');

        taskEl.appendChild(taskContentEl);

        const taskInputEl = document.createElement('input');
        taskInputEl.classList.add('text');
        taskInputEl.type = 'text';
        taskInputEl.value = task.name;
        taskInputEl.setAttribute('readonly', 'readonly');

        taskContentEl.appendChild(taskInputEl);

        const taskStatusEl = document.createElement('div');
        taskStatusEl.classList.add('status');

        const statusLabelEl = document.createElement('label');
        statusLabelEl.setAttribute('for', 'status');
        statusLabelEl.innerText = 'Status: ';

        const statusSelectEl = document.createElement('select');
        statusSelectEl.setAttribute('id', 'status');
        statusSelectEl.setAttribute('name', 'status');

        const statusOptions = ["Processing", "Completed", "Overdue"];

        statusOptions.forEach(option => {
            const statusOptionEl = document.createElement('option');
            statusOptionEl.setAttribute('value', option.toLowerCase().replace(/\s/g, '-'));
            statusOptionEl.innerText = option;
            statusSelectEl.appendChild(statusOptionEl);
        });

        taskStatusEl.appendChild(statusLabelEl);
        taskStatusEl.appendChild(statusSelectEl);

        taskEl.appendChild(taskStatusEl);

        const taskDueDateEl = document.createElement('div');
        taskDueDateEl.classList.add('due-date');

        const dueDateLabelEl = document.createElement('label');
        dueDateLabelEl.setAttribute('for', 'due-date');
        dueDateLabelEl.innerText = 'Due Date: ';

        const dueDateInputEl = document.createElement('input');
        dueDateInputEl.setAttribute('type', 'date');
        dueDateInputEl.setAttribute('id', 'due-date');
        dueDateInputEl.setAttribute('name', 'due-date');
        dueDateInputEl.value = task.dueDate || ''; // Set the due date if available

        taskDueDateEl.appendChild(dueDateLabelEl);
        taskDueDateEl.appendChild(dueDateInputEl);

        taskEl.appendChild(taskDueDateEl);

        const taskActionsEl = document.createElement('div');
        taskActionsEl.classList.add('actions');

        const taskEditEl = document.createElement('button');
        taskEditEl.classList.add('edit');
        taskEditEl.innerText = 'Edit';

        const taskDeleteEl = document.createElement('button');
        taskDeleteEl.classList.add('delete');
        taskDeleteEl.innerText = 'Delete';

        taskActionsEl.appendChild(taskEditEl);
        taskActionsEl.appendChild(taskDeleteEl);

        taskEl.appendChild(taskActionsEl);

        taskEditEl.addEventListener('click', () => {
            if (taskEditEl.innerText.toLowerCase() == 'edit') {
                taskEditEl.innerText = 'Save';
                taskInputEl.removeAttribute('readonly');
                taskInputEl.focus();
            } else {
                taskEditEl.innerText = 'Edit';
                taskInputEl.setAttribute('readonly', 'readonly');
            }
        });

        taskDeleteEl.addEventListener('click', () => {
            listTask.removeChild(taskEl);

            const updatedTasks = storedTasks.filter(savedTask => savedTask.name !== task.name);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        });

        return taskEl;
    }

    function getStatusValue() {
        const statusSelectEl = document.querySelector('#status');
        return statusSelectEl.options[statusSelectEl.selectedIndex].value;
    }

    function getDueDateValue() {
        const dueDateInputEl = document.querySelector('#due-date');
        return dueDateInputEl.value;
    }
});

