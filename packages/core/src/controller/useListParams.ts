import { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push } from 'connected-react-router';
import { changeListParams } from '../actions/listActions';
import queryReducer from '../reducers/resources/list/queryReducer';
import { pickBy, isEqual, removeKey } from '../util';

export const useListParams = ({
    resource,
    location,
    filterDefaultValues,
    sort = { field: 'id', order: 'ASC' },
    perPage = 10,
    debounce = 500,
}) => {
    const [displayedFilters, setDisplayedFilters] = useState({});
    const dispatch = useDispatch();
    const { params } = useSelector(
        (state: any) => state.resources[resource].list
    );

    const requestSignature = [
        location.search,
        resource,
        params,
        filterDefaultValues,
        JSON.stringify(sort),
        perPage,
    ];

    const query = useMemo(
        () =>
            getQuery({ location, params, filterDefaultValues, sort, perPage }),
        requestSignature
    );

    const changeParams = useCallback(action => {
        const newParams = queryReducer(query, action);
        dispatch(
            push({
                search: `?${stringify({
                    ...newParams,
                    filter: JSON.stringify(newParams.filter),
                })}`,
            })
        );

        dispatch(changeListParams(resource, newParams));
    }, requestSignature);

    const setSort = useCallback(
        sort => changeParams({ type: 'SET_SORT', payload: { sort } }),
        requestSignature
    );

    const setPage = useCallback(
        page => changeParams({ type: 'SET_PAGE', payload: page }),
        requestSignature
    );

    const setPerPage = useCallback(
        perPage => changeParams({ type: 'SET_PER_PAGE', payload: perPage }),
        requestSignature
    );

    const filterValues = query.filter || {};

    const setFilters = useCallback(filter => {
        if (isEqual(filter, filterValues)) {
            return;
        }

        changeParams({ type: 'SET_FILTERS', payload: filter });
    }, requestSignature);

    const hideFilter = useCallback(filterName => {
        setDisplayedFilters({ [filterName]: false });
        const newFilters = removeKey(filterValues, filterName);
        setFilters(newFilters);
    }, requestSignature);

    const showFilter = useCallback((filterName, defaultValue) => {
        setDisplayedFilters({ [filterName]: true });
        if (typeof defaultValue !== 'undefined') {
            setFilters({
                ...filterValues,
                [filterName]: defaultValue,
            });
        }
    }, requestSignature);

    return [
        { displayedFilters, filterValues, requestSignature, ...query },
        {
            changeParams,
            setPage,
            setPerPage,
            setSort,
            setFilters,
            hideFilter,
            showFilter,
        },
    ];
};

/**
 * 将参数转换成对象
 * ?page=1&perPage=10&sort=stb&order=ASC&filter={}
 * @param param0
 */
export const parseQueryFromLocation = ({ search }) => {
    const query: any = pickBy(
        parse(search),
        (v, k) => ['page', 'perPage', 'sort', 'order', 'filter'].indexOf(k) !== -1
    );

    if (query.filter && typeof query.filter === 'string') {
        try {
            query.filter = JSON.parse(query.filter);
        } catch (err) {
            delete query.filter;
        }
    }

    return query;
};

/**
 *
 * { filter: {}, order: null, page: 1, perPage: null, sort: null }
 * @param params
 */
export const hasCustomParams = params => {
    return (
        params &&
        params.filter &&
        (Object.keys(params.filter).length > 0 ||
            params.order !== 1 ||
            params.page !== 1 ||
            params.perPage != null ||
            params.sort != null)
    );
};

export const getQuery = ({
    location,
    params,
    filterDefaultValues,
    sort,
    perPage,
}) => {
    const queryFormLocation = parseQueryFromLocation(location);
    const query =
        Object.keys(queryFormLocation).length > 0
            ? queryFormLocation
            : hasCustomParams(params)
                ? { ...params }
                : { filter: filterDefaultValues || {} };

    if (!query.sort) {
        query.sort = sort.field;
        query.order = sort.order;
    }

    if (!query.perPage) {
        query.perPage = perPage;
    }

    if (!query.page) {
        query.page = 1;
    }

    return {
        ...query,
        page:
            (typeof query.page === 'string'
                ? parseInt(query.page, 10)
                : query.page) || 1,
        perPage:
            (typeof query.perPage === 'string'
                ? parseInt(query.perPage, 10)
                : query.perPage) || 10,
    };
};