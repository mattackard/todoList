import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tag from './Tag';

class EditModal extends Component {

    componentDidMount() {
        this.props.toggleAppBlur();
    }

    componentWillUnmount() {
        this.props.toggleAppBlur();
    }

    render() {

        const { index, 
            // text, 
            // isComplete,
            tags, 
            // deadline,
            // isEditing,
            // firstLoad,
            // toggleTodoComplete,
            //addTag, 
            removeTag,
            toggleBool,
            // deleteTodo,
            // setTodoText,
            // onKeyPress,
            //submitTodo,
            //toggleAppBlur,
            updateText } = this.props; 

        return (
            <div id="editModal">
                <form id="createTodo">
                    <div className="row">
                        <input id="todoText" type="text" onChange={updateText} value={this.props.children} autoFocus />
                    </div>
                    <div className="scale-in-center" >
                        <div className="row">
                            <input id="inputDeadline" type="date" />
                            <img src="/img/calendar.svg" alt="Calendar icon" />
                        </div>
                        <div className="row">
                            <input id="tagInput" type="text" placeholder="Add tags" />
                            <button type="button">Add Tag</button>
                        </div>
                        <div className="row">
                            <ul id="inputTagList"> 
                                {
                                    //populates the tag ul with all tags in current state
                                    tags.map((tagName, tagIndex) => {
                                        return (
                                            <Tag key={tagName} tagName={tagName} tagIndex={tagIndex} removeTag={removeTag} />
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
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>Cancel All Changes</title>
                        <path d="M16 9v4.501c-.748.313-1.424.765-2 1.319v-5.82c0-.552.447-1 1-1s1 .448 1 1zm-4 0v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1s1 .448 1 1zm1.82 15h-11.82v-18h2v16h8.502c.312.749.765 1.424 1.318 2zm-6.82-16c.553 0 1 .448 1 1v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1zm14-4h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711v2zm-1 2v7.182c-.482-.115-.983-.182-1.5-.182l-.5.025v-7.025h2zm3 13.5c0 2.485-2.017 4.5-4.5 4.5s-4.5-2.015-4.5-4.5 2.017-4.5 4.5-4.5 4.5 2.015 4.5 4.5zm-3.086-2.122l-1.414 1.414-1.414-1.414-.707.708 1.414 1.414-1.414 1.414.707.708 1.414-1.414 1.414 1.414.708-.708-1.414-1.414 1.414-1.414-.708-.708z"/>
                    </svg>
                </form>
            </div>
        );
    }
}

EditModal.proptypes = {
    isEditing: PropTypes.bool.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    updateText: PropTypes.func.isRequired
}

export default EditModal;