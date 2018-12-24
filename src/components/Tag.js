import React from 'react';
import PropTypes from 'prop-types';

const Tag = (props) => {
    return (
        <div className="tempTag scale-in-center">
            <button className="deleteTag" type="button" onClick={(e) => props.removeTag(e, props.tagIndex, props.todoIndex)}>✖</button>
            {props.tagName}
        </div>
    );
}

Tag.propTypes = {
    tagName: PropTypes.string,
    tagIndex: PropTypes.number.isRequired,
    todoIndex: PropTypes.number,
    removeTag: PropTypes.func.isRequired
}

export default Tag;