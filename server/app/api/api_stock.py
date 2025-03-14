
from stock.pool import Pool
from stock.frontend import CodeFormatter
from stock.util.time import (
    map_date_format,
    get_today,
    map_xdays_before,
    from_date_format,
)

from util.stockinfo import get_info_by_code

from loguru import logger

pool = Pool(ktype='day', to_date=get_today(), pool_dir='./data', download=True)
stockdf = pool.df

# 生成模拟数据（包含日期和4个浮点数）
def generate_data(num_items=300):
    time = datetime.strptime('2025-01-02', '%Y-%m-%d')
    data = []
    for i in range(num_items):
        low = round(random.uniform(0, 20), 2)
        open = low + round(random.uniform(0, 20), 2)
        close = open + round(random.uniform(0, 20), 2)
        high = close + round(random.uniform(0, 20), 2)
        item = {
            # "date": str(date(2023 + i%3, (i%12)+1, (i%28)+1)),  # 模拟日期
            "time": time.strftime('%Y-%m-%d'),
            'open': open,
            'close': close,
            'high': high,
            'low': low,
        }
        time = (time + timedelta(days=2))
        data.append(item)
    return data

def mapdf_timewindow(df, days_timewindow=120):
    map_date_format_xdays_before = lambda datestr, days : \
        map_date_format(
            map_xdays_before(
                from_date_format(datestr), days))

    latest_date_in_pool = df['date'].max()
    logger.info('from {}, day span {}', latest_date_in_pool, days_timewindow)
    date_start = map_date_format_xdays_before(latest_date_in_pool, days_timewindow)

    return df[ df['date'] >= date_start ]

def api_code_data(code, days_timewindow=250):
    df = stockdf
    dfcode = CodeFormatter.toPool(code)
    df_cond_code = (df['code'] == dfcode)
    codedf = df[ df_cond_code ]
    codedf = codedf.drop_duplicates(subset=['date'])
    codedf = mapdf_timewindow(codedf, days_timewindow)
    codedf['time'] = codedf['date']
    codedf = codedf[['time', 'open', 'close', 'high', 'low']]
    # logger.debug(codedf)
    return codedf.to_dict(orient='records')

def api_stock_info(code):
    return get_info_by_code(code)
