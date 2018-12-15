import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tag from './Tag';

let placeholders = [
    'Buy milk',
    'Run a mile',
    'Do some laundry',
    'Pay water bill'
];

//scoped outside TextInput to avoid refreshing currentPlaceholder value everytime the state is updated in the controlled input
let currentPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

export default class TextInput extends Component {

    static propTypes = {
        submitTodo: PropTypes.func.isRequired,
        onKeyPress: PropTypes.func.isRequired
    };

    state = {
        newTodo: {
            text: '',
            isEditing: false,
            deadline: '',
            tags: [ ]
        }
    }

    //used to reset state after the form is submitted
    emptyState = {
        newTodo: {
            text: '',
            isEditing: false,
            deadline: '',
            tags: [ ]
        }
    }

    changePlaceholder = () => {
        return placeholders[Math.floor(Math.random() * placeholders.length)];
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.newTodo);

        //submit the todo item with text and tags from state
        this.props.submitTodo(this.state.newTodo);

        //randomizes the placeholder text for the todo text input
        currentPlaceholder = this.changePlaceholder();

        //clears the input form
        this.setState(this.emptyState);
    }

    //to keep todo text in sync in state
    updateText = (e) => {
        this.setState({
            newTodo: {
                ...this.state.newTodo,
                text: e.target.value
            }
        });
    }

    //adds the text in the tag input to state
    addTag = () => {
        let newTag = document.getElementById('tagInput');
        newTag.value = newTag.value.trim();
        if (!this.state.newTodo.tags.includes(newTag.value)) {
            this.setState({
                newTodo: {
                    ...this.state.newTodo,
                    tags: [
                        ...this.state.newTodo.tags,
                        newTag.value
                    ]
                }
            });
            newTag.value = '';
        }
        else {
            alert('This tag already exists');
            newTag.value = '';
        }
        newTag.focus();
    }

    //removes the text in the tag input to state
    removeTag = (tagIndex) => {
        this.setState({
            newTodo: {
                ...this.state.newTodo,
                tags: [
                    ...this.state.newTodo.tags.splice(0, tagIndex),
                    ...this.state.newTodo.tags.splice(tagIndex + 1)
                ]
            }

        });
    }

    setDeadline = (e) => {
        this.setState({
            newTodo: {
                ...this.state.newTodo,
                deadline: e.target.value
            }
        });
    }

    //duplicates the onKeyPress function to allow running function in this scope instead of app.js
    onKeyPress = this.props.onKeyPress;

    render() {
        return (
            <form id="createTodo">
                <h2>What do you have to do?</h2>
                <div className="row">
                    <input id="todoText" type="text" placeholder={currentPlaceholder} onChange={this.updateText} value={this.state.newTodo.text} onKeyDown={(e) => this.onKeyPress(e, 13, e, null, this.handleSubmit)} />
                    <button id="toggleFormDisplay" type="button">▼</button>
                </div>
                <div className="row">
                    <label>Deadline : </label>
                    <input id="inputDeadline" type="date" onChange={this.setDeadline} value={this.state.newTodo.deadline} />
                </div>
                <div className="row">
                    <input id="tagInput" type="text" placeholder="Add tags" onKeyDown={(e) => this.onKeyPress(e, 13, null, null, this.addTag)} />
                    <button type="button" onClick={this.addTag} >Add Tag</button>
                </div>
                <div className="row">
                    <ul id="inputTagList"> 
                        {/* tags should have their own component with bubble, x button for delete */}
                        {
                            this.state.newTodo.tags.map((tagName, index) => {
                                return (
                                    <Tag key={tagName} tagName={tagName} index={index} removeTag={this.removeTag} />
                                );
                            })
                        }
                    </ul>
                </div>
                <button type="button" onClick={this.handleSubmit}>Submit</button>
            </form>
        );
    }
}