#!/usr/bin/env python
# coding: utf-8

# # Implement Logistic Regression for Book Classification
# 
# This notebook does the following:
# 
# * Loads a data set for predicting whether a book is hardcover or paperback from two input features: the thickness of the book and the weight of the book
# * Normalizes the features
# * Has a placeholder for your implementation of logistic regression
# * Plots the data and the decision boundary of the learned model
# 
# Read below and follow instructions to complete the implementation.
# 
# ## Setup
# Run the code below to import modules, etc.

# In[113]:


get_ipython().run_line_magic('matplotlib', 'inline')
get_ipython().run_line_magic('reload_ext', 'autoreload')
get_ipython().run_line_magic('autoreload', '2')

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

from util import normalize_features
from logistic_regression import logistic, cost_function, gradient_descent


# ## Load and Prep Data
# *Read the code* in the cell below and run it. This loads the book data from file and selects two features to set up the training data ``X`` (data matrix) and ``y`` (label vector). It then normalizes the training data to have both input features with mean 0 and variance 1.

# In[116]:


data = pd.read_csv('book-data.csv', sep=',',header=None).values

# % Data columns
# %
# % 0 - width
# % 1 - thickness .
# % 2 - height
# % 3 - pages
# % 4 - hardcover
# % 5 - weight . 

X = data[:,[1,5]]
#print(X)
y = data[:,4] # y consists of 1 and 0, with 1 indicating hardcover, 0 paperback 

# % Extract the normalized features into named column vectors
width     = data[:,0]
thickness = data[:,1]
height    = data[:,2]
pages     = data[:,3]
weight    = data[:,5]

m = data.shape[0]
X = np.stack([np.ones(m), thickness, height], axis=1)
n = X.shape[1]

X, mu, sigma = normalize_features(X)


# In[ ]:





# # (1 point) Implement the ``logistic`` function
# Open the file ``logistic_regression.py`` and complete the code for the function ``logistic`` (that is sigmoid). Then run the cell below to plot the logistic function for $-10 \leq z \leq 10$ to test your implementation --- it should look like the logistic function!

# In[117]:


z = np.linspace(-10, 10, 100)
plt.plot(z, logistic(z))
plt.show()


# # (2 points) Implement ``cost_function``
# Complete the code for ``cost_function`` in the file ``logistic_regression.py`` to implement the logistic regression cost function (i.e., the logistic loss introduced in clas). Then test it with the code in the cell below.

# In[118]:


w = np.zeros(n)
print(cost_function(X, y, w)) # prints 38.81624....


# # Setup for plotting a learned model
# Run this cell and optionally read the code. It defines a function to help plot the data together with the decision boundary for the model we are about to learn.

# In[119]:


def plot_model(X, y, w):
    pos = y==1
    neg = y==0

    plt.scatter(X[pos,1], X[pos,2], marker='+', color='blue', label='Hardcover')
    plt.scatter(X[neg,1], X[neg,2], marker='o', color='red', facecolors='none', label='Paperback')

    # plot the decision boundary
    x1_min = np.min(X[:,1]) - 0.5
    x1_max = np.max(X[:,1]) + 0.5

    x1 = np.array([x1_min, x1_max])
    x2 = (w[0] + w[1]*x1)/(-w[2])
    plt.plot(x1, x2, label='Decision boundary')

    plt.xlabel('thickness (normalized)')
    plt.ylabel('height (normalized)')
    plt.legend(loc='lower right')
    plt.show()


# # (7 points) Implement gradient descent for logistic regression
# Now complete the code for ``gradient_descent`` in the file ``logistic_regression.py``, which runs gradient descent to find the best parameters ``theta``, and write code in the cell below to:
# 
# 1. Call ``gradient_descent`` to learn ``theta``
# 1. Print the final value of the cost function
# 1. Plot J_history to assess convergence
# 1. Tune the step size and number of iterations if needed until the algorithm converges and the decision boundary (see next cell) looks reasonable
# 1. Print the accuracy---the percentage of correctly classified examples in the training set

# In[133]:


w = np.zeros(n)

#
# YOUR CODE HERE
alpha = 0.1
iters = 100
w, J_history = gradient_descent(X,y,w,alpha,iters)
#
print('2. Final cost:',J_history[-1])

print('3. Cost history to assess convergence-')
plt.figure()
plt.plot(range(0,iters),J_history)
plt.xlabel("Time in epochs")
plt.ylabel("Cost")
plt.show()

# Plots data and decision boundary. If you have learned a good theta
# you will see a decision boundary that separates the data in a 
# reasonable way.
print('4.Decision boundary')
plot_model(X, y, w) 

print('Prediction on the training set with new theta -')
probability = logistic(X.dot(w))# 1/(1+np.exp(X.dot(w)))
predictions = [1 if x>= 0.5 else 0 for x in probability]
# confusion matrix 
y_actu = pd.Series(y, name='Actual')
y_pred = pd.Series(predictions, name='Predicted')
confusion_matrix = pd.crosstab(y_actu, y_pred)
print(confusion_matrix)
true_positive = confusion_matrix[0][0] 
true_negative = confusion_matrix[1][1] 

accuracy = 100* (true_positive+true_negative) / np.sum(np.matrix(confusion_matrix))
print('5. Accuracy| The percentage of correctly classified examples in the training set',accuracy,'%')


# In[ ]:




