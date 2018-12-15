import React from 'react';
import PropTypes from 'prop-types';

const Tag = (props) => {
    return (
        <li className="tempTag scale-in-center">
            <button className="deleteTag" type="button" onClick={(e) => props.removeTag(e, props.index)}>✖</button>
            {props.tagName}
        </li>
    );
}

Tag.propTypes = {
    tagName: PropTypes.string,
    index: PropTypes.number.isRequired,
    removeTag: PropTypes.func.isRequired
}

export default Tag;