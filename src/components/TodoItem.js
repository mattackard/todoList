import React, { Component } from 'react';
import PropTypes from 'prop-types';

//react-dnd imports
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import flow from 'lodash/flow';

//component imports
import TodoText from './TodoText';
import EditModal from './EditModal';

const todoSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index
		}
	}
}

const todoTarget = {
	hover(props, monitor, component) {

		if (!component) {
			return null;
		}
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return ;
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return ;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return ;
        }

		// Time to actually perform the action
		props.moveTodo(dragIndex, hoverIndex);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	}
}

class TodoItem extends Component {


    static propTypes = {
        index: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        text: PropTypes.string,
        isComplete: PropTypes.bool.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string),
        isEditing: PropTypes.bool.isRequired,
        toggleTodoComplete: PropTypes.func.isRequired,
        firstLoad: PropTypes.bool.isRequired,
        isDragging: PropTypes.bool.isRequired,
        addTag: PropTypes.func.isRequired,
        removeTag: PropTypes.func.isRequired,
        toggleBool: PropTypes.func.isRequired,
        deleteTodo: PropTypes.func.isRequired,
        setTodoText: PropTypes.func.isRequired,
        submitTodo: PropTypes.func.isRequired,
        updateTodo: PropTypes.func.isRequired,
        moveTodo: PropTypes.func.isRequired,
        updateDeadline: PropTypes.func.isRequired
    }

    //creates a reference to the DOMNode for use when mounted
    setListRef = element => {
        this.listRef = element;
    };

    //sets firstLoad to false after the animation plays on first render
    //this prevents the animation from replaying when dragging and editing
    componentDidMount() {
        if (this.props.firstLoad) {
            setTimeout(() => {
                this.props.toggleBool(this.props.index, 'firstLoad');
            }, 500);
        }
    }

    daysUntil = (date) => {
        const oneDay = 24*60*60*1000;
        const today = new Date();
        const dueDate = new Date(date);
        return Math.round((dueDate.getTime() - today.getTime())/(oneDay)) + 1;
    }

    render() {
        const { index, 
                text, 
                isComplete,
                tags, 
                deadline,
                isEditing,
                firstLoad,
                toggleTodoComplete,
                addTag, 
                removeTag,
                toggleBool,
                deleteTodo,
                setTodoText,
                onKeyPress,
                submitTodo,
                updateTodo,
                updateDeadline,
                isDragging,
                connectDragSource,
                connectDropTarget } = this.props;

        const completeToggle = (e) => {
            if (isComplete) {
                if (e.target.classList.contains('fillCheckbox')) {
                    e.target.classList.remove('fillCheckbox');
                }
                e.target.classList.add('emptyCheckbox');
                toggleTodoComplete(index);
            }
            else {
                if (e.target.classList.contains('emptyCheckbox')) {
                    e.target.classList.remove('emptyCheckbox');
                }
                e.target.classList.add('fillCheckbox');
                toggleTodoComplete(index);
            }
        }

        //sets the opacity to 0 
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(
            connectDropTarget( 
                <li className={firstLoad ? "todoItem scale-in-center" : "todoItem"} ref={this.setListRef} style={{ opacity }}>
                    <button className="dragTodo icon"><img src="/img/drag.svg" alt="Drag todo item" /></button>
                    {
                        isEditing ?
                            <EditModal
                                index={index}
                                text={text}
                                deadline={deadline}
                                tags={tags}
                                updateText={e => setTodoText(index, e.target.value)}
                                toggleBool={toggleBool}
                                onKeyPress={onKeyPress} 
                                updateTodo={updateTodo}
                                removeTag={removeTag}
                                addTag={addTag}
                                updateDeadline={updateDeadline}
                            >{text}</EditModal>
                        :
                            null
                    }
                    <span>{text}</span>
                    {
                        deadline && !isComplete ? <span className="dueDate" >Due in {this.daysUntil(deadline)} days</span> : null
                    }
                    <svg className={isComplete ? "checkbox fillCheckbox" : "checkbox emptyCheckbox"} onClick={completeToggle} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>Mark Todo as Complete</title>
                        <path d="M20 12.194v9.806h-20v-20h18.272l-1.951 2h-14.321v16h16v-5.768l2-2.038zm.904-10.027l-9.404 9.639-4.405-4.176-3.095 3.097 7.5 7.273 12.5-12.737-3.096-3.096z" />
                    </svg>
                    {
                        isEditing ?
                        <svg className="icon" onClick={() => toggleBool(index, 'isEditing')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <title>Save changes</title>
                            <path d="M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171zm-3 10.171h-14v1h14v-1zm0 2h-14v1h14v-1zm0 2h-14v1h14v-1z"/>
                        </svg>
                        :
                        <svg className="icon" onClick={() => toggleBool(index, 'isEditing')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <title>Edit todo list item</title>
                            <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/>
                        </svg>
                    }
                    <svg className="icon" onClick={(e) => deleteTodo(e, index)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>Delete this Todo Item</title>
                        <path d="M16 9v4.501c-.748.313-1.424.765-2 1.319v-5.82c0-.552.447-1 1-1s1 .448 1 1zm-4 0v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1s1 .448 1 1zm1.82 15h-11.82v-18h2v16h8.502c.312.749.765 1.424 1.318 2zm-6.82-16c.553 0 1 .448 1 1v10c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1zm14-4h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711v2zm-1 2v7.182c-.482-.115-.983-.182-1.5-.182l-.5.025v-7.025h2zm3 13.5c0 2.485-2.017 4.5-4.5 4.5s-4.5-2.015-4.5-4.5 2.017-4.5 4.5-4.5 4.5 2.015 4.5 4.5zm-3.086-2.122l-1.414 1.414-1.414-1.414-.707.708 1.414 1.414-1.414 1.414.707.708 1.414-1.414 1.414 1.414.708-.708-1.414-1.414 1.414-1.414-.708-.708z"/>
                    </svg>
                </li>
            )
        );
    }
}

//fancy export for react-dnd using lodash flow
export default flow([
    DragSource(ItemTypes.TODO, todoSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })),
    DropTarget(ItemTypes.TODO, todoTarget, connect => ({
      connectDropTarget: connect.dropTarget(),
    }))
  ])(TodoItem);