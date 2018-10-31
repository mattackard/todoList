import React, { Component } from 'react';
import './App.css';

import TodoItem from './components/TodoItem';
import TextInput from './components/TextInput';

class App extends Component {

  state = {           //state reloads all stateful components, need to change to only update specific component
    todo: [  ]
  };

  //submitTodo
  submitTodo = (todoText) => {    //add a todo list item 
    this.setState({
      todo: [
        ...this.state.todo,
        {
          text: todoText,
          isComplete: false
        }
      ]
    });
  }

  //editTodo
  editTodo = () => {
    console.log('edit');
  }

  //deleteTodo
  deleteTodo = (index) => {           //removes the todo list item
    let newState = this.state.todo;
    newState.splice(index, 1);
    this.setState({
        todo: newState
    });
  }

  //input text change

  //checkbox change
  markComplete = (index) => {                 //checks checkbox to indicate complete todo item
    this.setState( prevState => ({
      isComplete: prevState.todo[index].isComplete = !prevState.todo[index].isComplete
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
