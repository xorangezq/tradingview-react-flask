## CN

`stockinfo.py` 负责代码和名称（以及其他信息）的转换。

`stock_info.csv` 目前存放的是 A 股的股票代码和名称、申万二级行业的对应关系。

用户在前端页面输入简要代码，通过查表，得到该股票的名称（以及其他信息非数值性，例如行业等）

你可以自由更改 csv 和 py，来适配自己的交易标的。只要定义好转换关系，甚至可以达到定义自用的、独有的快速代码等效果。

## EN

`stockinfo.py` is a transform from user-input codes from the frontend to server data backend. It maps a simple code to full information of a stock (or a trade target).

You may use a custom whatever transform to suit your own trade target.

In this example, `stock_info.csv` holds codes and names of China stocks.
