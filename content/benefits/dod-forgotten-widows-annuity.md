---
title: "Annuity for Certain Military Surviving Spouses"
headline: "Annuity for Certain Military Surviving Spouses"
tags:
  - "financial assistance"
lifeEvents:
  - "death-and-burial"
  - "military-service"
source:
  name: "Department of Defense"
  link: https://militarypay.defense.gov/Portals/3/Documents/acmss.pdf

summary: "Commonly referred to as the Annuity for Forgotten Widows, qualified surviving spouses of members of the Uniformed Services may be eligible for financial support."

eligibility:
  # In the order you want the criteria to display, list criteriaKeys from the csv here, each followed by a comma-separated list of which values indicate eligibility for that criteria. Wrap individual values in quotes if they have inner commas.
  - criteriaKey: deceased_date_of_death
    acceptableValues: [<01-01-1978]
  - criteriaKey: deceased_served_in_active_military
    acceptableValues: ["had retired from the service"]
  - criteriaKey: applicant_relationship
    acceptableValues: [spouse]
---
