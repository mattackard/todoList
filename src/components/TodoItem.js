import React, { Component } from 'react';
import PropTypes from 'prop-types';

//react-dnd imports
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import flow from 'lodash/flow';

//component imports
import TodoText from './TodoText';

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
        tags: PropTypes.arrayOf(PropTypes.string),
        isEditing: PropTypes.bool.isRequired,
        firstLoad: PropTypes.bool.isRequired,
        isDragging: PropTypes.bool.isRequired,
        addTag: PropTypes.func.isRequired,
        removeTag: PropTypes.func.isRequired,
        toggleBool: PropTypes.func.isRequired,
        deleteTodo: PropTypes.func.isRequired,
        setTodoText: PropTypes.func.isRequired,
        moveTodo: PropTypes.func.isRequired
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

    render() {
        const { index, 
                text, 
                tags, 
                isEditing,
                firstLoad,
                addTag, 
                removeTag,
                toggleBool,
                deleteTodo,
                setTodoText,
                onKeyPress,
                isDragging,
                connectDragSource,
                connectDropTarget } = this.props;

        const completeToggle = (e) => {
            if (tags.includes('Complete')) {
                removeTag(index, 'Complete');
                if (e.target.classList.contains('fillCheckbox')) {
                    e.target.classList.remove('fillCheckbox');
                }
                e.target.classList.add('emptyCheckbox');
            }
            else {
                addTag(index, 'Complete');
                if (e.target.classList.contains('emptyCheckbox')) {
                    e.target.classList.remove('emptyCheckbox');
                }
                e.target.classList.add('fillCheckbox');
            }
        }

        //sets the opacity to 0 
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(
            connectDropTarget( 
                <li className={firstLoad ? "todoItem scale-in-center" : "todoItem"} ref={this.setListRef} style={{ opacity }}>
                    <button className="dragTodo icon"><img src="/img/drag.svg" alt="Drag todo item" /></button>
                    <TodoText 
                        edit={isEditing} 
                        onKeyPress={e => onKeyPress(e, 13, index, 'isEditing', toggleBool)} 
                        updateText={e => setTodoText(index, e.target.value)} 
                        >{text}
                    </TodoText>
                    <svg className="checkbox" onClick={completeToggle} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 12.194v9.806h-20v-20h18.272l-1.951 2h-14.321v16h16v-5.768l2-2.038zm.904-10.027l-9.404 9.639-4.405-4.176-3.095 3.097 7.5 7.273 12.5-12.737-3.096-3.096z" /></svg>
                    {/* <input type="checkbox" checked={tags.includes('Complete')} /> */}
                    <span className="icon" onClick={() => toggleBool(index, 'isEditing')}>{isEditing ? <img src="/img/save.svg" alt="Save changes" /> : <img src="/img/pencil.svg" alt="Edit to-do" />}</span>
                    <img className="icon" onClick={(e) => deleteTodo(e, index)} src="/img/trash-can.svg" alt="delete todo item" />
                </li>
            )
        );
    }
}

// export default TodoItem;
export default flow([
    DragSource(ItemTypes.TODO, todoSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })),
    DropTarget(ItemTypes.TODO, todoTarget, connect => ({
      connectDropTarget: connect.dropTarget(),
    }))
  ])(TodoItem);