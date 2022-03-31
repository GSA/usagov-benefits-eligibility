# Content Folder

1. Date Criteria

- In order to use the date input logic correctly a content manager must put the key and acceptance values in with accordance to our encoding
  - We have several options for inputting a date
  - First we put it the comparator into the criteria (no parathensis)
- (> / < / =)
  - Will check the users date against the given date using the specified comparator
  - Next we will put in the date (no parathensis)
  - (>11-14-1999)
  - Needs to follow this patteren (>MM-DD-YYYY)
  - For putting in a dynamically calculated date (i.e. the user has to be older than 60 years)
  - We can do this by following a similar pattern (no parathensis)
  - (>60years)
  - The pattern is the operator then an amount of time then a determiner (months, days, years)
  - You are also able to put in multiple dates / encodings to create a range∂
  - i.e. You wish to only have a user be elgible if they are older than 40 years and less than 60 years
  - acceptanceValues: ["<60years", ">40years"]
