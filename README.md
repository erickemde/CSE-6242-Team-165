# CSE-6242-Team-165
Group Project for CSE 6242 -- Predicting and Visualizing NFL Player Salary


How to Run / Repo Structure:

Exponentially smoothed player salaries are created in time-series folder
Preprocessiing notebooks clean data and join with corresponding adjusted salaries
Models/final files run GBM models on each position, and output data with predictions into data/dashboard
Time_series/dashboard_data_reverting joins modeling output dfs, and converts smoothed salary predictions into current $USD
Visualization folder creates dashboard and heatmap to visualize player valuations and give insights on prospective NFL players
