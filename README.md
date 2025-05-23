# CSE-6242-Team-165
Group Project for CSE 6242 -- Predicting and Visualizing NFL Player Salary

This file can be found as the root README.md at https://github.com/wbutin3/CSE-6242-Team-165/

How to Run / Repo Structure:

  1. Exponentially smoothed player salaries are created in time-series folder. [time_series_readme.txt](https://github.com/wbutin3/CSE-6242-Team-165/blob/main/time_series/time_series_readme.txt)

  2. Preprocessiing notebooks clean data and join with corresponding adjusted salaries. [Quarterback Notebook Example](https://github.com/wbutin3/CSE-6242-Team-165/blob/main/preprocessing/qb.ipynb)

  3. Models/final files run GBM models on each position, and output data with predictions into data/dashboard. [Quarterback GBM example](https://github.com/wbutin3/CSE-6242-Team-165/blob/main/models/final/qb_gbm.ipynb)

  4. Time_series/dashboard_data_reverting joins modeling output dfs, and converts smoothed salary predictions into current $USD. [Reverting for All Positions](https://github.com/wbutin3/CSE-6242-Team-165/blob/main/time_series/dashboard_data_reverting.ipynb)

  5. Visualization folder creates dashboard and heatmap to visualize player valuations and give insights on prospective NFL players
     1. Heatmap [Tableau file](https://github.com/wbutin3/CSE-6242-Team-165/blob/main/visualization/CSE6242Visualizations.twb)
     2. Dashboard [Read.me](https://github.com/wbutin3/CSE-6242-Team-165/blob/main/visualization/nfl-dashboard/README.md)

  6. Final dashboard can be viewed here: https://wbutin3.github.io/CSE-6242-Team-165/
