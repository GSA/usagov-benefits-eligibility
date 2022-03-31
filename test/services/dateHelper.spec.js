import validateDateAgainstAcceptance from "~/services/dateHelper"

function getTestDateString(daysOffsetFromToday) {
  const testDte = new Date()
  testDte.setDate(testDte.getDate() + daysOffsetFromToday)
  const testDate = testDte.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })
  return testDate.replaceAll("/", "-")
}

describe("dateHelper", () => {
  it("should return false when acceptable critieria is invalid", async () => {
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
      criteriaKeyHash: "9e63db02",
      type: "date",
      acceptableValues: ["=10-10-2020"],
      response: "02-25-2021",
      TEST: true,
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(false)
  })
  it("should return false when criteria is not met", async () => {
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
      criteriaKeyHash: "9e63db02",
      type: "date",
      acceptableValues: ["<60years", ">40years"],
      response: "11-14-1900",
      TEST: true,
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(false)
  })
  it("should return true when criteria is passed (dynamic years)", async () => {
    const testDate = getTestDateString(-(365 * 50))
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
      criteriaKeyHash: "9e63db02",
      type: "date",
      acceptableValues: ["<60years", ">40years"],
      response: testDate,
      TEST: true,
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(true)
  })
  it("should return true when criteria is passed (fixed years)", async () => {
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
      criteriaKeyHash: "9e63db02",
      type: "date",
      acceptableValues: ["<01-01-1982", ">01-01-1962"],
      response: "11-14-1975",
      TEST: true,
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(true)
  })
  it("should return null when not selected", () => {
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(null)
  })
  it("should return null when not complete", async () => {
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
      criteriaKeyHash: "9e63db02",
      type: "date",
      acceptableValues: ["!01-01-1982"],
      response: "11-1",
      TEST: true,
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(null)
  })
  it("should return true when criteria is passed (same date)", async () => {
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
      criteriaKeyHash: "9e63db02",
      type: "date",
      acceptableValues: ["=11-14-1999"],
      response: "11-14-1999",
      TEST: true,
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(true)
  })
  it("should return true when criteria is passed (dynamic months)", async () => {
    const testDate = getTestDateString(-150)
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
      criteriaKeyHash: "9e63db02",
      type: "date",
      acceptableValues: ["<6months", ">4months"],
      response: testDate,
      TEST: true,
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(true)
  })
  it("should return true when criteria is passed (dynamic days)", async () => {
    const testDate = getTestDateString(-29)
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
      criteriaKeyHash: "9e63db02",
      type: "date",
      acceptableValues: ["<30days", ">1days"],
      response: testDate,
      TEST: true,
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(true)
  })

  it("should call the correct function when a date", async () => {
    const criterion = {
      criteriaKey: "applicant_eligible_senior",
      criteriaKeyHash: "9e63db02",
      type: "date",
      acceptableValues: ["<30days", ">1days"],
      response: "02-25-2021",
      TEST: true,
    }
    const ret = validateDateAgainstAcceptance({
      criterion,
      userInputDate: Date.parse(criterion.response),
    })
    expect(ret).toBe(false)
  })
})
