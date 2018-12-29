import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tag from './Tag';

class EditModal extends Component {

    render() {
        const { index, 
            tags, 
            deadline,
            addTag, 
            removeTag,
            updateText,
            updateDeadline,
            toggleBool,
            onKeyPress } = this.props; 

        return (
            <div id="editModal">
                <form>
                    <div className="row">
                        <input id="todoText" type="text" onChange={updateText} value={this.props.children} autoFocus />
                    </div>
                    <div>
                        <div className="row">
                            <input id="inputDeadline" type="date" value={deadline} onChange={(e) => updateDeadline(index, e.target.value)} />
                            <img src="/img/calendar.svg" alt="Calendar icon" />
                        </div>
                        <div className="row">
                            <input id="tagInput" type="text" placeholder="Add tags" onKeyDown={(e) => onKeyPress(e, 13, index, e.target.value, addTag)} />
                            <button type="button" onClick={(e) => addTag(index, e.target.previousSilbing.value)}>Add Tag</button>
                        </div>
                        <div className="row">
                            <ul id="inputTagList"> 
                                {
                                    //populates the tag ul with all tags in current state
                                    tags.map((tagName, tagIndex) => {
                                        return (
                                            <Tag key={tagName} tagName={tagName} tagIndex={tagIndex} removeTag={removeTag} todoIndex={index} />
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <svg className="icon" onClick={() => toggleBool(index, 'isEditing')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>Save Changes</title>
                        <path d="M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171zm-3 10.171h-14v1h14v-1zm0 2h-14v1h14v-1zm0 2h-14v1h14v-1z"/>
                    </svg>
                </form>
            </div>
        );
    }
}

EditModal.proptypes = {
    index: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    addTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    updateDeadline: PropTypes.func.isRequired
}

export default EditModal;