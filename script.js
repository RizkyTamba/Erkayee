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
