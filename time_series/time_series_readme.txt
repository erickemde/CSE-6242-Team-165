## Readme for running time_series class to exponentially smooth and revert data after prediction

# Data
# Salary data can be retrieved from the following link: https://github.com/nflverse/nflverse-data/releases/tag/contracts
# Any of the files is fine to use, and should be read into a pandas dataframe. The time_series.ts_adjustment class will take this 
# dataframe as input, and automatically filter it to after the year 1994 (the year the salary cap was introduced to the NFL). It 
# is recommended to specify a position as well, as there is quite a bit of variability of salary between positions. The class 
# will accept "QB", "WR", or "RB".

# Running the code is fairly straighforward, example below:

import time_series
import pandas as pd

salaries = pd.read_parquet('historical_contracts.parquet')

adjustment = time_series.ts_adjustment(salaries, position = "QB")
adjustment.visualize()
adjustment.smoothing(smoothing_level = 0.3)
adjusted_salary = adjustment.normalization()
adjusted_salary.to_csv(f'{pos}_adjusted_salaries.csv', index = False)

#Running the above logic will provide a csv with mean, median, and exponentially smoothed adjusted salary values.
#It also produces csv and pkl files, that must be in your local directory with the appropriate names to later
# revert predictions.

# Once regression predicted values can be obtained, the time_series.revert class can then be called to adjust back predictions to
# real salary values. Please note that salaries for year n are predicted using player performance from year n-1, e.g. 2024 salaries
# are meant to be predicted using 2023 statistics. The revert class will take the year argument with respect to the year of the *salaries*
# not the year of performance statistics. It is currently NOT RECOMMENDED to use this class for 2025 data, as there is not a full
# off-season's worth of new salary data.

#Additionally, the revert class expects a schema in the data that includes the columns: ['predicted_salary', 'year_signed']

data = pd.read_csv('qb_predictions.csv')
reverting = revert(data, position = 'QB', year = 2024)

#We can then specify which time of reverting we want, depending on how the salary data fed into the regression model was normalized.
# the options are: ['mean', 'median', 'smooth']

smoothed = reverting.unnormalize('smooth')

# This returns a pandas dataframe with reverted, AKA unnormalized, salary predictions. This can then subsequently be fed into
# visualizations.