document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const pCountDisp = document.getElementById('p-count');
    const cCountDisp = document.getElementById('c-count');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortBtn = document.getElementById('sort-btn');

    const editModal = document.getElementById('edit-modal');
    const editText = document.getElementById('edit-text-input');
    const editStatus = document.getElementById('edit-status-input');

    const clearAllTrigger = document.getElementById('clear-all-trigger');
    const clearModal = document.getElementById('clear-modal');

    let tasks = JSON.parse(localStorage.getItem('adaptive_db')) || [];
    let currentFilter = 'all';
    let editingId = null;

    function render() {
        pCountDisp.innerText = tasks.filter(t => !t.completed).length;
        cCountDisp.innerText = tasks.filter(t => t.completed).length;

        let filteredTasks = tasks.filter(t => {
            if (currentFilter === 'pending') return !t.completed;
            if (currentFilter === 'completed') return t.completed;
            return true;
        });

        todoList.innerHTML = '';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'is-completed' : ''}`;
            li.innerHTML = `
                <div>
                    <span style="font-weight: 600; display: block;">${task.text}</span>
                    <span class="task-tag ${task.completed ? 'tag-completed' : 'tag-pending'}">
                        ${task.completed ? 'Completed' : 'Pending'}
                    </span>
                </div>
                <div class="actions">
                    <button onclick="openEdit(${task.id})">✏️</button>
                    <button onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            `;
            todoList.appendChild(li);
        });
        localStorage.setItem('adaptive_db', JSON.stringify(tasks));
    }

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = todoInput.value.trim();
        if (val) {
            tasks.push({ id: Date.now(), text: val, completed: false });
            todoInput.value = '';
            render();
        }
    });

    window.deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        render();
    };

    clearAllTrigger.addEventListener('click', () => {
        if (tasks.length > 0) clearModal.style.display = 'flex';
    });

    window.closeClearModal = () => clearModal.style.display = 'none';

    window.confirmClearAll = () => {
        tasks = [];
        closeClearModal();
        render();
    };

    sortBtn.addEventListener('click', () => {
        tasks.sort((a, b) => a.text.localeCompare(b.text));
        render();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    window.openEdit = (id) => {
        const task = tasks.find(t => t.id === id);
        editingId = id;
        editText.value = task.text;
        editStatus.value = task.completed ? 'completed' : 'pending';
        editModal.style.display = 'flex';
    };

    window.closeModal = () => {
        editModal.style.display = 'none';
        editingId = null;
    };

    window.applyUpdate = () => {
        const newText = editText.value.trim();
        if (newText) {
            tasks = tasks.map(t => t.id === editingId ?
                { ...t, text: newText, completed: editStatus.value === 'completed' } : t
            );
            closeModal();
            render();
        }
    };

    render();
});