import React, { Component } from 'react';
import update from 'immutability-helper';
import './App.scss';

import TodoItem from './components/TodoItem';
import TextInput from './components/TextInput';
import Filters from './components/Filters';

//react dnd imports
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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
    filterArray: [ 'Complete' ],
    currentFilter: ''
  };

  //adds a todo list item to the list
  submitTodo = (newTodo) => {
    let tagsToAdd = [];
    newTodo.tags.forEach(tag => {
      if (!this.state.filterArray.includes(tag)) {
        tagsToAdd.push(tag);
      }
    });  
    this.setState({
      todo: [
        ...this.state.todo,
        newTodo
      ],
      filterArray: [
        ...this.state.filterArray,
        ...tagsToAdd
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
  deleteTodo = (e, indexToDelete) => {

    //get the todo item element and add slide-out-right class   
    let target = e.target.parentNode;
    target.classList.add('slide-out-right'); 

    //remove tags not used by any other todo
    let newFilterArray = [];
    this.state.todo.forEach((todo, index) => {
      if (index !== indexToDelete) {
        todo.tags.forEach(tag => {
          newFilterArray.push(tag);
        })
      }
    });

    //remove duplicate tags
    newFilterArray = Array.from(new Set(newFilterArray));

    //replace the always present 'Complete' tag
    newFilterArray.unshift('Complete');

    //wait for the animation to finish, then remove todo from state and adjust filter tags
    setTimeout(() => {

      //need to remove the scale-out and scale-in so the next list item doesn't animate 
      target.classList.remove('slide-out-right', 'scale-in-center');
      this.setState({
        todo: [
          ...this.state.todo.slice(0, indexToDelete),
          ...this.state.todo.slice(indexToDelete + 1)
        ],
        filterArray: newFilterArray
      });
    }, 400);
  }

  //removes a given tag if it is present
  removeTag = (e, tagIndex, indexToChange) => {
    if (this.state.todo[indexToChange].tags[tagIndex] === e.target.nextSibling.textContent) {
      this.setState({
        todo: this.state.todo.map((todo, index) => {
          if (index === indexToChange) {
            return {
              ...todo,
              tags: [
                ...todo.tags.splice(0, tagIndex),
                ...todo.tags.splice(tagIndex + 1)
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

  //react-dnd function to swap todo item positions
  moveTodo = (dragIndex, hoverIndex) => {
		const todo = this.state.todo;
		const dragTodo = todo[dragIndex];

    //using immutability-helper's update function
		this.setState(
      update(this.state, {
        todo: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragTodo]],
        }
      })
    );
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
                    key={td.text} 
                    id={td.text}
                    index={index}
                    text={td.text} 
                    tags={td.tags} 
                    deadline={td.deadline}
                    isEditing={td.isEditing}
                    firstLoad={td.firstLoad}
                    addTag={this.addTag} 
                    removeTag={this.removeTag}
                    toggleBool={this.toggleTodoBool} 
                    deleteTodo={this.deleteTodo} 
                    setTodoText={this.setTodoTextAt}
                    onKeyPress={this.onKeyPress}
                    moveTodo={this.moveTodo}
                  /> );
                }
                else {
                  return null;
                }
              }
              else {
                return ( <TodoItem 
                  key={td.text} 
                  id={td.text}
                  index={index}
                  text={td.text} 
                  tags={td.tags} 
                  deadline={td.deadline}
                  isEditing={td.isEditing}
                  firstLoad={td.firstLoad}
                  addTag={this.addTag} 
                  removeTag={this.removeTag}
                  toggleBool={this.toggleTodoBool} 
                  deleteTodo={this.deleteTodo} 
                  setTodoText={this.setTodoTextAt}
                  onKeyPress={this.onKeyPress}
                  moveTodo={this.moveTodo}
                /> );
              }
            })
          }
        </ul>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);