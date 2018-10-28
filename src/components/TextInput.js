import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TextInput extends Component {

    static propTypes = {
        submitTodo: PropTypes.func.isRequired
    };

    //initialize state ?

    placeHolders = [
        'Buy milk',
        'Run a mile',
        'Do some laundry',
        'Pay water bill'
    ];

    //createRef ?
    
    render() {
        return (
            <div className="textInput">
                <input type="text" placeholder={this.placeHolders[Math.floor(Math.random() * this.placeHolders.length)]} />
                <button type="submit" onSubmit={this.props.submitTodo}>Submit</button>
            </div>
        );
    }  
}

export default TextInput;