import React, { Component } from 'react';
import update from 'immutability-helper';
import './App.scss';

import TodoItem from './components/TodoItem';
import TextInput from './components/TextInput';
import Filters from './components/Filters';

//react dnd imports
import { DragDropContext } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';

class App extends Component {

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

  //updates the state with the new todo item created in the editing modal
  updateTodo = (indexToChange, updatedTodo) => {
    this.setState({
      todo: this.state.todo.map((todo, index) => {
        if (index === indexToChange) {
          return {
            ...todo,
            ...updatedTodo
          }
        }
        return todo;
      })
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
    //closest works best for consistency over parentNode   
    let target = e.target.closest('li');
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
      e.target.closest('.tempTag').classList.add('scale-out-center');
      setTimeout(() => {
        this.setState({
          todo: this.state.todo.map((todo, index) => {
            if (index === indexToChange) {
              return {
                ...todo,
                tags: [
                  ...todo.tags.slice(0, tagIndex),
                  ...todo.tags.slice(tagIndex + 1)
                ]
              }
            }
            return todo;
          })
        });
      }, 200);
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

  toggleTodoComplete = (indexToChange) => {
    this.setState({
      todo: this.state.todo.map((todo, index) => {
        if (index === indexToChange) {
          return {
            ...todo,
            isComplete: !todo.isComplete
          }
        }
        return todo;
      })
    });
  }

  //runs a function on a defined key press
  onKeyPress = (e, keyCode, index, param, func) => {
    if (e.keyCode === keyCode) {
      func(index, param);
      e.target.value = '';
    }
  }

  //sets the current filter in state when a filter is selected
  setFilter = (selectedFilter) => {
    if (selectedFilter === 'No Filter') {
      this.setState({
        currentFilter: ''
      });
    }
    else {
      this.setState({
        currentFilter: selectedFilter
      });
    }
    //sorts the todo list in state by deadline
    if (selectedFilter === 'Sort by Deadline') {
      this.sortTodosByDeadline();
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

  updateDeadline = (indexToChange, newDeadline) => {
    this.setState({
      todo: this.state.todo.map((todo, index) => {
        if (index === indexToChange) {
          return {
            ...todo,
            deadline: newDeadline
          }
        }
        return todo;
      })
    });
  }

  //sorts the todo list items by closest deadline with no deadline sorting to the top of the list
  sortTodosByDeadline = () => {
    let sorted = this.state.todo;
    sorted.sort((a,b) => {
      return Date.parse(a.deadline) - Date.parse(b.deadline);
    });
    this.setState({
      todo: [...sorted]
    });
  }

  render() {
    return (
      <div className="App" ref={this.appNode}>
        <h1>Todo List</h1>

        {/* main todo input form */}
        <TextInput submitTodo={this.submitTodo} onKeyPress={this.onKeyPress} />

        {/* filter menu for searching based on tags/complete */}
        {
          this.state.todo.length > 0 ?
              <Filters setFilter={this.setFilter} filterList={this.state.filterArray} />
            :
              null
        }

        {/* todo item list */}
        <ul id="listContainer">
          { 
            this.state.todo.map((td, index) => {
              if (this.state.currentFilter === 'Complete') {
                if (td.isComplete) {
                  return <TodoItem 
                            key={td.text} 
                            id={td.text}
                            index={index}
                            text={td.text} 
                            isComplete={td.isComplete}
                            tags={td.tags} 
                            deadline={td.deadline}
                            isEditing={td.isEditing}
                            firstLoad={td.firstLoad}
                            toggleTodoComplete={this.toggleTodoComplete}
                            addTag={this.addTag} 
                            removeTag={this.removeTag}
                            toggleBool={this.toggleTodoBool} 
                            deleteTodo={this.deleteTodo} 
                            setTodoText={this.setTodoTextAt}
                            onKeyPress={this.onKeyPress}
                            submitTodo={this.submitTodo}
                            updateTodo={this.updateTodo}
                            moveTodo={this.moveTodo}
                            updateDeadline={this.updateDeadline} />;
                }
                else {
                  return null;
                }
              }
              else if (this.state.currentFilter) {
                if (td.tags.includes(this.state.currentFilter)) {
                  return <TodoItem 
                            key={td.text} 
                            id={td.text}
                            index={index}
                            text={td.text} 
                            isComplete={td.isComplete}
                            tags={td.tags} 
                            deadline={td.deadline}
                            isEditing={td.isEditing}
                            firstLoad={td.firstLoad}
                            toggleTodoComplete={this.toggleTodoComplete}
                            addTag={this.addTag} 
                            removeTag={this.removeTag}
                            toggleBool={this.toggleTodoBool} 
                            deleteTodo={this.deleteTodo} 
                            setTodoText={this.setTodoTextAt}
                            onKeyPress={this.onKeyPress}
                            submitTodo={this.submitTodo}
                            updateTodo={this.updateTodo}
                            moveTodo={this.moveTodo}
                            updateDeadline={this.updateDeadline} />;
                }
                else if (this.state.currentFilter === 'Sort by Deadline') {
                  return <TodoItem 
                            key={td.text} 
                            id={td.text}
                            index={index}
                            text={td.text} 
                            isComplete={td.isComplete}
                            tags={td.tags} 
                            deadline={td.deadline}
                            isEditing={td.isEditing}
                            firstLoad={td.firstLoad}
                            toggleTodoComplete={this.toggleTodoComplete}
                            addTag={this.addTag} 
                            removeTag={this.removeTag}
                            toggleBool={this.toggleTodoBool} 
                            deleteTodo={this.deleteTodo} 
                            setTodoText={this.setTodoTextAt}
                            onKeyPress={this.onKeyPress}
                            submitTodo={this.submitTodo}
                            updateTodo={this.updateTodo}
                            moveTodo={this.moveTodo}
                            updateDeadline={this.updateDeadline} />;
                }
                else {
                  return null;
                }
              }
              else {
                return <TodoItem 
                          key={td.text} 
                          id={td.text}
                          index={index}
                          text={td.text} 
                          isComplete={td.isComplete}
                          tags={td.tags} 
                          deadline={td.deadline}
                          isEditing={td.isEditing}
                          firstLoad={td.firstLoad}
                          toggleTodoComplete={this.toggleTodoComplete}
                          addTag={this.addTag} 
                          removeTag={this.removeTag}
                          toggleBool={this.toggleTodoBool} 
                          deleteTodo={this.deleteTodo} 
                          setTodoText={this.setTodoTextAt}
                          onKeyPress={this.onKeyPress}
                          submitTodo={this.submitTodo}
                          updateTodo={this.updateTodo}
                          moveTodo={this.moveTodo}
                          updateDeadline={this.updateDeadline} />;
              }
            })
          }
        </ul>
      </div>
    );
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(App);