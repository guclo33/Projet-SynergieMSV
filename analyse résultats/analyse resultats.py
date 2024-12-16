import pandas as pd
import numpy as np
from matplotlib import pyplot as plt


df = pd.read_csv('Synergia.csv', encoding = 'latin1')

# fonction pour histogramme
def hist():
    plt.subplot(2,2,1)
    plt.hist(df['bleu'],range=(0,100), bins = 20, rwidth =5)
    plt.subplot(2,2,2)
    plt.hist(df['rouge'],range=(0,100), color = 'red', bins = 20, rwidth =5)
    plt.subplot(2,2,3)
    plt.hist(df['jaune'],range=(0,100), color = 'yellow', bins = 20, rwidth =5)
    plt.subplot(2,2,4)
    plt.hist(df['vert'],range=(0,100), color = 'green', bins = 20, rwidth =5)
    plt.rcParams['figure.figsize'] = (5, 5)
    plt.show()

df_bleu_mean = np.mean(df['bleu'])
df_vert_mean = np.mean(df['vert'])
df_jaune_mean = np.mean(df['jaune'])
df_rouge_mean = np.mean(df['rouge'])

print(df_bleu_mean)
print(df_vert_mean)
print(df_jaune_mean)
print(df_rouge_mean)

hist()