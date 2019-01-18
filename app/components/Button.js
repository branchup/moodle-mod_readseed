import React from 'react';
import PropTypes from 'prop-types';

const Button = props => {
    return (
        <a
            href="#"
            className={`mod_readseed-btn ${props.inactive ? 'inactive' : ''}`}
            onClick={e => {
                e.preventDefault();
                props.onClick();
            }}
        >
            {props.children}
        </a>
    );
};

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    inactive: PropTypes.bool
};

export default Button;
