import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createMarkup } from 'utils/html';

import { hideErrorNotification } from 'actions/app-state-actions';

export class ErrorNotificationComponent extends Component {
    render() {
        return (
            <div key="content" className="sk-notification sk-notification-error">
                <p>
                    <span ref="text" dangerouslySetInnerHTML={ createMarkup(this.props.message) }></span>
                    <a href="#" className="sk-notification-close" onClick={ this.props.actions.hideErrorNotification }>&times;</a>
                </p>
            </div>
            );
    }
}

export const ErrorNotification = connect(undefined, (dispatch) => {
    return {
        actions: bindActionCreators({
            hideErrorNotification
        }, dispatch)
    };
})(ErrorNotificationComponent);