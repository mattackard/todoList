import React from 'react';
import PropTypes from 'prop-types';

const Filters = ({ setFilter, filterList }) => {

    //switch this to a button that toggles a drop down
    //each item selected will be added to the filters and removed from the filter list
    //clear all filters needs to be an option
    return (
        <select id="filterDropdown" onChange={e => setFilter(e.target.value)}>
            <option>No Filter</option>
            {
                filterList.map((filter, index) => (
                    <option key={filter} index={index}>{filter}</option>
                ))
            }
        </select>
    );
};

Filters.propTypes = {
    filterList: PropTypes.arrayOf(PropTypes.string)
};

export default Filters;