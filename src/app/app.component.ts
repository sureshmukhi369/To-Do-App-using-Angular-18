import { Component, TrackByFunction, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Defining the TodoItem interface
export interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'To-Do-App-using-Angular-18';

  todoList: TodoItem[] = [];
  newTask: string = '';
  editingTaskId: number | null = null;
  editedTask: string = '';
  filter: string = 'all'; // Options: all, completed, pending

  // ✅ Efficient trackBy function to optimize re-renders
  trackByFn: TrackByFunction<TodoItem> = (_, item: TodoItem) => item.id;

  ngOnInit() {
    this.loadTasks(); // Load tasks from localStorage when the app initializes
  }

  // ✅ Add new task
  addTask(): void {
    if (!this.newTask.trim()) return;

    const newTodo: TodoItem = {
      id: Date.now(), // Unique ID using timestamp
      task: this.newTask.trim(),
      completed: false, // Newly added task should always be pending
    };

    this.todoList = [...this.todoList, newTodo];
    this.newTask = ''; // Clear input field
    this.saveTasks(); // Save to localStorage
  }

  // ✅ Toggle task completion
  toggleTask(id: number): void {
    this.todoList = this.todoList.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.saveTasks();
  }

  // ✅ Delete task
  deleteTask(id: number): void {
    this.todoList = this.todoList.filter((task) => task.id !== id);
    this.saveTasks();
  }

  // ✅ Enable editing mode
  editTask(task: TodoItem): void {
    this.editingTaskId = task.id;
    this.editedTask = task.task;
  }

  // ✅ Save edited task
  saveEditedTask(): void {
    if (!this.editedTask.trim()) return;

    this.todoList = this.todoList.map((task) =>
      task.id === this.editingTaskId ? { ...task, task: this.editedTask.trim() } : task
    );

    this.editingTaskId = null;
    this.editedTask = '';
    this.saveTasks();
  }

  // ✅ Cancel editing
  cancelEditing(): void {
    this.editingTaskId = null;
    this.editedTask = '';
  }

  // ✅ Save tasks to localStorage
  saveTasks(): void {
    localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }

  // ✅ Load tasks from localStorage
  loadTasks(): void {
    const savedTasks = localStorage.getItem('todoList');
    this.todoList = savedTasks ? JSON.parse(savedTasks) : [];
  }

  // ✅ Set filter type
  setFilter(filterType: string): void {
    this.filter = filterType;
  }

  // ✅ Optimized filtering logic
  getFilteredTasks(): TodoItem[] {
    switch (this.filter) {
      case 'completed':
        return this.todoList.filter((task) => task.completed);
      case 'pending':
        return this.todoList.filter((task) => !task.completed);
      default:
        return this.todoList;
    }
  }
}
