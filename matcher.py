# -*- coding: utf-8 -*-
"""
Created on Tue Aug  1 12:15:48 2017

@author: Elliott
"""

#!/usr/bin/env python

import sys
import json
from nltk.corpus import wordnet as wn

## GETTING INFO FROM TERMINAL (JSON)
## sys.argv is list where 1st item is path of this file, 2nd, 3rd,...,nth are passed in arguments
#for string in sys.argv:
#    print(string) # if(len(wn.synsets(mystring)) > 0)

def syns(mystring):
    a = wn.synsets(mystring)
    #print(a)
    if (len(a) > 0):
        return a[0]
    else:
        return wn.synsets("crepuscular")[0]

def compare(word1, word2):
    result = syns(word1).path_similarity(syns(word2))
    if (isinstance(result, float)):
        return result
    else:
     return .001

## INTERPRETING JSON FROM FILE
with open('data.json') as data_file:    
    data = json.load(data_file)


## EXAMPLE DATA
newdata = """
{
	"user": {
         "_id": "0001",
         "selfEntitySalience": {"ponies": 0.55, "rainbows": 0.36, "andrew": 0.10},
         "selfCategories": {"technology": 0.61, "news": 0.53, "animals": 0.22},
         "matchEntitySalience": {"iPhone": 0.62, "rich": 0.52, "hats": 0.21},
         "matchCategories": {"fashion": 0.67, "money": 0.57, "technology": 0.27}
    }, 
	"potentialMatches": [
    	{
        	 "_id": "0002",
	         "selfEntitySalience": {"ponies": 0.55, "rainbows": 0.36, "andrew": 0.10},
	         "selfCategories": {"technology": 0.61, "news": 0.53, "animals": 0.22},
	         "matchEntitySalience": {"iPhone": 0.62, "rich": 0.52, "hats": 0.21},
	         "matchCategories": {"fashion": 0.67, "money": 0.57, "technology": 0.27}
        },
        {
             "_id": "0003",
             "selfEntitySalience": {"ponies": 0.55, "rainbows": 0.36, "andrew": 0.10},
             "selfCategories": {"technology": 0.61, "news": 0.53, "animals": 0.22},
             "matchEntitySalience": {"iPhone": 0.62, "rich": 0.52, "hats": 0.21},
             "matchCategories": {"fashion": 0.67, "money": 0.57, "technology": 0.27}
        },
        {
             "_id": "0004",
             "selfEntitySalience": {"ponies": 0.55, "rainbows": 0.36, "andrew": 0.10},
             "selfCategories": {"technology": 0.61, "news": 0.53, "animals": 0.22},
             "matchEntitySalience": {"iPhone": 0.62, "rich": 0.52, "hats": 0.21},
             "matchCategories": {"fashion": 0.67, "money": 0.57, "technology": 0.27}
        }
	]
}

"""


import numpy
SCORE = numpy.zeros(len(data['potentialMatches'])) #array of scores, one for each potential match
myIDs = []                                           #all scores start at zero
bestMatches = []


