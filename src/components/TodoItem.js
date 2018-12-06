import React from 'react';
import PropTypes from 'prop-types';

import TodoText from './TodoText';

const TodoItem = ({
    index, 
    text, 
    isComplete, 
    isEditing,
    markComplete, 
    toggleBool,
    deleteTodo,
    setTodoText,
    onKeyPress
}) => {

    return (
        <li>
            <TodoText edit={isEditing} onKeyPress={e => onKeyPress(e, 13, index, 'isEditing', toggleBool)} updateText={e => setTodoText(index, e.target.value)} >{text}</TodoText>
            <input type="checkbox" onChange={() => markComplete(index)} checked={isComplete} />
            <button onClick={() => toggleBool(index, 'isEditing')}>{isEditing ? "Save" : "Edit"}</button>
            <button onClick={() => deleteTodo(index)}>Delete</button>
        </li>
    );
}

TodoItem.propTypes = {
    index: PropTypes.number.isRequired,
    text: PropTypes.string,
    isComplete: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    markComplete: PropTypes.func.isRequired,
    toggleBool: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    setTodoText: PropTypes.func.isRequired
}

export default TodoItem;