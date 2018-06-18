# faceMe - A Facial Recognition App To Find Missing and/or Wanted Persons

### Overview

This app's intention is for users to upload photographs to see if there is a match on the FBI Missing and/or Wanted Persons Website. It will provide the top 5 best matches along with their confidence scores.

TO DO: Add screenshot

### Stack

Javascript, React, Node, Express, PostgreSQL, Amazon S3, face++ API, Fine Uploader for file uploads, Heroku Scheduler

This app utilizes [face++](https://www.faceplusplus.com/) facial detection and search API. In the future, I hope to implement my own alogrithm and model; however, that is currently deemed too time intensive with data collection, normalization, classification, and training a personal model.

With face++'s 1 QPS (query per second) constraint, a [Heroku scheduler](https://elements.heroku.com/addons/scheduler), is scheduled to pull in fresh FBI Missing and Wanted Persons data into the PostgreSQL database every 12 hours.

### Model

TO DO: once model is finalized

### Installation

To DO: once project is complete
