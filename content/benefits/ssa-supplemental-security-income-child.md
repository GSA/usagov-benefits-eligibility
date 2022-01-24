---
title: "Child Supplemental Security Income"
headline: "Child Supplemental Security Income"
tags: 
- "financial assistance"
lifeEvents: 
- "disability"
- "loss-of-job-and-low-income"
source:
  name: "Social Security Administration"
  link: "https://www.ssa.gov/benefits/disability/apply-child.html"

summary: "Provides cash to older, blind, and disabled people to help meet basic needs for food, clothing, and shelter."

eligibility:
# In the order you want the criteria to display, list criteriaKeys from the csv here, each followed by a comma-separated list of which values indicate eligibility for that criteria. Wrap individual values in quotes if they have inner commas.
- criteriaKey: applicant_disability
  acceptableValues: [true]
- criteriaKey: applicant_date_of_birth
  label: "You are under 18 years old."
- criteriaKey: applicant_income
  acceptableValues: [true]
- criteriaKey: applicant_citizen_status
  acceptableValues: [true]

---