
import os
import pandas as pd

from loguru import logger

stockinfodf = pd.read_csv(os.path.join(os.path.dirname(__file__), 'stock_info.csv'), encoding='utf-8',
    dtype={
        'code': str,
        'name': str,
        'industry': str,
    },
)

def get_info_by_code(code):
    codedf = stockinfodf[ stockinfodf['code'] == code ]
    info = codedf.values.tolist()[0]
    return {
        'code': info[0],
        'name': info[1],
        'industry': info[2],
    }

def get_info_by_name(name):
    codedf = stockinfodf[ stockinfodf['name'] == name ]
    try:
        info = codedf.values.tolist()[0]
    except:
        print(name)
    return {
        'code': info[0],
        'name': info[1],
        'industry': info[2],
    }
