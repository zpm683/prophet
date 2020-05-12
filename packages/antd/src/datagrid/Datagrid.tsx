import React, { Children, FunctionComponent } from 'react';
import { Table } from 'antd';

interface Props {
    children?: any;
    data?: any;
    ids?: any;
    page?: any;
    perPage?: any;
    total?: any;
    setPage?: any;
    setPerPage?: any;
    showSizeChanger?: any;
    showQuickJumper?: any;
    hideOnSinglePage?: any;
    noData?: any;
    allowLocalPage?: any;
}

/**
 * <Datagrid>
 *  <Column dataIndex="name">姓名</Column>
 *  <Column dataIndex="age">年龄</Column>
 * </Datagrid>
 */
export const Datagrid: FunctionComponent<Props> = props => {
    const {
        children = [],
        data,
        ids,
        page,
        perPage,
        total,
        setPage,
        setPerPage,
        showSizeChanger,
        showQuickJumper,
        hideOnSinglePage,
        noData,
        allowLocalPage,
    } = props;

    const handlePageChange = (current, pageSize) => setPage(current);

    const handleShowSizeChange = (current, pageSize) => setPerPage(pageSize);

    const handleShowTotal = () =>
        `共 ${total} 条记录 第 ${page}/${Math.ceil(total / perPage)} 页`;

    const columns: any = [];

    Children.map(children, (child, key) => {
        const { children, dataIndex, isOpera, ...other } = child.props;

        columns.push({
            title: children || dataIndex,
            dataIndex,
            key,
            ...other,
        });
    });

    const pg = allowLocalPage
        ? { defaultCurrent: page }
        : {
              current: page,
              onShowSizeChange: handleShowSizeChange,
              onChange: handlePageChange,
          };

    const pagination = {
        showSizeChanger,
        showQuickJumper,
        hideOnSinglePage,
        total,
        defaultPageSize: perPage,
        showTotal: handleShowTotal,
        ...pg,
    };

    const newData = Array.isArray(data) ? data : ids && ids.map(d => data[d]);

    if (noData && (!newData || !newData.length)) {
        return noData;
    }

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={newData}
            pagination={pagination}
            {...props}
        ></Table>
    );
};

Datagrid.defaultProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    hideOnSinglePage: true,
    data: [],
    page: 1,
    allowLocalPage: false,
};

export default Datagrid;
