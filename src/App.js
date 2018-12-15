import React, { Component } from 'react';
import './App.scss';

import TodoItem from './components/TodoItem';
import TextInput from './components/TextInput';
import Filters from './components/Filters';

class App extends Component {

  //todo sample --- replace with empty array later
  // [
  //   {
  //     text: 'Here is list item 1',
  //     isEditing: false,
  //     tags: []
  //   },
  //   {
  //     text: 'Do this next',
  //     isEditing: false,
  //     tags: []
  //   }
  // ]

  state = {
    todo: [ ],
    filterArray: [
      'Complete'
    ],
    currentFilter: ''
  };

  //adds a todo list item to the list
  submitTodo = (newTodo) => {   
    this.setState({
      todo: [
        ...this.state.todo,
        newTodo
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
  deleteTodo = (e, index) => {
    //get the todo item element and add slide-out-right class   
    //class is being added to more than 1 list item???
    //e.target.parentNode.classList.add('scale-out-center');  

    //wait for the animation to finish, then remove todo from state
    setTimeout(() => {
      this.setState({
        todo: [
          ...this.state.todo.slice(0, index),
          ...this.state.todo.slice(index + 1)
        ]
      });
    }, 0);
  }

  //remove tag
  removeTag = (indexToChange, tag) => {
    if (this.state.todo[indexToChange].tags.includes(tag)) {
      this.setState({
        todo: this.state.todo.map((todo, index) => {
          if (index === indexToChange) {
            return {
              ...todo,
              tags: [
                ...todo.tags.splice(0, indexToChange),
                ...todo.tags.splice(indexToChange + 1)
              ]
            }
          }
          return todo;
        })
      });
    }
    else {
      alert("Tag not found or already deleted");
    }
  }

  //adds a tag to a todo item and adds the tag to the filter list
  //prevents duplicate tags from being created
  addTag = (indexToChange, tag) => {      
    if (!this.state.filterArray.includes(tag) && !this.state.todo[indexToChange].tags.includes(tag)) {
      this.setState({
        filterArray: [
          ...this.state.filterArray,
          tag
        ],
        todo: this.state.todo.map((todo, index) => {
          if (index === indexToChange) {
            return {
              ...todo,
              tags: [
                ...todo.tags,
                tag
              ]
            }
          }
          return todo;
        })
      });
    }
    else if (!this.state.todo[indexToChange].tags.includes(tag)) {
      this.setState({
        todo: this.state.todo.map((todo, index) => {
          if (index === indexToChange) {
            return {
              ...todo,
              tags: [
                ...todo.tags,
                tag
              ]
            }
          }
          return todo;
        })
      });
    }
  }

  //runs a function on a defined key press
  onKeyPress = (e, keyCode, index, param, func) => {
    if (e.keyCode === keyCode) {
      func(index, param);
    }
  }

  //sets the current filter when a filter is selected
  setFilter = (selectedFilter) => {
    if (selectedFilter === 'Clear Filters') {
      this.setState({
        currentFilter: ''
      });
    }
    else {
      this.setState({
        currentFilter: selectedFilter
      });
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Todo List</h1>

        {/* main todo input form */}
        <TextInput id="newTodoForm" submitTodo={this.submitTodo} onKeyPress={this.onKeyPress} />

        {/* filter menu for searching based on tags/complete */}
        <Filters id="filterDropdown" setFilter={this.setFilter} filterList={this.state.filterArray} />

        {/* todo item list */}
        <ul id="listContainer">
          { 
            this.state.todo.map((td, index) => {
              if (this.state.currentFilter) {
                if (td.tags.includes(this.state.currentFilter)) {
                  return ( <TodoItem 
                    key={index} 
                    index={index}
                    text={td.text} 
                    tags={td.tags} 
                    isEditing={td.isEditing}
                    addTag={this.addTag} 
                    removeTag={this.removeTag}
                    toggleBool={this.toggleTodoBool} 
                    deleteTodo={this.deleteTodo} 
                    setTodoText={this.setTodoTextAt}
                    onKeyPress={this.onKeyPress}
                  /> );
                }
                else {
                  return null;
                }
              }
              else {
                return ( <TodoItem 
                  key={index} 
                  index={index}
                  text={td.text} 
                  tags={td.tags} 
                  isEditing={td.isEditing}
                  addTag={this.addTag} 
                  removeTag={this.removeTag}
                  toggleBool={this.toggleTodoBool} 
                  deleteTodo={this.deleteTodo} 
                  setTodoText={this.setTodoTextAt}
                  onKeyPress={this.onKeyPress}
                /> );
              }
            })
          }
        </ul>
      </div>
    );
  }
}

export default App;
