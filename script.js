<<<<<<< HEAD
// Ambil elemen-elemen utama
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('task');
const dueDateInput = document.getElementById('dueDate');
const taskList = document.getElementById('taskList');
const priorityButtons = document.querySelectorAll('.priority-btn');
const themeToggleButton = document.getElementById('themeToggle');
const body = document.body;
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const toggleSidebarButton = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const errorMessage = document.getElementById('error-message');

// Variabel untuk prioritas yang dipilih
let selectedPriority = 'low';

// Fungsi untuk mengatur prioritas
priorityButtons.forEach(button => {
    button.addEventListener('click', () => {
        // set semua tombol ke non-aktif
        priorityButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
        // Set tombol yang diklik ke aktif
        button.setAttribute('aria-pressed', 'true');
    });
});

// Fungsi untuk menambah tugas ke daftar
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const currentDate = new Date();
    const selectedDate = new Date(dueDate);

    // Validasi input
    errorMessage.textContent = '';
    if (!taskText) {
        errorMessage.textContent += 'Teks tugas tidak boleh kosong!\n';
    }
    if (!dueDate) {
        errorMessage.textContent += 'Tanggal batas waktu harus diisi!\n';
    }
    if (selectedDate < currentDate) {
        errorMessage.textContent += 'Tanggal batas waktu tidak boleh lebih kecil dari tanggal saat ini!\n';
    }
    if (errorMessage.textContent) {
        return;
    }

    // Format tanggal
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }).format(selectedDate);

    // Buat elemen tugas baru
    const listItem = document.createElement('li');
    listItem.classList.add(selectedPriority);
    listItem.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <span class="task-text">${taskText}</span> - 
        <span class="task-due-date">${formattedDate}</span> - 
        <span class="task-priority">${selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}</span>
        <button class="delete-task" aria-label="Hapus Tugas">🗑️</button>
    `;
    taskList.appendChild(listItem);

    // Reset form dan prioritas
    taskForm.reset();
    selectedPriority = 'low';
    priorityButtons.forEach(button => button.classList.remove('active'));
    document.getElementById('lowPriority').classList.add('active');

    // Simpan tugas ke localStorage
    saveTasks();
});

// Fungsi untuk menghapus dan menandai tugas
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
        e.target.parentElement.remove();
        saveTasks();
    } else if (e.target.classList.contains('task-checkbox')) {
        const taskText = e.target.nextElementSibling;
        taskText.style.textDecoration = e.target.checked ? 'line-through' : 'none';
        saveTasks();
    }
});

// Fungsi untuk mengganti tema
themeToggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDarkTheme = body.classList.contains('dark-theme');
    themeToggleButton.textContent = isDarkTheme ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
});

// Fungsi untuk toggle sidebar
toggleSidebarButton.addEventListener('click', () => {
    // Toggle class 'visible' pada sidebar
    sidebar.classList.toggle('visible');

    //Perbaharui atribut aria-expanded
    const isExpanded = toggleSidebarButton.getAttribute('aria-expanded') === 'true';
    toggleSidebarButton.setAttribute('aria-expanded', !isExpanded);
   });

// Fungsi untuk pencarian tugas
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    const tasks = taskList.querySelectorAll('li');

    tasks.forEach(task => {
        const taskText = task.querySelector('.task-text').textContent.toLowerCase();
        const taskDueDate = task.querySelector('.task-due-date').textContent.toLowerCase();
        const taskPriority = task.querySelector('.task-priority').textContent.toLowerCase();

        if (taskText.includes(query) || taskDueDate.includes(query) || taskPriority.includes(query)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
});

// Fungsi untuk menyimpan tugas ke localStorage
function saveTasks() {
    try {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(task => {
            tasks.push({
                text: task.querySelector('.task-text').textContent,
                dueDate: new Date(task.querySelector('.task-due-date').textContent).getTime(), // Simpan sebagai timestamp
                priority: task.classList[0],
                completed: task.querySelector('.task-checkbox').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Gagal menyimpan tugas:', error);
    }
}

// Fungsi untuk memuat tugas dari localStorage
function loadTasks() {
    try {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add(task.priority);
            listItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span> - 
                <span class="task-due-date">${new Intl.DateTimeFormat('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                }).format(new Date(task.dueDate))}</span> - 
                <span class="task-priority">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                <button class="delete-task" aria-label="Hapus Tugas">🗑️</button>
            `;
            if (task.completed) {
                listItem.querySelector('.task-text').style.textDecoration = 'line-through';
            }
            taskList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Gagal memuat tugas:', error);
    }
}

