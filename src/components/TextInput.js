import React from 'react';
import PropTypes from 'prop-types';


let placeholders = [
    'Buy milk',
    'Run a mile',
    'Do some laundry',
    'Pay water bill'
];

//scoped outside TextInput to avoid refreshing currentPlaceholder value everytime the state is updated in the controlled input
let currentPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

const TextInput = ({submitTodo}) => {

    let todo = React.createRef();
    let tags = React.createRef();

    let changePlaceholder = () => {
        return placeholders[Math.floor(Math.random() * placeholders.length)];
    }

    let handleSubmit = (e) => {
        e.preventDefault();

        //get the tags associated with the current todo to submit
        let tagsToSubmit = [];
        tags.current.childNodes.forEach((li) => {tagsToSubmit.push(li.innerText)});
        console.log(tagsToSubmit);

        //submit the todo item with text and tags
        submitTodo(todo.current.value, tagsToSubmit);

        //randomizes the placeholder text for the todo text input
        currentPlaceholder = changePlaceholder();
        e.currentTarget.reset();
    }

    return (
        <form id="createTodo" onSubmit={handleSubmit}>
            <input id="todoText" type="text" ref={todo} placeholder={currentPlaceholder} />
            <button type="submit">Submit</button>
            <input id="tagInput" type="text" placeholder="Add tags" />
            <button>Add Tag</button>
            <ul id="inputTagList" ref={tags}> 
                {/* tags should have their own component with bubble, x button for delete */}
                <li value="Tags">Tags</li>
                <li value="Should">Should</li>
                <li value="Display">Display</li>
                <li value="Here">Here</li>
            </ul>
            <label htmlFor="inputDeadline">Deadline: </label>
            <input id="inputDeadline" type="date" />
        </form>
    );
}

TextInput.propTypes = {
    submitTodo: PropTypes.func.isRequired
};

export default TextInput;