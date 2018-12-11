import React from 'react';
import PropTypes from 'prop-types';


let placeholders = [
    'Buy milk',
    'Run a mile',
    'Do some laundry',
    'Pay water bill'
];

//scoped outside TextInput to avoid refreshing currentPlaceholder value everytime the state is updated in the controlled input
let currentPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

const TextInput = ({submitTodo}) => {

    let todo = React.createRef();

    let changePlaceholder = () => {
        return placeholders[Math.floor(Math.random() * placeholders.length)];
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        submitTodo(todo.current.value);
        currentPlaceholder = changePlaceholder();
        e.currentTarget.reset();
    }

    return (
        <form id="createTodo" onSubmit={handleSubmit}>
            <input id="todoText" type="text" ref={todo} placeholder={currentPlaceholder} />
            <button type="submit">Submit</button>
            <input id="tagInput" type="text" placeholder="Add tags" />
            <button>Add Tag</button>
            <ul id="inputTagList"> 
                {/* tags should have their own component with bubble, x button for delete */}
                <li>Tags</li>
                <li>Should</li>
                <li>Display</li>
                <li>Here</li>
            </ul>
            <label for="inputDeadline">Deadline: </label>
            <input id="inputDeadline" type="date" />
        </form>
    );
}

TextInput.propTypes = {
    submitTodo: PropTypes.func.isRequired
};

export default TextInput;