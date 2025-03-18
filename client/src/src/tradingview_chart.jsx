
import React, { useEffect, useRef, useState } from 'react';
import {
    createChart,
    CandlestickSeries,
    LineSeries,
    createSeriesMarkers,
    ColorType,
    LineStyle,
    CrosshairMode,
} from 'lightweight-charts';

function* slideWindow(data, span=6) {
    let win = data.slice(0, span);
    yield win;
    for (let i = span; i < data.length; i++) {
        win.shift();
        win.push(data[i]);
        yield win;
    }
    return;
}

export default KChart = props => {
    const {
        records,
        transactions,
        markerFlags,
        setCritData,
        critPrice,
        setCritPrice,
        colors: {
            backgroundColor = '#222',
            lineColor = '#2962FF',
            textColor = '#DDD',
            gridColor = '#444',

            upColor = '#ef5350',
            downColor = '#26a69a',

            blueColor = '#2196F3',
            orangeColor = 'rgba(240, 180, 40, 1)',
            purpleColor = '#9B7DFF',
            yellowColor = 'rgba(230, 220, 115, 1)',
            grayColor = 'rgba(230, 220, 220, 1)', // '#71649C'
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(
        () => {
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            };

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: {
                        type: ColorType.Solid,
                        color: backgroundColor
                    },
                    textColor,
                },
                grid: {
                    vertLines: { color: gridColor },
                    horzLines: { color: gridColor },
                },
                width: chartContainerRef.current.clientWidth,
                height: 600,
                crosshair: {
                    mode: CrosshairMode.Normal,
                    vertLine: {
                        width: 8,
                        color: '#C3BCDB44',
                        style: LineStyle.Solid,
                        labelBackgroundColor: purpleColor,
                    },
                },
                panes: {
                    separatorColor: '#f22c3d',
                    separatorHoverColor: 'rgba(255, 0, 0, 0.1)',
                    // setting this to false will disable the resize of the panes by the user
                    enableResize: false,
                },
            });
            chart.priceScale().applyOptions({
                borderColor: '#71649C',
            });
            chart.timeScale().applyOptions({
                borderColor: '#71649C',
                /*barSpacing: 10,*/
            });

            const serieCandles = chart.addSeries(CandlestickSeries, {
                upColor: upColor, wickUpColor: upColor,
                downColor: downColor, wickDownColor: downColor,
                borderVisible: false,

                // disable default priceline
                lastValueVisible: false,
                priceLineVisible: false,
            }, 0);
            const seriesBOLLup = chart.addSeries(LineSeries, {
                color: grayColor,
                lineWidth: 0.5,
                lastValueVisible: false,
                priceLineVisible: false,
                crosshairMarkerVisible: false,
            }, 0);
            const seriesBOLLmean = chart.addSeries(LineSeries, {
                color: grayColor,
                lineWidth: 0.5,
                lastValueVisible: false,
                priceLineVisible: false,
                crosshairMarkerVisible: false,
            }, 0);
            const seriesBOLLlow = chart.addSeries(LineSeries, {
                color: grayColor,
                lineWidth: 0.5,
                lastValueVisible: false,
                priceLineVisible: false,
                crosshairMarkerVisible: false,
            }, 0);
            const seriesSide1idx = chart.addSeries(LineSeries, {
                color: yellowColor,
                lineWidth: 1.5,
                lastValueVisible: false,
                priceLineVisible: false,
                crosshairMarkerVisible: false,
            }, 1);
            const seriesSide2idx = chart.addSeries(LineSeries, {
                color: upColor,
                lineWidth: 1.5,
                lastValueVisible: false,
                priceLineVisible: false,
                crosshairMarkerVisible: false,
            }, 2);

            /*const maSpan = 20;
            const ma = [];
            if (records.length > maSpan) {
                let masum = records.slice(0, maSpan).reduce((acc, record) => acc + record.close, 0);
                ma.push({
                    time: records[maSpan-1].time,
                    value: masum / maSpan,
                });
                for (let i = maSpan; i < records.length; i++) {
                    masum -= records[i - maSpan].close;
                    masum += records[i].close;
                    ma.push({
                        time: records[i].time,
                        value: masum / maSpan,
                    });

                }
            }*/

            const bollSpan = 20;
            const bollwide = 2;
            function calBoll(records) {
                const boll = [];
                for (let winRecords of slideWindow(records, span=bollSpan)) {
                    const spanClose = winRecords.map(record => record.close);
                    const n = spanClose.length;
                    const mean = spanClose.reduce((sum, num) => sum + num, 0) / n;
                    const squaredDiffs = spanClose.map(num => Math.pow(num - mean, 2));
                    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (n);
                    const std = Math.sqrt(variance);
                    boll.push({
                        time:   winRecords[bollSpan-1].time,
                        up:     mean + bollwide * std,
                        mean:   mean,
                        low:    mean - bollwide * std,
                    })
                }
                return boll;
            }
            const bollup = [];
            const bollmean = [];
            const bolllow = [];
            if (records.length > bollSpan) {
                const boll = calBoll(records);
                bollup.push(    ...boll.map(b => {return {time: b.time, value: b.up};}));
                bollmean.push(  ...boll.map(b => {return {time: b.time, value: b.mean};}));
                bolllow.push(   ...boll.map(b => {return {time: b.time, value: b.low};}));
            }

            // console.log(records.constructor.name)
            // console.log('set candle', records.length)
            serieCandles.setData(records);
            if (markerFlags.useBOLL) {
                seriesBOLLup.setData(bollup);
                seriesBOLLmean.setData(bollmean);
                seriesBOLLlow.setData(bolllow);
            }
            seriesSide1idx.setData(records.map(record => ({
                time: record.time,
                value: record.high - record.low,
            })));
            seriesSide2idx.setData(records.map(record => ({
                time: record.time,
                value: 100 * Math.abs(record.close - record.low) / record.close,
            })));

            const markers = [];
            if (markerFlags.useTrans) {
                for (let trans of transactions) {
                    if (trans.buysell == -1) {
                        markers.push({
                            time: trans.time,
                            position: 'belowBar',
                            color: orangeColor,
                            shape: 'arrowUp',
                            text: '+' + trans.amount + ' @' + trans.price,
                        });
                    } else {
                        markers.push({
                            time: trans.time,
                            position: 'aboveBar',
                            color: blueColor,
                            shape: 'arrowDown',
                            text: '-' + trans.amount + ' @' + trans.price,
                        });
                    }
                }
            }
            if (markerFlags.useMainPos) {
                let lowest;
                let highest;
                if (records.length > 0) {
                    lowest = records[0];
                    highest = records[0];
                }
                for (let i = 1; i < records.length; i++) {
                    let curr = records[i];
                    if (lowest && curr.low <= lowest.low) {
                        lowest = curr;
                    }
                    if (highest && curr.high >= highest.high) {
                        highest = curr;
                    }
                }
                if (lowest) {
                    markers.push({
                        time: lowest.time,
                        position: 'belowBar',
                        color: purpleColor,
                        shape: 'circle',
                        text: '',
                    });
                }
                if (highest) {
                    markers.push({
                        time: highest.time,
                        position: 'aboveBar',
                        color: yellowColor,
                        shape: 'circle',
                        text: '',
                    });
                }
            }
            /*
            position: "aboveBar" | "belowBar" | "inBar"
            shape: "circle" | "square" | "arrowUp" | "arrowDown"
            */
            createSeriesMarkers(serieCandles, markers);

            /*
            paneCandles.moveTo(0);
            paneCandles.setHeight(150);*/
            /*const paneCandles = chart.panes()[0];*/
            const paneSide1idx = chart.panes()[1];
            const paneSide2idx = chart.panes()[2];
            /*paneCandles.setHeight(300);*/
            paneSide1idx.setHeight(80);
            paneSide2idx.setHeight(80);

            function onChartMove(param) {
                if (!param.point) {
                    return;
                }
                candle = param.seriesData.get(serieCandles);
                if (!candle) {
                    return;
                }
                setCritData([{
                    high: parseFloat(candle.high).toFixed(2),
                    open: parseFloat(candle.open).toFixed(2),
                    close: parseFloat(candle.close).toFixed(2),
                    low: parseFloat(candle.low).toFixed(2),
                    side1idx: parseFloat(param.seriesData.get(seriesSide1idx).value).toFixed(2),
                    side2idx: parseFloat(param.seriesData.get(seriesSide2idx).value).toFixed(2),
                }])
            }
            chart.subscribeCrosshairMove(onChartMove);

            chart.timeScale().fitContent();

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        },
        [
            records,
            transactions,
            markerFlags,
            backgroundColor, lineColor, textColor,
        ]
    );

    return (
        <div
            ref={chartContainerRef}
        />
    )
}
