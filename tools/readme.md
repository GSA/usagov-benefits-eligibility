# Python i18n tools
(Mainly readme for devs)  
In this directory there are three python scripts to help with the i18n flow of bears. (For the future could be used to allow content managers to not have to change the way that they put in content files, i.e. could incorporate the logic of each of the python scripts into the build process)
## How to run
Python 3 required.
(again these were created initally for a one time use but are being left to save the logic)

`in root directory`  
`python3 tools/createCriteriaJson.py`  
`python3 tools/createJson.py`  
`python3 tools/createEnEsJs.py`

<small>
(slight bug: go into the `locales/es.js` and find the line containing `require('es/en.json')` and replace it with `require('es/es.json')`)
</small>  
<br>
<br>

## `createCriteriaJson.py`

- Converts the unchanged `criteria.csv` to a json file as well as rewriting the `criteria.csv` file to follow a dotted notation.

## `createEnEsJs.py`

- Reads through the `locales/en` and `locales/es` directory and compiles the `en.js` and `es.js` files that are required for nuxt internationalization.

## `createJson.py`

- Reads through the `content` directory and all subdirectories and reads the nessecary variables that need to be translated and pulls them into a corresponding `json` file for that `markdown` file and then writes that json to a file and then rewrites the markdown file to follow a dotted notation.
