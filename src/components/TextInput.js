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
        <form className="textInput" onSubmit={handleSubmit}>
            <input type="text" ref={todo} placeholder={currentPlaceholder} />
            <button type="submit">Submit</button>
        </form>
    );
}

TextInput.propTypes = {
    submitTodo: PropTypes.func.isRequired
};

export default TextInput;