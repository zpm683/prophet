/**
 * @license
 * Copyright Stbui All Rights Reserved.
 * https://github.com/stbui/prophet
 */

import React, { FunctionComponent, ComponentType } from 'react';
import { Switch, Route } from 'react-router-dom';
import CoreRouter from './CoreRouter';

export interface CoreUIProps {
    title?: string;
    dashboard?: ComponentType;
    layout: ComponentType;
    loginPage?: ComponentType<any>;
    catchAll: any;
    menu?: ComponentType;
    brand?: ComponentType;
    customRoutes?: any[];
    children?: any;
}

const CoreUI: FunctionComponent<CoreUIProps> = ({
    children,
    title = 'Stbui',
    dashboard,
    layout,
    loginPage,
    catchAll = () => null,
    menu,
    brand,
    customRoutes = [],
}) => (
    <Switch>
        {loginPage ? (
            <Route
                exact
                path="/login"
                render={props =>
                    React.createElement(loginPage, {
                        ...props,
                        title,
                    })
                }
            />
        ) : null}
        <Route
            path="/"
            render={props => (
                <CoreRouter
                    layout={layout}
                    dashboard={dashboard}
                    customRoutes={customRoutes}
                    catchAll={catchAll}
                    menu={menu}
                    brand={brand}
                    title={title}
                    {...props}
                >
                    {children}
                </CoreRouter>
            )}
        />
    </Switch>
);

export default CoreUI;
