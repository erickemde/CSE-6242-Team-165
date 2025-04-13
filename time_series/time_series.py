from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from statsmodels.tsa.api import ExponentialSmoothing, SimpleExpSmoothing, Holt

# Class to run exponential smoothing, and adjust data based on smoothed values, mean, and median
## to-do: fix tight end bug due to there not being TE data every year
## to-do: revisit exponential smoothing
class ts_adjustment:
    def __init__(self, data, position=None):
        assert position is None or position in ['QB', 'RB', 'WR', 'TE']
        if position in ['QB', 'RB', 'WR', 'TE']:
            self.data = data[(data['position']==position) & (data['year_signed']>0)]
            self.position = position
        else:
            self.data = data[data['year_signed']>0]
            self.position = "Player"
    def visualize(self):
        plt.scatter(self.data['year_signed'], np.log(self.data['apy']))
        plt.title(f"Log {self.position} Salary (mm USD)")
        plt.figure()
        plt.scatter(self.data['year_signed'], self.data['apy'])
        plt.title(f"Raw {self.position} Salary (mm USD)")
        self.mean_salary_by_year = self.data.groupby("year_signed", as_index = False).agg({'apy':'mean'})
        self.mean_salary_by_year = self.mean_salary_by_year[self.mean_salary_by_year['year_signed']>= 1994]
        self.mean_salary_by_year = self.mean_salary_by_year.rename(columns = {'apy':'mean_apy'})
        self.med_salary_by_year = self.data.groupby("year_signed", as_index = False).agg({'apy':'median'})
        self.med_salary_by_year = self.med_salary_by_year[self.med_salary_by_year['year_signed']>=1994]
        self.med_salary_by_year = self.med_salary_by_year.rename(columns = {'apy':'med_apy'})
        plt.figure()
        plt.scatter(self.mean_salary_by_year['year_signed'], self.mean_salary_by_year['mean_apy'], label = "Mean Salary")
        plt.scatter(self.med_salary_by_year['year_signed'], self.med_salary_by_year['med_apy'], label = "Median Salary")
        plt.title(f"Mean/Median {self.position} Salary (mm USD)")
        plt.legend()
        self.recent_mean_salary_by_year = self.mean_salary_by_year[self.mean_salary_by_year['year_signed']>= 2010]
        self.recent_med_salary_by_year = self.med_salary_by_year[self.med_salary_by_year['year_signed']>=2010]
        plt.figure()
        plt.scatter(self.recent_mean_salary_by_year['year_signed'], self.recent_mean_salary_by_year['mean_apy'], label = "Mean Salary since 2010")
        plt.scatter(self.recent_med_salary_by_year['year_signed'], self.recent_med_salary_by_year['med_apy'], label = 'Median Salary since 2010')
    # def detrending(self):
    #     ## fit univariate linear regression with apy as dependent var and year as indepedent
    #     ## detrend by subtracting coefficient and intercept value from data
    #     print('placeholder')
    def smoothing(self, smoothing_level = 0.5):
        ## investigate standard double exponential smoothing as well as some others
        ## simple, all means
        years = pd.date_range(start = '1994',\
        end = '2026', freq = 'YE')
        #print(self.mean_salary_by_year)
        #print(years)
        mean_series = pd.Series(self.mean_salary_by_year['mean_apy'].values, years)
        #print(mean_series)
        #print(self.mean_salary_by_year['apy'].values)
        simple_es = SimpleExpSmoothing(mean_series).fit(smoothing_level = smoothing_level, optimized = False)
        #num_samples = len(self.mean_salary_by_year)
        #what does int in forecast method do?
        fcast_simple = simple_es.forecast(3)
        #print(simple_es.initial_values)
        plt.figure()
        plt.plot(simple_es.fittedvalues)
        plt.plot(mean_series)
        #print(simple_es.fittedvalues.index.year.values)
        self.smoothed_values = pd.DataFrame({'year_signed':simple_es.fittedvalues.index.year.values, 'smoothed_apy': simple_es.fittedvalues})
        plt.figure()
        #print(self.smoothed_values.dtypes)
        #(line1, ) = plt.plot(fcast_simple)
        ##double, with trend component (aka Holt)
        #print('placeholder')
    def normalization(self):
        ## use smoothed and detrended average contract values to normalize indivdual player salaries 
        self.data = self.data.merge(self.med_salary_by_year, left_on = 'year_signed', right_on = 'year_signed')
        self.data = self.data.merge(self.mean_salary_by_year, left_on = 'year_signed', right_on = 'year_signed')
        # robust z-score: https://d1wqtxts1xzle7.cloudfront.net/61796863/Data_Normalization_Using_MAD_Z-Score20200115-15558-1ttyo6e-libre.pdf?1579119375=&response-content-disposition=inline%3B+filename%3DData_Normalization_Using_Median_and_Medi.pdf&Expires=1744217889&Signature=fDlH7XQ8oXmzP-XdnC-hpR8EGSSyARJ5Rvq9m0S846zUbR3Vgo1hzzg9BFk4O-dau0EeMBjT4xx3AhFyX7iafOoITGke7inWSxbhi8XWtypObKWGl8UvVie~eHAKDhYqUyxTdmsWw188rlpgoQyrsdkqHgIp6EhoDLenonjRDF2lqAOypTcRRJIXZfSiG1gshhZ~SjUUEFVCchq~wNppktaydauDBzZqh4ri7gqOzvhDurKzDt2VP8fi4hLCCv~tymnb8bCq2evefqbNnrYmZalHowDGsxs~bjsO0a2B7ejU8c-6Bw4eqAaWBaEr-JgDnn21sF2UeOXPhr9RVONAtw__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA
        self.data['abs_diff_from_median'] = np.abs(self.data['med_apy'] - self.data['apy'])
        MAD = self.data.groupby("year_signed", as_index = False).agg({'abs_diff_from_median': 'median'})
        MAD = MAD.rename(columns = {'abs_diff_from_median': 'MAD'})
        self.data = self.data.merge(MAD, left_on = 'year_signed', right_on = 'year_signed')
        self.data['med_adjusted_apy'] = (self.data['apy'] - self.data['med_apy'])/self.data['MAD']
        scaler = StandardScaler()
        apy_array = np.array(self.data['apy'])
        apy_array = np.reshape(apy_array, (len(self.data),1))
        self.data['mean_adjusted_apy'] = scaler.fit_transform(apy_array)
        # similar approach to robust z score for time series smoothed data
        self.data = self.data.merge(self.smoothed_values, left_on = 'year_signed', right_on = 'year_signed')
        self.data['abs_diff_from_smooth'] = np.abs(self.data['smoothed_apy']-self.data['apy'])
        SAD = self.data.groupby("year_signed", as_index = False).agg({'abs_diff_from_smooth': 'mean'})
        SAD = SAD.rename(columns = {'abs_diff_from_smooth': 'SAD'})
        self.data = self.data.merge(SAD, left_on = 'year_signed', right_on = 'year_signed')
        self.data['smooth_adjusted_apy'] = (self.data['apy'] - self.data['smoothed_apy'])/self.data['SAD']
        #print(self.data.dtypes)
        return self.data[['player','year_signed', 'apy','med_adjusted_apy', 'mean_adjusted_apy', 'smooth_adjusted_apy']]

## run logic
positions = ['QB', 'RB', 'WR']#, 'TE']
for pos in positions:
    adjustment = ts_adjustment(salaries, position = pos)
    adjustment.visualize()
    adjustment.smoothing(smoothing_level = 0.3)
    adjusted_salary = adjustment.normalization()
    adjusted_salary.to_csv(f'{pos}_adjusted_salaries.csv', index = False)