# -*- coding: utf-8 -*-
"""
Created on Tue Aug  1 12:15:48 2017

@author: Elliott
"""

#!/usr/bin/env python

import sys
import json
from pprint import pprint

## GETTING INFO FROM TERMINAL (JSON)
## sys.argv is list where 1st item is path of this file, 2nd, 3rd,...,nth are passed in arguments
#for string in sys.argv:
#    print(string)


## INTERPRETING JSON FROM FILE
with open('data.json') as data_file:    
    data = json.load(data_file)


## EXAMPLE DATA
newdata = """
{
	"user": {
         "userID": "0001",
         "my-salience-score": {"ponies": 0.55, "rainbows": 0.36, "andrew": 0.10},
         "my-categories": {"technology": 0.61, "news": 0.53, "animals": 0.22},
         "wanted-salience-score": {"iPhone": 0.62, "rich": 0.52, "hats": 0.21},
         "wanted-categories": {"fashion": 0.67, "money": 0.57, "technology": 0.27}
    }, 
	"potential matches": [
    	{
        	 "userID": "0002",
	         "my-salience-score": {"ponies": 0.55, "rainbows": 0.36, "andrew": 0.10},
	         "my-categories": {"technology": 0.61, "news": 0.53, "animals": 0.22},
	         "wanted-salience-score": {"iPhone": 0.62, "rich": 0.52, "hats": 0.21},
	         "wanted-categories": {"fashion": 0.67, "money": 0.57, "technology": 0.27}
        },
        {
             "userID": "0003",
             "my-salience-score": {"ponies": 0.55, "rainbows": 0.36, "andrew": 0.10},
             "my-categories": {"technology": 0.61, "news": 0.53, "animals": 0.22},
             "wanted-salience-score": {"iPhone": 0.62, "rich": 0.52, "hats": 0.21},
             "wanted-categories": {"fashion": 0.67, "money": 0.57, "technology": 0.27}
        },
        {
             "userID": "0004",
             "my-salience-score": {"ponies": 0.55, "rainbows": 0.36, "andrew": 0.10},
             "my-categories": {"technology": 0.61, "news": 0.53, "animals": 0.22},
             "wanted-salience-score": {"iPhone": 0.62, "rich": 0.52, "hats": 0.21},
             "wanted-categories": {"fashion": 0.67, "money": 0.57, "technology": 0.27}
        }
	]
}

"""

#for i in data:
#    pprint(i)
#    print("")
#print("data[user] is") 
#pprint(data['user'])
#print("data[potential matches][0][my-categories][animals] is") 
#pprint(data['potential matches'][1]['my-categories']['animals'])

