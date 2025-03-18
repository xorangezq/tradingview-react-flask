
## Introduction

![snapshot](./assets/snapshot-en.jpg)

## How to run

backend:

```
cd server/app
pip install -r requirements.txt # gunicorn, flask, loguru, pandas
chmod +x wsgi.sh
./wsgi.sh
```

frontend：

```
cd client/src
npm install # install, first time only
npm start
```

## DEVELOPMENT

Based on [tradingview](https://github.com/tradingview/lightweight-charts)

This project is pretty much a flask-backed wrapper for tradingview-react rapid prototyping on your own real data.

You may try out any examples in [Official Documentation](https://tradingview.github.io/lightweight-charts/tutorials/how_to/price-line) in `client/src/tradingview_chart.jsx` for rapid prototyping, testouts and experiments.

Stack：
- frontend
    - react
    - parcel
    - antd（Table）
- backend
    - gunicorn
    - flask
    - pandas

issue and PR are welcomed.

## License

```
MIT License

Copyright (c) 2025 Oliver Xu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
