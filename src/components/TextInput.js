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

    state = {
        newTodo: {
            text: '',
            isEditing: false,
            tags: ['let me put', 'some tags in']
        }
    }

    static propTypes = {
        submitTodo: PropTypes.func.isRequired
    };

    changePlaceholder = () => {
        return placeholders[Math.floor(Math.random() * placeholders.length)];
    }

    handleSubmit = (e) => {
        e.preventDefault();

        //submit the todo item with text and tags
        this.props.submitTodo(this.state.newTodo);

        //randomizes the placeholder text for the todo text input
        currentPlaceholder = this.changePlaceholder();
        e.currentTarget.reset();
    }

    updateText = (e) => {
        this.setState({
            newTodo: {
                ...this.state.newTodo,
                text: e.target.value
            }
        });
    }

    addTag = (tag) => {
        this.setState({
            newTodo: {
                ...this.state.newTodo,
                tags: [
                    ...this.state.newTodo.tags,
                    tag
                ]
            }
        });
    }

    render() {
        return (
            <form id="createTodo" onSubmit={this.handleSubmit}>
                <h2>What do you have to do?</h2>
                <div className="row">
                    <input id="todoText" type="text" placeholder={currentPlaceholder} onChange={this.updateText} />
                    <button id="toggleFormDisplay" type="button">▼</button>
                </div>
                <div className="row">
                    <label>Deadline : </label>
                    <input id="inputDeadline" type="date" />
                </div>
                <div className="row">
                    <input id="tagInput" type="text" placeholder="Add tags" />
                    <button onClick={this.addTag} >Add Tag</button>
                </div>
                <div className="row">
                    <ul id="inputTagList"> 
                        {/* tags should have their own component with bubble, x button for delete */}
                        {
                            this.state.newTodo.tags.map((tagName) => {
                                return (
                                    <Tag key={tagName} tagName={tagName} />
                                );
                            })
                        }
                    </ul>
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    }
}