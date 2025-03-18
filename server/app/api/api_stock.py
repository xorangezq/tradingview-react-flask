
from util.stockinfo import get_info_by_code

import os
import pandas as pd
from loguru import logger

stockdf = pd.read_csv(os.path.join('data', 'example.stock_k_day.csv'), encoding='utf-8')

class CodeFormatter:
    @staticmethod
    def baostock_style(code):
        if len(code) > 6:
            # quick assume already full
            return code

        rules_startswith = {
        '60' : 'sh',
        '68' : 'sh',
        '00' : 'sz',
        '30' : 'sz',
        '20' : 'sz',
        '90' : 'bj',
        }
        for bw, head in rules_startswith.items():
            if code.startswith(bw):
                return head + '.' + code

        print('Warning, cant determine full name for \'%s\', guessing \'%s\'' % (code, 'sh' + code))
        return 'sh' + '.' + code

def api_code_data(code):
    df = stockdf
    dfcode = CodeFormatter.baostock_style(code)
    df_cond_code = (df['code'] == dfcode)
    codedf = df[ df_cond_code ]
    codedf = codedf.drop_duplicates(subset=['date'])
    codedf['time'] = codedf['date']
    codedf = codedf[['time', 'open', 'close', 'high', 'low']]
    # logger.debug(codedf)
    return codedf.to_dict(orient='records')

def api_stock_info(code):
    return get_info_by_code(code)
