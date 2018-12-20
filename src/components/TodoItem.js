import React from 'react';
import PropTypes from 'prop-types';

import TodoText from './TodoText';

//dnd imports
import { findDOMNode } from 'react-dom';
import {
    DragSource,
	DropTarget
} from 'react-dnd';
import ItemTypes from './ItemTypes';

const todoSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
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
    onKeyPress,
    moveTodo,
    isDragging,
    connectDragSource,
    connectDropTarget
}) => {

    const completeToggle = () => {
        if (tags.includes('Complete')) {
            removeTag(index, 'Complete')
        }
        else {
            addTag(index, 'Complete');
        }
    }

    //const opacity = isDragging ? 0 : 1;
    const opacity = 1;

    // return (
    //     <li className="todoItem scale-in-center">
    //         <button className="dragTodo icon"><img src="/img/drag.svg" alt="Drag todo item" /></button>
    //         <TodoText 
    //             edit={isEditing} 
    //             onKeyPress={e => onKeyPress(e, 13, index, 'isEditing', toggleBool)} 
    //             updateText={e => setTodoText(index, e.target.value)} 
    //             >{text}
    //         </TodoText>
    //         <img src="/img/check-mark.svg" alt="checkbox for completion" />
    //         <input type="checkbox" onChange={completeToggle} checked={tags.includes('Complete')} />
    //         <span className="icon" onClick={() => toggleBool(index, 'isEditing')}>{isEditing ? <img src="/img/save.svg" alt="Save changes" /> : <img src="/img/pencil.svg" alt="Edit to-do" />}</span>
    //         <img className="icon" onClick={(e) => deleteTodo(e, index)} src="/img/trash-can.svg" alt="delete todo item" />
    //     </li>
    // );
    return connectDragSource(
        connectDropTarget( 
            <li className="todoItem scale-in-center" style={{ opacity }}>
                <button className="dragTodo icon"><img src="/img/drag.svg" alt="Drag todo item" /></button>
                <TodoText 
                    edit={isEditing} 
                    onKeyPress={e => onKeyPress(e, 13, index, 'isEditing', toggleBool)} 
                    updateText={e => setTodoText(index, e.target.value)} 
                    >{text}
                </TodoText>
                <img src="/img/check-mark.svg" alt="checkbox for completion" />
                <input type="checkbox" onChange={completeToggle} checked={tags.includes('Complete')} />
                <span className="icon" onClick={() => toggleBool(index, 'isEditing')}>{isEditing ? <img src="/img/save.svg" alt="Save changes" /> : <img src="/img/pencil.svg" alt="Edit to-do" />}</span>
                <img className="icon" onClick={(e) => deleteTodo(e, index)} src="/img/trash-can.svg" alt="delete todo item" />
            </li>
        )
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
    setTodoText: PropTypes.func.isRequired,
    moveTodo: PropTypes.func.isRequired
}

// export default TodoItem;
export default DropTarget(
	ItemTypes.TODO,
	todoTarget,
	(connect) => ({
		connectDropTarget: connect.dropTarget(),
	}),
)(
	DragSource(
		ItemTypes.TODO,
		todoSource,
		(connect, monitor) => ({
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging(),
		}),
	)(TodoItem),
)

// stuff that will end up in here in some form for drag and drop

// import * as React from 'react';
// import { findDOMNode } from 'react-dom';
// import {
// 	DragSource,
// 	DropTarget
// } from 'react-dnd';
// import ItemTypes from './ItemTypes';

// const todoSource = {
// 	beginDrag(props) {
// 		return {
// 			id: props.id,
// 			index: props.index,
// 		}
// 	}
// }

// const todoTarget = {
// 	hover(props, monitor, component) {
// 		if (!component) {
// 			return null;
// 		}
// 		const dragIndex = monitor.getItem().index;
// 		const hoverIndex = props.index;

// 		// Don't replace items with themselves
// 		if (dragIndex === hoverIndex) {
// 			return ;
// 		}

// 		// Determine rectangle on screen
// 		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

// 		// Get vertical middle
// 		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

// 		// Determine mouse position
// 		const clientOffset = monitor.getClientOffset();

// 		// Get pixels to the top
// 		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

// 		// Only perform the move when the mouse has crossed half of the items height
// 		// When dragging downwards, only move when the cursor is below 50%
// 		// When dragging upwards, only move when the cursor is above 50%

// 		// Dragging downwards
// 		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
// 			return ;
// 		}

// 		// Dragging upwards
// 		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
// 			return ;
// 		}

// 		// Time to actually perform the action
// 		props.moveTodo(dragIndex, hoverIndex);

// 		// Note: we're mutating the monitor item here!
// 		// Generally it's better to avoid mutations,
// 		// but it's good here for the sake of performance
// 		// to avoid expensive index searches.
// 		monitor.getItem().index = hoverIndex;
// 	}
// }

// class Card extends React.Component {
// 	render() {
// 		const {
// 			text,
// 			isDragging,
// 			connectDragSource,
// 			connectDropTarget,
// 		} = this.props;
// 		const opacity = isDragging ? 0 : 1;

// 		return connectDragSource(
// 			connectDropTarget(<div style={{ opacity }}>{text}</div>)
// 		);
// 	}
// }

// export default DropTarget(
// 	ItemTypes.TODO,
// 	todoTarget,
// 	(connect) => ({
// 		connectDropTarget: connect.dropTarget(),
// 	}),
// )(
// 	DragSource(
// 		ItemTypes.TODO,
// 		todoSource,
// 		(connect, monitor) => ({
// 			connectDragSource: connect.dragSource(),
// 			isDragging: monitor.isDragging(),
// 		}),
// 	)(TodoItem),
// )