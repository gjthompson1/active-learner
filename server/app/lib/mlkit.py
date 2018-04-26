import pandas as pd
from sklearn.linear_model import LogisticRegression

MODEL_COLUMNS = [
    'vote_average',
    'vote_count',
    'revenue',
    'runtime',
    'budget',
    'popularity',
    'release_year',
]

def train_model(goods, bads):

    good_df = pd.DataFrame(goods)
    bad_df = pd.DataFrame(bads)

    good_df = good_df[MODEL_COLUMNS]
    bad_df = bad_df[MODEL_COLUMNS]

    good_df['is_good'] = 1
    bad_df['is_good'] = 0

    df = pd.concat([good_df,bad_df],axis=0)

    clf = LogisticRegression()
    clf.fit(df[MODEL_COLUMNS], df['is_good'])

    return {
        'coef': {x:y for x,y in zip(MODEL_COLUMNS,clf.coef_[0])},
        'intercept': clf.intercept_[0],
    }
