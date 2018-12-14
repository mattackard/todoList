import React from 'react';
import PropTypes from 'prop-types';

const Tag = (props) => {
    return (
        <li className="tempTag">
            <button className="deleteTag" type="button">✖</button>
            {props.tagName}
        </li>
    );
}

Tag.propTypes = {
    tagName: PropTypes.string
}

export default Tag;