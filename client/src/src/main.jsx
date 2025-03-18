
import React, { useEffect, useRef, useState } from 'react';
import { Table, Input } from 'antd';

import {
    fetchStock,
    fetchKnownStocks,
    fetchRecords,
    fetchTransactions
} from "./fetch";
import Transactions from "./transaction";
import KChart from "./tradingview_chart";

import {
    createChart,
    CandlestickSeries,
    LineSeries,
    createSeriesMarkers,
    ColorType,
    LineStyle,
    CrosshairMode,
} from 'lightweight-charts';

const processData = (rawData) => {
  return rawData.map(item => ({
    time: item.time,
    open: parseFloat(item.open),
    close: parseFloat(item.close),
    high: parseFloat(item.high),
    low: parseFloat(item.low)
  }));
};

class Stock {
    constructor(code, name) {
        this.code = code
        this.name = name
    }
};

const KChartParent = props => {
    const [selectedStock, setSelectedStock] = useState(new Stock("", ""));
    const [code, setCode] = useState(selectedStock.code); // overwritten at init
    const [stocks, setStocks] = useState([selectedStock]); // overwritten at init
    const [records, setRecords] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [markerFlags, setMarkerFlags] = useState({
        useTrans: true,
        useMainPos: true,
        useBOLL: true,
        useNote: true,
        useCloseOnly: false,
        drawCritPrice: false,
    });
    /*关键指标，从 K 线图中获取*/
    const [critData, setCritData] = useState([{
        high: 0,
        open: 0,
        close: 0,
        low: 0,
        wridx: 0,
        longforce: 0,
        shortforce: 0,
    }]);
    const [critPrice, setCritPrice] = useState(0);

    const handleAddToStocks = (stock) => {
        if (!stocks.find(stockli => stockli === stock)) {
            setStocks([...stocks, stock])
        }
    }
    const toggleMarkerFlags = (key) => {
        setMarkerFlags(prev => ({
            ...prev,          // 保留其他状态
            [key]: !prev[key] // 仅修改目标键值
        }));
        console.log('toggle', key)
    };

    useEffect(() => {
        const initCodes = async () => {
            try {
                const rawData = await fetchKnownStocks();
                let stocks = rawData.data
                if (stocks.length > 0) {
                    setStocks(stocks.map(stock => new Stock(stock.code, stock.name)))
                }
            } catch (err) {
                console.log('error', err)
                setError(err.message);
            } finally {
                console.log('loaded')
                setLoading(false);
            }
        };
        initCodes();
    }, []);

    useEffect(() => {
        const loadNewStock = async () => {
            if (loading) {
                const foundStock = stocks.find(stockli => (stockli.code === code));
                if (foundStock) {
                    setSelectedStock(foundStock)
                }
                else {
                    try {
                        const rawStock = await fetchStock(code);
                        let newStock = rawStock.data;
                        console.log('newstock', newStock);
                        setSelectedStock(newStock);
                        handleAddToStocks(newStock);
                    } catch (err) {
                        console.log('error', err)
                        setError(err.message);
                    } finally {
                        console.log('loaded')
                        setLoading(false);
                    }
                }
            }
        };
        loadNewStock();
    }, [loading]);

    useEffect(() => {
        const loadData = async () => {
            if (loading) {
                /*console.log('loading...')*/
                try {
                    const rawRecords = await fetchRecords(code);
                    const processedData = processData(rawRecords.data); // 解包"data"
                    setRecords(processedData);
                } catch (err) {
                    console.log('error', err)
                    setError(err.message);
                } finally {
                    console.log('loaded')
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [loading]);

    useEffect(() => {
        const loadTransactions = async () => {
            if (loading) {
                /*console.log('loading...')*/
                try {
                    const rawTransactions = await fetchTransactions(code);
                    setTransactions(rawTransactions.data.map(
                        (trans, index) => ({
                            ...trans,
                            id: index,
                        })
                    ));
                } catch (err) {
                    console.log('error', err)
                    setError(err.message);
                } finally {
                    console.log('loaded')
                    setLoading(false);
                }
            }
        };
        loadTransactions();
    }, [loading]);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error}</div>;

    const critColumns = [
        { title: 'high', dataIndex: 'high', key: 'high', },
        { title: 'open', dataIndex: 'open', key: 'open', },
        { title: 'close', dataIndex: 'close', key: 'close', },
        { title: 'low', dataIndex: 'low', key: 'low', },
        { title: '【示例】副图指标1', dataIndex: 'side1idx', key: 'side1idx', },
        { title: '【示例】副图指标2', dataIndex: 'side2idx', key: 'side2idx', },
    ];

    return (
        <>
            <KChart {...props}
                records={...records}
                transactions={...transactions}
                markerFlags={markerFlags}
                setCritData={setCritData}
                critPrice={critPrice}
                setCritPrice={setCritPrice}
            />
            <label>
            <input type="checkbox" checked={markerFlags.useTrans} onChange={(e) => toggleMarkerFlags("useTrans")}/>
            标注交易记录
            </label>
            <br/>
            <label>
            <input type="checkbox" checked={markerFlags.useBOLL} onChange={(e) => toggleMarkerFlags("useBOLL")}/>
            标注布林通道（和均线）
            </label>
            <br/>
            <label>
            <input type="checkbox" checked={markerFlags.useMainPos} onChange={(e) => toggleMarkerFlags("useMainPos")}/>
            【示例】标注主图指标
            </label>
            <br/>
            <h3>图中关键指标</h3>
            <Table
                columns={critColumns}
                dataSource={critData}
                // rowKey='id'
                pagination={false}
            />
            <hr/>
            <Transactions
                stock={selectedStock}
                transactions={...transactions}
                critPrice={critPrice}
            />
            <hr/>
            <input type="text" value={code} placeholder="请输入 code 代码"
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                    (e.key === 'Enter') && !loading && setLoading(true)
                }}
            />
            <button type="button" onClick={() => !loading && setLoading(true)}>
                {'load code'}
            </button>
            <br />
            <br />
            <label>(单击选中：)</label>
            <ul className="codes-list">
                {stocks.map((stock) => (
                    <li key={stock.code} onClick={() => setCode(stock.code)}>
                      {stock.code} {stock.name}
                    </li>
                ))}
            </ul>
        </>
    );
}

export function Main() {
    return (
        <KChartParent ></KChartParent>
    );
}
