# -*- coding: utf-8 -*-
import pandas as pd
import os

path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'AI_Developer_Performance_Extended_1000.csv')
df = pd.read_csv(path)
print('SHAPE:', df.shape)
print()
print('COLUMNS:', list(df.columns))
print()
print('DTYPES:')
print(df.dtypes)
print()
print('MISSING VALUES:')
print(df.isnull().sum())
print()
print('HEAD:')
print(df.head(3).to_string())
print()
print('DESCRIBE:')
print(df.describe().to_string())
