import React from 'react';
import PropTypes from 'prop-types';

import TodoText from './TodoText';

const TodoItem = ({
    index, 
    text, 
    tags, 
    isEditing,
    addTag, 
    removeTag,
    toggleBool,
    deleteTodo,
    setTodoText,
    onKeyPress
}) => {

    const completeToggle = () => {
        if (tags.includes('Complete')) {
            removeTag(index, 'Complete')
        }
        else {
            addTag(index, 'Complete');
        }
    }

    return (
        <li className="todoItem scale-in-center">
            <button className="dragTodo icon"><img src="/img/drag.svg" alt="Drag todo item" /></button>
            <TodoText 
                edit={isEditing} 
                onKeyPress={e => onKeyPress(e, 13, index, 'isEditing', toggleBool)} 
                updateText={e => setTodoText(index, e.target.value)} 
                >{text}
            </TodoText>
            <img src="/img/check-mark.svg" alt="checkbox for completion" />
            <input type="checkbox" onChange={completeToggle} checked={tags.includes('Complete')} />
            <button className="icon" onClick={() => toggleBool(index, 'isEditing')}>{isEditing ? <img src="/img/save.svg" alt="Save changes" /> : <img src="/img/pencil.svg" alt="Edit to-do" />}</button>
            <button className="icon" onClick={(e) => deleteTodo(e, index)}><img src="/img/trash-can.svg" alt="delete todo item" /></button>
        </li>
    );
}

TodoItem.propTypes = {
    index: PropTypes.number.isRequired,
    text: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    isEditing: PropTypes.bool.isRequired,
    addTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    toggleBool: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    setTodoText: PropTypes.func.isRequired
}

export default TodoItem;