import React, { Component } from 'react';
import './App.css';

import TodoItem from './components/TodoItem';
import TextInput from './components/TextInput';

class App extends Component {

  state = {
    todo: [
      {
        text: 'This is a test todo item',
        isComplete: false
      },
      {
        text: 'This test text is completed',
        isComplete: true
      }
    ]
  };

  //submitTodo
  submitTodo = (e) => {
    e.preventDefault();
    console.log('submit');
  }

  //editTodo
  editTodo = () => {
    console.log('edit');
  }

  //deleteTodo
  deleteTodo = () => {
    console.log('delete');
  }

  //input text change

  //checkbox change
  markComplete = (index) => {                 //currently adds isComplete as top level state outside of the todo array
    this.setState( prevState => ({
      isComplete: !prevState.isComplete
    }));
  }

  render() {
    return (
      <div className="App">
        <h1>Todo List</h1>

        {/* list input */}
        <TextInput 
          submitTodo={this.submitTodo}
        />

        {/* list entry */}
        <ul>
          { 
            this.state.todo.map((td, index) => (
              <TodoItem 
                key={index} 
                index={index}
                text={td.text} 
                isComplete={td.isComplete} 
                markComplete={this.markComplete} 
                editTodo={this.editTodo} 
                deleteTodo={this.deleteTodo} 
              />
            ))
          }
        </ul>
      </div>
    );
  }
}

export default App;
