import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { title } from 'process';

import {Task} from './../models/task.model'

@Component({
  selector: 'app-home',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Actualizar Linkd',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Estudiar Angular',
      completed: false
    }

  ])

  filter = signal('all');
  taskByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending'){
      return tasks.filter(task => !task.completed);
    }
    if(filter === 'completed'){
      return tasks.filter(tasks => tasks.completed);
    }
    return tasks;
  })

  Injector = inject(Injector)

  //constructor(){  }

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTask();
  }

  trackTask(){
    effect( () => { 
      const tasks = this.tasks
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.Injector });
  }

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/.*\S.*/)]
  });


  changeHandler() {

    if(this.newTaskCtrl.valid){
      const value = this.newTaskCtrl.value;
      this.addTask(value);
      this.newTaskCtrl.setValue('')
    }

    
  }

  addTask(title: string){
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }
  //pedir explicacion a gpt
  deleteTask(index:number){
    this.tasks.update((tasks)=> tasks.filter((task, position) => position !== index));
  }

  toggleChecked(index: number) {
    this.tasks.update((tasks) => 
      tasks.map((task, position) => {
        if (position === index) {
          task.completed = !task.completed;
        }
      return task
    })
  );
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((tasks) =>
      tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        }
      })
    );
  }

  updateTaskTest(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) =>
      tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task;
      })
    );
  }

  changeFilter(filter: string){
    this.filter.set(filter);
  }
}


