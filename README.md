# Github Scrapper 
Scrapes issues for the provided github repo url

## User Guide

* Open : https://github-scrapper.herokuapp.com/
* paste any public github repo url... e.g. https://github.com/iarthstar/purescript-sketch
* It fetches the issues of the provide repo

## How it works

1. Frontend validates the Repo URL using regex.
2. Backend fetches the issues page of provided repo.
    1. parses the issues on the first page.
    2. iterates over the pagination if more issue pages are present.
3. Sends the Issues Array back to Frontend.
4. Frontend transforms the data as per requirement and display it.


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

## How the scrapper can be improved

* Suggesting Repos as you type in text-field
* Handling edge cases of repository not found
* Advanced filtering of Issues using tags, time period, author, etc.
* Memoize the issues by storing them in database i.e. by comparing the issues of first page...