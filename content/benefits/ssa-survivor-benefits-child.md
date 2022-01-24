---
title: "Surviving Child Benefits"
headline: "Surviving Child Benefits"
tags: 
- "financial assistance"
lifeEvents: 
- "death-and-burial"
source:
  name: "Social Security Administration"
  link: "https://www.ssa.gov/forms/ssa-4.html"

summary: "Social Security survivors benefits are paid to a child, stepchild, grandchild, or adopted child of eligible workers."

eligibility:
# In the order you want the criteria to display, list criteriaKeys from the csv here, each followed by a comma-separated list of which values indicate eligibility for that criteria. Wrap individual values in quotes if they have inner commas.
- criteriaKey: deceased_paid_into_SS
  acceptableValues: [true]
- criteriaKey: applicant_relationship
  acceptableValues: [child]
- criteriaKey: applicant_date_of_birth
  label: "You are under 18 years old (under 19 years old if you are a full-time student in an elementary or secondary school)."
- criteriaKey: applicant_marital_status
  acceptableValues: [unmarried]
- criteriaKey: applicant_citizen_status
  acceptableValues: [true]
  
---