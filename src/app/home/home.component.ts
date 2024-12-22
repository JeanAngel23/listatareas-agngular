import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { title } from 'process';

import {Task} from './../models/task.model'

@Component({
  selector: 'app-home',
  imports: [CommonModule],
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


  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newTask = input.value;
    this.addTask(newTask);
    
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
}


