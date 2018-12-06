import React from 'react';
import PropTypes from 'prop-types';

const TodoText = (props) => {

    if (props.edit) {
        return (
            <input type="text" value={props.children} onKeyDown={props.onKeyPress} onChange={props.updateText} />
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