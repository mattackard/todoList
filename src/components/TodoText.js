import React from 'react';
import PropTypes from 'prop-types';

const TodoText = (props) => {

    // if todo item's "isEditing" prop is true, the list item changes to a text input for editing the text,
    // otherwise the list text is left in the list tag
    if (props.edit) {
        return (
            <input type="text" value={props.children} onKeyDown={props.onKeyPress} onChange={props.updateText} autoFocus />
        );
    } 
    else {
        return (
            <span>{props.children}</span>
        );
    }
}

TodoText.propTypes = {
    edit: PropTypes.bool.isRequired,
    updateText: PropTypes.func.isRequired
}

export default TodoText;