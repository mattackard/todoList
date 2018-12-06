import React, { Component } from 'react';
import './App.scss';

import TodoItem from './components/TodoItem';
import TextInput from './components/TextInput';

class App extends Component {

  state = {           //state reloads all stateful components, need to change to only update specific component
    todo: [  ]
  };

  //adds a todo list item to the list
  submitTodo = (todoText) => {    
    this.setState({
      todo: [
        ...this.state.todo,
        {
          text: todoText,
          isComplete: false,
          isEditing: false
        }
      ]
    });
  }

  //toggles a boolean value on a todo list item
  toggleTodoBool = (indexToChange, param) => {
    this.setState({
      todo: this.state.todo.map((todo, index) => {
        if (index === indexToChange) {
          return {
            ...todo,
            [param]: !todo[param]
          }
        }
        return todo;
      })
    });
  }

  //sets the new todo list text when user is editing
  setTodoTextAt = (indexToChange, newText) => {
    this.setState({
      todo: this.state.todo.map((todo, index) => {
        if (index === indexToChange) {
          return {
            ...todo,
            text: newText
          }
        }
        return todo;
      })
    });
  }

  //removes a todo list item from the list
  deleteTodo = (index) => {         
    let newState = this.state.todo;
    newState.splice(index, 1);
    this.setState({
        todo: newState
    });
  }

  //sets the state od isComplete when checkbox has been checked
  markComplete = (index) => {      
    this.toggleTodoBool(index, "isComplete");
  }

  //runs a function on a defined key press
  onKeyPress = (e, keyCode, index, param, func) => {
    if (e.keyCode === keyCode) {
      func(index, param);
    }
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
                isEditing={td.isEditing}
                markComplete={this.markComplete} 
                toggleBool={this.toggleTodoBool} 
                deleteTodo={this.deleteTodo} 
                setTodoText={this.setTodoTextAt}
                onKeyPress={this.onKeyPress}
              />
            ))
          }
        </ul>
      </div>
    );
  }
}

export default App;