import numpy
SCORE = numpy.zeros(len(data['potential matches'])) #array of scores, one for each potential match
myIDs = []                                           #all scores start at zero
bestMatches = []
"""
def usefulFunc1(dict1, dict2, string):
    for i in dict1:
        for a in dict2:
            dict1[i] = dict2[a]
            dict1[string] = dict1.pop(i)

def usefulFunc2(dict2, dict3, string):
    for i in dict2:
            for a in dict3:
                dict1[i] = dict2[a]
                dict1[string] = dict1.pop(i)


def usefulFunc3(dic3, val, string):
    for i in dic1:
        dic1[i] = val
        dict1[string] = dict1.pop(i)

def usefulFunc4(dict1, dict2, dict3, string, val):
    usefulFunc1(dict1, dict2, string)
    usefulFunc2(dict2, dict3, string)
    usefulFunc3(dic3, val, string)
"""
for i in range(len(data['potential matches'])):
    ith_person = data['potential matches'][i] #ITERATING OVER OTHER PEOPLE IN DB
    myIDs.append(ith_person['userID'])
    highest = 0
    secondhighest = 0
    thirdhighest = 0
    bestkeywords = []
    for category_string in data['user']['my-categories']: #for each category that this person has,
        if category_string in ith_person['wanted-categories']: #if that category is wanted by a person in the database,
            x = data['user']['my-categories'][category_string] * ith_person['wanted-categories'][category_string]
            SCORE[i] += x
            if x >= highest:
                thirdhighest = secondhighest
                secondhighest = highest
                highest = x
                bestkeywords.append(category_string)
            elif x >= secondhighest:
                thirdhighest = secondhighest
                secondhighest = x
                bestkeywords.append(category_string)
            elif x >= thirdhighest:
                thirdhighest = x
                bestkeywords.append(category_string)
            """
            if x > highest:
                usefulFunc1(thirdhighest, secondhighest, string)
                usefulFunc2(secondhighest, dict3, string)
                usefulFunc3(dic3, val, string
            elif x > secondhighest:
                usefulFunc2(thirdhighest, secondhighest, category_string)
                usefulFunc3(secondhighest , x)
            elif x > thirdhighest:
                thirdhighest = x
                """
    for category_string in data['user']['wanted-categories']: #for each category that this person wants,
        if category_string in ith_person['my-categories']: #if that category is had by a person in the database,
            x = data['user']['wanted-categories'][category_string] * ith_person['my-categories'][category_string] 
            SCORE[i] += x
            if x >= highest:
                thirdhighest = secondhighest
                secondhighest = highest
                highest = x
                bestkeywords.append(category_string)
            elif x >= secondhighest:
                thirdhighest = secondhighest
                secondhighest = x
                bestkeywords.append(category_string)
            elif x >= thirdhighest:
                thirdhighest = x
                bestkeywords.append(category_string)
    for my_salience in data['user']['my-salience-score']: #for each category that this person wants,
        if my_salience in ith_person['wanted-salience-score']: #if that category is had by a person in the database,
            x = data['user']['my-salience-score'][my_salience] * ith_person['wanted-salience-score'][my_salience]
            SCORE[i] += x
            if x >= highest:
                thirdhighest = secondhighest
                secondhighest = highest
                highest = x
                bestkeywords.append(my_salience)
            elif x >= secondhighest:
                thirdhighest = secondhighest
                secondhighest = x
                bestkeywords.append(my_salience)
            elif x >= thirdhighest:
                thirdhighest = x
                bestkeywords.append(my_salience)
    for my_salience in data['user']['wanted-salience-score']: #for each category that this person wants,
        if my_salience in ith_person['my-salience-score']: #if that category is had by a person in the database,
            x = data['user']['my-salience-score'][my_salience] * ith_person['wanted-salience-score'][my_salience]
            SCORE[i] += x
            if x >= highest:
                thirdhighest = secondhighest
                secondhighest = highest
                highest = x
                bestkeywords.append(my_salience)
            elif x >= secondhighest:
                thirdhighest = secondhighest
                secondhighest = x
                bestkeywords.append(my_salience)
            elif x >= thirdhighest:
                thirdhighest = x
                bestkeywords.append(my_salience)
    #for keyword in bestkeywords:
    #    print(keyword)
    if len(bestkeywords) > 2:
        bestMatches.append({bestkeywords[-1],bestkeywords[-2],bestkeywords[-3]})
    elif len(bestkeywords) > 1:
        bestMatches.append({bestkeywords[-1],bestkeywords[-2]})
    elif len(bestkeywords) > 0:
        bestMatches.append({bestkeywords[-1]})

myDict = dict(zip(myIDs, SCORE))

#for matchtuple in bestMatches:
#    print(matchtuple)


def point5Round(afloat):
    if afloat % 1 < .25:
        #print(str(afloat) + " goes to " + str(afloat - afloat % 1))
        return afloat - afloat % 1
    elif afloat % 1 < .5:
        #print(str(afloat) + " goes to " + str(afloat + (.5 - afloat % 1)))
        return afloat + (.5 - afloat % 1)
    elif afloat % 1 < .75:
        #print(str(afloat) + " goes to " + str(afloat - afloat % .5))
        return afloat - afloat % .5
    elif afloat % 1 > .75:
        #print(str(afloat) + " goes to " + str(afloat + (1 - afloat % 1)))
        return afloat + (1 - afloat % 1)



Matrix = [[0 for x in range(3)] for y in range(len(myDict))]


#Normalization of data:
rownum = 0
for key in myDict:
#    print(key + ":" + str(myDict[key]))
    myDict[key] = point5Round(10 * (myDict[key] * .5) ** (1))
    if myDict[key] > 10:
        myDict[key] = 10.0
    Matrix[rownum][0] = key.encode('utf-8')
    Matrix[rownum][1] = myDict[key]
    Matrix[rownum][2] = bestMatches[rownum]
    rownum += 1

"""
Matrix looks like:
[['0001', 9, {'money','fun','tech'}]
[]
[]
]
"""

"""
def swapDict(dictionary):
    values = []
    keys = []
    for key in dictionary:
        keys.append(key)
        values.append(dictionary[key])
    return dict(zip(values,keys))

#Sorting of results
RESULT = sorted(swapDict(myDict).items())[::-1]
"""


def sort2DArray(TwoDArray):
    res = sorted(TwoDArray, key=lambda x: x[1])
    return res

stringRes = (str(sort2DArray(Matrix)))
realString = ""
for char in stringRes:
    if char == '(':
        realString += '['
    elif char == ')':
        realString += ']'
    else:
        realString += char

#print(" ")
#print("HERE IS THE RESULT:")
print(realString)
