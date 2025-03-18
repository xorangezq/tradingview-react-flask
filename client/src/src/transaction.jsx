
import React, { useEffect, useRef, useState } from 'react';
import { Table, Input } from 'antd';

export default Transactions = ({stock, transactions, critPrice}) => {

    const [tabledata, setTableData] = useState(transactions);
    const [flags, setFlags] = useState({
        dynamicStop: false,
    })

    const toggleFlags = (key) => {
        setFlags(prev => ({
            ...prev,          // 保留其他状态
            [key]: !prev[key] // 仅修改目标键值
        }));
        console.log('toggle', key)
    };

    useEffect(() => {
        setTableData(transactions.map(trans => ({
            ...trans,
            netmoney: Number(trans.buysell) * parseFloat(trans.amount) * parseFloat(trans.price),
            gain: '',
        })));
    }, [transactions]);
    //console.log(tabledata);

    const columns = [
        { title: '方向', dataIndex: 'buysell', key: 'buysell',
            render: (_, record) => <span>{(record.buysell == 1) ? '卖出' : '买入'}</span>,
        },
        { title: '价格', dataIndex: 'price', key: 'price', },
        { title: '数量', dataIndex: 'amount', key: 'amount', },
        { title: '日期', dataIndex: 'time', key: 'time', },
        { title: '资金变化', dataIndex: 'netmoney', key: 'netmoney',
            render: (_, record) => <span>{parseFloat(record.netmoney).toFixed(2)}</span>
        },
    ];

    return (
        <>
            <h3>{stock.code} {stock.name}</h3>
            <Table
                columns={columns}
                dataSource={tabledata}
                rowKey='id'
                pagination={false}
            />
            {(transactions.length > 0) &&
                <h3>现持股：{transactions.reduce(
                    (acc, trans) => acc + -1 * trans.buysell * trans.amount,
                    0
                )}</h3>
            }
            {(transactions.length > 0) &&
                <h3>净值：{transactions.reduce(
                    (acc, trans) => acc + trans.buysell * trans.amount * trans.price,
                    0
                )}</h3>
            }
        </>
    );
}
