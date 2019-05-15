# Github Api
Fetches issues for the provided github repo url

## Note 
* Github api has rate-limiting i.e. it allows up to 60 requests per hour.
* Hence, if the issues don't show up, connect to other WIFI, or else wait for hour.

## User Guide

* Open : https://github-scrapper.herokuapp.com/
* Paste any public github repo url... e.g. https://github.com/iarthstar/purescript-sketch
* Click SCRAPE... It fetches the issues of the provide repo

## How it works

1. Frontend validates the Repo URL using regex.
2. Backend fetches the issues page of provided repo.
    1. fetches the info of repo i.e. issues are present or not
    2. iterates over the pagination if more issue pages are present.
    3. Sends required Object back to Frontend.
3. Frontend displays it.


## Development Guide

Initial setup

```bash
$ npm i
```

Run Project

```bash
$ npm start
```

To watch for changes

```bash
$ nodemon
```

## How the project can be improved

* Suggesting Repos as you type in text-field
* Handling edge cases of repository not found
* Advanced filtering of Issues using tags, time period, author, etc.
* Memoize the issues by storing them in database i.e. by comparing the issues of first page...