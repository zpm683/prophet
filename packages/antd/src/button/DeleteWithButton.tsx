import React from 'react';
import { crudDelete, DeleteController } from 'prophet-core';

export class DeleteWithButtonView extends React.Component<any> {
    handleClick = () => {
        const { update, record } = this.props;
        update(record);
    };
    render() {
        const { label, className, style } = this.props;

        return (
            <a onClick={this.handleClick} className={className} style={style}>
                {label}
            </a>
        );
    }
}

export const DeleteWithButton = props => (
    <DeleteController {...props}>
        {controllerProps => (
            <DeleteWithButtonView {...props} {...controllerProps} />
        )}
    </DeleteController>
);

export default DeleteWithButton;