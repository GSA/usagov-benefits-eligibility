import json
import os
import sys

localesPath = "./locales/en/"
mdPath = "./content/"

ignoreFiles = [
    ".DS_Store",
    "readme.md",
    "disclaimer.md",
    "criteria.csv",
    "landing-page.md",
]
files = os.listdir(mdPath)

allFiles = {"agencies": [], "benefits": [], "life-events": [], "types": []}

ignoreLines = [
    "criteriaKey",
    "disableGroupKey",
    "disableGroupWhen",
]

for file in files:
    if file in ignoreFiles:
        continue
    else:
        if "." not in file:
            moreFiles = os.listdir(os.path.join(mdPath, file))
            for moreFile in moreFiles:
                if moreFile in ignoreFiles:
                    continue
                else:
                    allFiles[file].append(
                        {"path": os.path.join(mdPath, file, moreFile)}
                    )
        else:
            allFiles[file] = {"path": os.path.join(mdPath, file)}

usedVariables = []
keys = list(allFiles.keys())
for fileOrDir in keys:
        for file in allFiles[fileOrDir]:
            filePath = file['path']
            title = filePath.replace('.md', '.json').replace('./content/', '')
            newLines = []
            jsonData = {}
            with open(filePath, 'r') as f:
                data = f.readlines()
                variableDelim = ''
                for line in data:
                    nline = line
                    if ':' in line:
                        if '  ' in line:
                            if '.' in variableDelim:
                                variableDelim = variableDelim.split('.')[0]
                            variableDelim += '.' + line.split(':')[0].strip().replace('-', '').replace(' ', '')
                        else:
                            variableDelim = line.split(':')[0].strip().replace('-', '').replace(' ', '')
                        nline = line.split(':')[1].strip()
                    if '---' in line or line == '\n':
                        newLines.append(line)
                    elif line.count('"') == 2:
                        if usedVariables.count(variableDelim) > 0:
                            variableDelim = variableDelim + str(usedVariables.count(variableDelim))
                        else:
                            usedVariables.append(variableDelim)
                        if '.' in variableDelim:
                            topLevel = variableDelim.split('.')[0]
                            nestedLevel = variableDelim.split('.')[1]
                            if jsonData.get(topLevel) is None:
                                jsonData[topLevel] = {}
                            else:
                                jsonData[topLevel][nestedLevel] = nline.replace('"', '').replace('[','').replace(']', '')
                        else:
                            jsonData[variableDelim] = nline.replace('"', '').replace('[','').replace(']','')
                        bline = line.split('"')[0] + variableDelim + line.split('"')[2]
                        newLines.append(bline)
                    else:
                        newLines.append(line)
                f.close()
            with open(os.path.join(localesPath, title), 'w') as f:
                f.write(json.dumps(jsonData, indent=4))     
                f.close()
            with open(filePath, 'w') as f:
                f.write(''.join(newLines))       
                f.close()   
# now that we have all the content files and their paths 
# we just need to find the information to put into the json files