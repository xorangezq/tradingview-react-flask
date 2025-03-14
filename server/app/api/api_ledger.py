
import os
import pandas as pd

from util.stockinfo import get_info_by_code

from loguru import logger

TRANSACTIONS_CSV = os.path.join('ledger', 'transactions.csv')

transactionsdf = pd.read_csv(TRANSACTIONS_CSV, encoding='utf-8',
    dtype={
        'code': str,
    },
)
transactionsdf['time'] = pd.to_datetime(transactionsdf['date'])
transactionsdf = transactionsdf.sort_values(by='time')

def api_known_stocks():
    codes = list(set(map(str, transactionsdf['code'].tolist())))
    return [get_info_by_code(code) for code in codes]

def api_code_transactions(code):
    codedf = transactionsdf[ transactionsdf['code'] == code ]
    if not codedf.empty:
        codedf['time'] = codedf['date']
        codedf['buysell'] = codedf['buy-1sell1']
    else:
        codedf['time'] = pd.Series([], dtype="object")
        codedf['buysell'] = pd.Series([], dtype="object")
    apicodedf = codedf[['time', 'code', 'amount', 'price', 'buysell', 'stop']]
    return apicodedf.to_dict(orient='records')