for i in range(len(data['potentialMatches'])):
    ith_person = data['potentialMatches'][i] #ITERATING OVER OTHER PEOPLE IN DB
    myIDs.append(ith_person['_id'])
    highest = 0
    secondhighest = 0
    thirdhighest = 0
    bestkeywords = []
    for category_string in data['user']['selfCategories']: #for each category that this person has,
         #if that category is wanted by a person in the database,
        if category_string in ith_person['matchCategories']:
            x = data['user']['selfCategories'][category_string] * ith_person['matchCategories'][category_string]
            SCORE[i] += x
            if x >= highest:
                thirdhighest = secondhighest
                secondhighest = highest
                highest = x
                if (category_string not in bestkeywords):
                    bestkeywords.append(category_string)
            elif x >= secondhighest:
                thirdhighest = secondhighest
                secondhighest = x
                if (category_string not in bestkeywords):
                    bestkeywords.append(category_string)
            elif x >= thirdhighest:
                thirdhighest = x
                if (category_string not in bestkeywords):
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
    for category_string in data['user']['matchCategories']: #for each category that this person wants,
        if category_string in ith_person['selfCategories']:
            x =  data['user']['matchCategories'][category_string] * ith_person['selfCategories'][category_string] 
            SCORE[i] += x
            if x >= highest:
                thirdhighest = secondhighest
                secondhighest = highest
                highest = x
                if (category_string not in bestkeywords):
                    bestkeywords.append(category_string)
            elif x >= secondhighest:
                thirdhighest = secondhighest
                secondhighest = x
                if (category_string not in bestkeywords):
                    bestkeywords.append(category_string)
            elif x >= thirdhighest:
                thirdhighest = x
                if (category_string not in bestkeywords):
                    bestkeywords.append(category_string)
    for my_salience in data['user']['selfEntitySalience']: #for each category that this person wants,
        if(len(wn.synsets(my_salience)) is 0):
            if my_salience in ith_person['matchEntitySalience']:
                x = data['user']['selfEntitySalience'][my_salience] * ith_person['matchEntitySalience'][my_salience]
                SCORE[i] += x
                if x >= highest:
                    thirdhighest = secondhighest
                    secondhighest = highest
                    highest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
                elif x >= secondhighest:
                    thirdhighest = secondhighest
                    secondhighest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
                elif x >= thirdhighest:
                    thirdhighest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
        elif not (len(wn.synsets(my_salience)) is 0): 
             for my_salience2 in ith_person['matchEntitySalience']: #if that category is had by a person in the database,
                x = compare(my_salience, my_salience2) * data['user']['selfEntitySalience'][my_salience] * ith_person['matchEntitySalience'][my_salience2]
                SCORE[i] += x
                if x >= highest:
                    thirdhighest = secondhighest
                    secondhighest = highest
                    highest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
                elif x >= secondhighest:
                    thirdhighest = secondhighest
                    secondhighest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
                elif x >= thirdhighest:
                    thirdhighest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
    for my_salience in data['user']['matchEntitySalience']: #for each category that this person wants,
        if (len(wn.synsets(my_salience)) is 0):
            if my_salience in ith_person['selfEntitySalience']:
                x = data['user']['matchEntitySalience'][my_salience] * ith_person['selfEntitySalience'][my_salience]
                if x >= highest:
                    thirdhighest = secondhighest
                    secondhighest = highest
                    highest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
                elif x >= secondhighest:
                    thirdhighest = secondhighest
                    secondhighest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
                elif x >= thirdhighest:
                    thirdhighest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
        elif not (len(wn.synsets(my_salience)) is 0):
            for my_salience2 in ith_person['selfEntitySalience']: #if that category is had by a person in the database,
                x = compare(my_salience, my_salience2) * data['user']['matchEntitySalience'][my_salience] * ith_person['selfEntitySalience'][my_salience2]
                SCORE[i] += x
                if x >= highest:
                    thirdhighest = secondhighest
                    secondhighest = highest
                    highest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
                elif x >= secondhighest:
                    thirdhighest = secondhighest
                    secondhighest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
                elif x >= thirdhighest:
                    thirdhighest = x
                    if (my_salience not in bestkeywords):
                        bestkeywords.append(my_salience)
    #for keyword in bestkeywords:
    #    print(keyword)
    if len(bestkeywords) > 2:
        bestMatches.append([bestkeywords[-1],bestkeywords[-2],bestkeywords[-3]])
    elif len(bestkeywords) > 1:
        bestMatches.append([bestkeywords[-1],bestkeywords[-2]])
    elif len(bestkeywords) > 0:
        bestMatches.append([bestkeywords[-1]])

myDict = dict(zip(myIDs, SCORE))



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
    myDict[key] = point5Round(10 * (myDict[key] * 1) ** (.5))
    if myDict[key] > 10:
        myDict[key] = 10.0
    Matrix[rownum][0] = key
    Matrix[rownum][1] = myDict[key]
    if (len(bestMatches) > rownum):
        Matrix[rownum][2] = bestMatches[rownum]
    rownum += 1

"""
Matrix looks like:
[['0001', 9, {'money','fun','tech'}]
[]
[]
]
"""

def sort2DArray(TwoDArray):
    res = sorted(TwoDArray, key=lambda x: -x[1])
    return res

print(json.dumps(sort2DArray(Matrix)))



"""
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
# print(realString)
#print(stringRes)
"""