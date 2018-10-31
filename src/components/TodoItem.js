import React from 'react';
import PropTypes from 'prop-types';

const TodoItem = ({
    index, 
    text, 
    isComplete, 
    markComplete, 
    editTodo,
    deleteTodo
}) => {

    return (
        <li>
            <span>{text}</span>
            <input type="checkbox" onChange={() => markComplete(index)} checked={isComplete} />
            <button onClick={editTodo}>Edit</button>
            <button onClick={() => deleteTodo(index)}>Delete</button>
        </li>
    );
}

TodoItem.propTypes = {
    index: PropTypes.number.isRequired,
    text: PropTypes.string,
    isComplete: PropTypes.bool.isRequired,
    markComplete: PropTypes.func.isRequired,
    editTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired
}

export default TodoItem;