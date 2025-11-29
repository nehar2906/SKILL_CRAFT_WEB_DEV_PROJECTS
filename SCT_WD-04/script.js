// Simple To-Do app with cards, done section, edit modal and localStorage

// DOM
const todoList = document.getElementById('todoList');
const doneList = document.getElementById('doneList');
const newTaskBtn = document.getElementById('newTaskBtn');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const taskDate = document.getElementById('taskDate');
const taskTime = document.getElementById('taskTime');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');

const cardTpl = document.getElementById('cardTpl');

// Data
let tasks = []; // {id, title, desc, date, time, done, createdAt}
let editingId = null;

// Helpers
function uid() { return 't' + Date.now().toString(36) + Math.floor(Math.random()*1000) }
function saveAll() { localStorage.setItem('eloura_tasks', JSON.stringify(tasks)) }
function loadAll() { tasks = JSON.parse(localStorage.getItem('eloura_tasks')||'[]') }

// Render
function render(){
  todoList.innerHTML = '';
  doneList.innerHTML = '';

  const todo = tasks.filter(t=>!t.done).sort((a,b)=>b.createdAt - a.createdAt);
  const done = tasks.filter(t=>t.done).sort((a,b)=>b.createdAt - a.createdAt);

  todo.forEach(t => todoList.appendChild(createCard(t)));
  done.forEach(t => doneList.appendChild(createCard(t)));
}

// Create card element from template
function createCard(task){
  const node = cardTpl.content.cloneNode(true);
  const article = node.querySelector('.card');
  article.dataset.id = task.id;

  const titleEl = node.querySelector('.card-title');
  const descEl = node.querySelector('.card-desc');
  const datetimeEl = node.querySelector('.datetime');
  const editBtn = node.querySelector('.action.edit');
  const delBtn = node.querySelector('.action.delete');
  const check = node.querySelector('.complete-checkbox');

  titleEl.textContent = task.title;
  descEl.textContent = task.desc || '';
  datetimeEl.textContent = formatDT(task.date, task.time);

check.checked = !!task.done;

if (task.done) {
    article.classList.add("completed");
} else {
    article.classList.remove("completed");
}

  // events
  editBtn.addEventListener('click', ()=> openEdit(task.id));
  delBtn.addEventListener('click', ()=> removeTask(task.id));
  check.addEventListener('change', (e)=> toggleDone(task.id, e.target.checked));
   // Pattern pastel colors
const pastelColors = [
  "var(--pastel-1)",
  "var(--pastel-2)",
  "var(--pastel-3)",
  "var(--pastel-4)",
  "var(--pastel-5)",
  "var(--pastel-6)"
];
// Assign color based on the task's position
const index = tasks.indexOf(task);
const color = pastelColors[index % pastelColors.length];

// Apply soft gradient version
article.style.background = `linear-gradient(160deg, ${color}, #ffffff)`;
  
  return node;
}

function formatDT(d,t){
  if(!d && !t) return 'No date set';
  let s = '';
  if(d) s += d;
  if(t) s += (s? ' • ' : '') + t;
  return s;
}

// CRUD
function addTask(data){
  tasks.push({...data, id: uid(), done:false, createdAt: Date.now()});
  saveAll(); render();
}

function updateTask(id, data){
  tasks = tasks.map(t => t.id === id ? {...t, ...data} : t);
  saveAll(); render();
}

function removeTask(id){
  if(!confirm('Delete this task?')) return;
  tasks = tasks.filter(t => t.id !== id);
  saveAll(); render();
}

function toggleDone(id, isDone){
  updateTask(id, {done: !!isDone});
}

// Modal controls
function openNew(){
  editingId = null;
  modalTitle.textContent = 'New Task';
  taskTitle.value = '';
  taskDesc.value = '';
  taskDate.value = '';
  taskTime.value = '';
  modal.classList.remove('hidden');
  taskTitle.focus();
}
function openEdit(id){
  const t = tasks.find(x=>x.id===id);
  if(!t) return;
  editingId = id;
  modalTitle.textContent = 'Edit Task';
  taskTitle.value = t.title;
  taskDesc.value = t.desc || '';
  taskDate.value = t.date || '';
  taskTime.value = t.time || '';
  modal.classList.remove('hidden');
}

function closeModal(){ modal.classList.add('hidden'); editingId = null; }

// Save handler
saveTaskBtn.addEventListener('click', ()=>{
  const title = taskTitle.value.trim();
  if(!title){ alert('Please enter a title'); taskTitle.focus(); return; }
  const data = { title, desc: taskDesc.value.trim(), date: taskDate.value, time: taskTime.value };

  if(editingId){
    updateTask(editingId, data);
  } else {
    addTask(data);
  }
  closeModal();
});

// Cancel
cancelTaskBtn.addEventListener('click', closeModal);

// New button
newTaskBtn.addEventListener('click', openNew);

// click outside modal to close
modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal() });

// init
loadAll();
render();
