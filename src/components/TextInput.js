import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({submitTodo}) => {

    let todo = React.createRef();

    let placeHolders = [
        'Buy milk',
        'Run a mile',
        'Do some laundry',
        'Pay water bill'
    ];

    let handleSubmit = (e) => {
        e.preventDefault();
        submitTodo(todo.current.value);
        e.currentTarget.reset();
    }

    return (
        <form className="textInput" onSubmit={handleSubmit}>
            <input type="text" ref={todo} placeholder={placeHolders[Math.floor(Math.random() * placeHolders.length)]} />
            <button type="submit">Submit</button>
        </form>
    );
}

TextInput.propTypes = {
    submitTodo: PropTypes.func.isRequired
};

export default TextInput;