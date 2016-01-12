import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import Lightbox from 'react-images';

import { ActionComponent } from 'components/action';

import { createMarkup, autolink } from 'utils/html';

export class MessageComponent extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            lightboxShown: false
        };
    }

    onImageClick() {
        this.setState({
            lightboxShown: true
        });
    }

    onLightboxClose() {
        this.setState({
            lightboxShown: false
        });
    }

    render() {
        const actions = this.props.actions.map((action) => {
            return <ActionComponent key={ action._id } {...action} />;
        });

        const isAppUser = this.props.role === 'appUser';

        let avatar = isAppUser ? null : (
            <img className="sk-msg-avatar" src={ this.props.avatarUrl } />
            );

        let text;
        let lightbox = null;

        if (this.props.mediaUrl) {
            text = <img src={ this.props.mediaUrl } style={ {    maxWidth: '100%', cursor: 'pointer'} } onClick={ this.onImageClick.bind(this) } />;
            let noop = () => {
            };
            lightbox = <Lightbox showImageCount={ false }
                                 isOpen={ this.state.lightboxShown }
                                 images={ [{    src: this.props.mediaUrl}] }
                                 onClose={ this.onLightboxClose.bind(this) }
                                 onClickNext={ noop }
                                 onClickPrev={ noop } style={{zIndex: 9999}} />
        } else {
            text = this.props.text.split('\n').map((item, index) => {
                if (!item.trim()) {
                    return;
                }

                let innerHtml = createMarkup(autolink(item, {
                    target: '_blank'
                }));

                return <span key={ index }><span dangerouslySetInnerHTML={ innerHtml }></span>
                       <br/>
                       </span>;
            });
        }

        return (
            <div className={ 'sk-row ' + (isAppUser ? 'sk-right-row' : 'sk-left-row') }>
                { avatar }
                <div className="sk-msg-wrapper">
                    <div className="sk-from">
                        { isAppUser ? '' : this.props.name }
                    </div>
                    <div className="sk-msg">
                        { text }
                        { actions }
                    </div>
                </div>
                <div className="sk-clear"></div>
                { lightbox }
            </div>
            );
    }
}