// Muat tugas dan tema saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    // Muat tema yang disimpan
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggleButton.textContent = 'Light Mode';
    }
});
=======
// Ambil elemen-elemen utama
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('task');
const dueDateInput = document.getElementById('dueDate');
const taskList = document.getElementById('taskList');
const priorityButtons = document.querySelectorAll('.priority-btn');
const themeToggleButton = document.getElementById('themeToggle');
const body = document.body;
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const toggleSidebarButton = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const errorMessage = document.getElementById('error-message');

// Variabel untuk prioritas yang dipilih
let selectedPriority = 'low';

// Fungsi untuk mengatur prioritas
priorityButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelector('.priority-btn[aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
        e.currentTarget.setAttribute('aria-pressed', 'true');
        selectedPriority = e.currentTarget.getAttribute('data-priority');
    });
});

// Fungsi untuk menambah tugas ke daftar
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (!taskText || !dueDate) {
        errorMessage.textContent = 'Tugas dan tanggal harus diisi';
        return;
    }

    // Validasi tanggal tidak boleh kurang dari hari ini
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        errorMessage.textContent = 'Tanggal tidak boleh lebih kecil dari hari ini!';
        return;
    }

    // Format tanggal
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(selectedDate);

    // Buat elemen tugas baru
    const listItem = document.createElement('li');
    listItem.classList.add(selectedPriority);
    listItem.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <span class="task-text">${taskText}</span> - 
        <span class="task-due-date">${formattedDate}</span> - 
        <span class="task-priority">${selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}</span>
        <button class="delete-task" aria-label="Hapus Tugas">🗑️</button>
    `;
    taskList.appendChild(listItem);

    // Reset form dan prioritas
    taskForm.reset();
    selectedPriority = 'low';
    document.querySelector('.priority-btn[aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
    document.querySelector('[data-priority="low"]').setAttribute('aria-pressed', 'true');

    saveTasks();
});

// Fungsi untuk menghapus dan menandai tugas
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
        e.target.parentElement.remove();
        saveTasks();
    } else if (e.target.classList.contains('task-checkbox')) {
        e.target.nextElementSibling.style.textDecoration = e.target.checked ? 'line-through' : 'none';
        saveTasks();
    }
});

// Fungsi untuk mengganti tema
themeToggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDarkTheme = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
});

// Fungsi untuk toggle sidebar
toggleSidebarButton.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
    toggleSidebarButton.setAttribute('aria-expanded', sidebar.classList.contains('visible').toString());
});

// Fungsi untuk pencarian tugas
searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    taskList.querySelectorAll('li').forEach(task => {
        task.style.display = task.textContent.toLowerCase().includes(query) ? 'flex' : 'none';
    });
});

// Fungsi untuk menyimpan tugas ke localStorage
function saveTasks() {
    const tasks = Array.from(taskList.children).map(task => ({
        text: task.querySelector('.task-text').textContent,
        dueDate: dueDateInput.value, // Simpan dalam format yang lebih aman
        priority: task.classList[0],
        completed: task.querySelector('.task-checkbox').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi untuk memuat tugas dari localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.classList.add(task.priority);
        listItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span> - 
            <span class="task-due-date">${new Date(task.dueDate).toLocaleString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
            })}</span> - 
            <span class="task-priority">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
            <button class="delete-task">🗑️</button>
        `;
        taskList.appendChild(listItem);
    });
}

// Muat tugas dan tema saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-theme');
});
>>>>>>> ab017e3 (toggle tema dipindah, functionnya diperbaiki)
