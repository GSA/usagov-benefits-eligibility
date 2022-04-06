---
# yaml front matter here
title: "Military service"
summary: "Service members and veterans have many benefits available to them, including educational assistance, home loans, and life insurance."
lede: ""
secondaryHeadline: "Military service benefits"

eligibilityCriteriaDescription: "Please check the boxes and select the options that best describe your situation. Answer as many questions as possible for the most accurate results."

topLevelFilter:
  - label: "Start here"
    criteriaKey:
      - applicant_served_in_active_military
    disableGroupKey: applicant
    disableGroupWhen: ["not applicable"]

  - label: ""
    criteriaKey:
      - deceased_served_in_active_military
    disableGroupKey: military
    disableGroupWhen: ["not applicable"]

eligibilityCriteria:
  - label: "About you (the person applying for benefits)"
    description: ""
    criteriaGroupKey: applicant
    criteriaKeys:
      - applicant_served_in_active_military
      - applicant_disability
      - applicant_marital_status

  - label: "Did you lose a loved one who served in military?"
    description: ""
    criteriaGroupKey: military
    criteriaKeys:
      - applicant_relationship
      - deceased_served_in_active_military
      - deceased_buried_in_unmarked_grave
      - deceased_headstone_is_privately_purchased
      - deceased_buried_in_private_cemetery
---
