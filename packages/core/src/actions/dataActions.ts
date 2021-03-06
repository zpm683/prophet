/**
 * @license
 * Copyright Stbui All Rights Reserved.
 * https://github.com/stbui
 */

import { GET_LIST, GET_ONE } from './dataFatchActions';
import { DataAction } from './interfaces';

export const CRUD_GET_LIST = 'CRUD_GET_LIST';
export const CRUD_GET_LIST_LOADING = 'CRUD_GET_LIST_LOADING';
export const CRUD_GET_LIST_SUCCESS = 'CRUD_GET_LIST_SUCCESS';
export const CRUD_GET_LIST_FAILURE = 'CRUD_GET_LIST_FAILURE';

export const CRUD_GET_ONE = 'CRUD_GET_ONE';
export const CRUD_GET_ONE_LOADING = 'CRUD_GET_ONE_LOADING';
export const CRUD_GET_ONE_SUCCESS = 'CRUD_GET_ONE_SUCCESS';
export const CRUD_GET_ONE_FAILURE = 'CRUD_GET_ONE_FAILURE';

export const crudGetList = (
    resource: string,
    pagination: object,
    filter: object,
    sort: any,
    callback?: any
): DataAction => ({
    type: CRUD_GET_LIST,
    payload: { pagination, sort, ...filter },
    meta: {
        resource,
        fetch: GET_LIST,
        onSuccess: {
            callback,
        },
        onFailure: {
            notification: {
                type: 'warning',
                message: '获取失败',
            },
            callback,
        },
    },
});

export const crudGetOne = (
    resource: string,
    basePath: string,
    id: string | number,
    refresh: boolean = false,
    callback?: any
): DataAction => ({
    type: CRUD_GET_ONE,
    payload: { id },
    meta: {
        resource,
        fetch: GET_ONE,
        basePath,
        onSuccess: {
            refresh,
            callback,
        },
        onFailure: {
            notification: {
                type: 'warning',
                message: '获取失败',
            },
            refresh,
            callback,
        },
    },
});
