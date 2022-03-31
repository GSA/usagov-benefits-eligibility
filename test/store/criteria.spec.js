import { state, mutations, getters, actions } from "@/store/criteria"

const mockCriteria = () => [
  {
    criteriaKey: "deceased_death_circumstance",
    criteriaKeyHash: "acbca85",
    label: "One of the following circumstances apply to the deceased",
    type: "select",
    values:
      "died as a result of a service-connected disability; died while receiving or traveling to receive VA care; died while eligible, pending to receive, or receiving VA compensation or pension",
  },
  {
    criteriaKey: "applicant_relationship",
    criteriaKeyHash: "8f306c9",
    label: "Your (applicant's) relationship to the deceased is",
    type: "select",
    values: "spouse; child; other family member; personal or official representative",
  },
]

describe("criteria", () => {
  describe("mutations", () => {
    it("should preloaded responses", () => {
      const storeState = state()
      const criteria = mockCriteria()

      mutations.populateCriterion(storeState, {
        criterionArray: criteria,
      })
      mutations.preloadedResponses(storeState, {
        valueArray: [
          { response: true, criteriaKeyHash: criteria[0].criteriaKeyHash },
          { response: "spouse", criteriaKeyHash: criteria[1].criteriaKeyHash },
        ],
      })
      expect(storeState.eligibilityCriteria[criteria[0].criteriaKey].response).toBe(true)
      expect(storeState.eligibilityCriteria[criteria[1].criteriaKey].response).toBe("spouse")
    })
    it("should clear all responses", () => {
      const storeState = state()
      const criteria = mockCriteria()

      mutations.populateCriterion(storeState, {
        criterionArray: criteria,
      })

      expect(storeState.eligibilityCriteria[criteria[0].criteriaKey].response).toBe(null)
      expect(storeState.eligibilityCriteria[criteria[1].criteriaKey].response).toBe(null)

      storeState.eligibilityCriteria[criteria[0].criteriaKey].response = true
      storeState.eligibilityCriteria[criteria[1].criteriaKey].response = true

      mutations.clearSelectedCriteria(storeState, {})

      expect(storeState.eligibilityCriteria[criteria[0].criteriaKey].response).toBe(null)
      expect(storeState.eligibilityCriteria[criteria[1].criteriaKey].response).toBe(null)
      expect(localStorage.getItem("responseData")).toBe("{}")
    })
    it("should responses not preloaded are null", () => {
      const storeState = state()
      const criteria = mockCriteria()

      mutations.populateCriterion(storeState, {
        criterionArray: criteria,
      })
      mutations.preloadedResponses(storeState, {
        valueArray: [{ response: true, criteriaKeyHash: criteria[0].criteriaKeyHash }],
      })
      expect(storeState.eligibilityCriteria[criteria[0].criteriaKey].response).toBe(true)
      expect(storeState.eligibilityCriteria[criteria[1].criteriaKey].response).toBe(null)
    })
    it("should populate criterion", () => {
      const storeState = state()
      const criterion = mockCriteria()
      mutations.populateCriterion(storeState, {
        criterionArray: criterion,
      })

      expect(storeState.eligibilityCriteria[criterion[0].criteriaKey]).toBeDefined()
      expect(storeState.hashToCriteria[criterion[0].criteriaKeyHash]).toBeDefined()
    })
  })
  describe("actions", () => {
    beforeEach(() => {
      process.client = true
      const { Crypto } = require("@peculiar/webcrypto")
      window.crypto = new Crypto()
      localStorage.removeItem("responseData")

      const { TextEncoder } = require("util")
      global.TextEncoder = TextEncoder
    })
    afterEach(() => {
      process.client = false
      localStorage.removeItem("responseData")
    })

    it("should populate eligibility criteria", async () => {
      state()

      const commit = jest.fn()
      await actions.populate({ commit, state }, mockCriteria())
      expect(commit.mock.calls.length).toBe(1)
      expect(commit.mock.calls[0][0]).toBe("populateCriterion")
      expect(commit.mock.calls[0][1].criterionArray.length).toBe(mockCriteria().length)
    })

    it("should call clear commit", async () => {
      state()
      const commit = jest.fn()
      await actions.clear({ commit, state }, mockCriteria())
      expect(commit.mock.calls.length).toBe(1)
      expect(commit.mock.calls[0][0]).toBe("clearSelectedCriteria")
    })

    it("should call updateResponse commit", async () => {
      state()
      const commit = jest.fn()
      await actions.updateResponse({ commit }, { criteriaKey: "applicant_eligible_senior", response: true })
      expect(commit.mock.calls.length).toBe(1)
      expect(commit.mock.calls[0][0]).toBe("updateResponse")
    })
  })
  describe("getters", () => {
    it("should return an error when criteriaKey doesn't exist", () => {
      const storeState = state()
      const ret = getters.getCriterionByEligibilityKey(storeState)("bad_key")
      expect(ret.key).toMatch(/error-missing-key--/)
    })
    describe("getTotalEligibleCriteria", () => {
      it("should return 0 when there are no criteria", () => {
        const storeState = state()
        const ret = getters.getTotalEligibleCriteria(storeState, getters)()
        expect(ret).toBe(0)
      })
    })
    describe("getTotalIneligibleCriteria", () => {
      it("should return 0 when there are no criteria", () => {
        const storeState = state()
        const ret = getters.getTotalIneligibleCriteria(storeState, getters)()
        expect(ret).toBe(0)
      })
    })
    describe("doesCriterionMatchSelection", () => {
      it("should return false when acceptable critieria is invalid", async () => {
        const storeState = state()
        const criterion = {
          criteriaKey: "applicant_eligible_senior",
          criteriaKeyHash: "9e63db02",
          type: "date",
          acceptableValues: ["=10-10-2020"],
          response: "02-25-2021",
          TEST: true,
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionMatchSelection(storeState, getters)(criterion)
        expect(ret).toBe(false)
      })
    })

    describe("doesCriterionDateMatch", () => {
      it("should return false when acceptable critieria is invalid", async () => {
        const storeState = state()
        const criterion = {
          criteriaKey: "applicant_eligible_senior",
          criteriaKeyHash: "9e63db02",
          type: "date",
          acceptableValues: ["=10-10-2020"],
          response: "02-25-2021",
          TEST: true,
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionDateMatch(storeState, getters)(criterion)
        expect(ret).toBe(false)
      })
      it("should return false when acceptable critieria is not met", async () => {
        const storeState = state()
        const criterion = {
          criteriaKey: "applicant_eligible_senior",
          criteriaKeyHash: "9e63db02",
          acceptableValues: ["10-10-2020"],
          response: "02-25-2021",
          TEST: true,
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionMatchSelection(storeState, getters)(criterion)
        expect(ret).toBe(false)
      })
      it("should return null when there are no acceptable values", async () => {
        const storeState = state()
        const criterion = {
          criteriaKey: "applicant_eligible_senior",
          criteriaKeyHash: "9e63db02",
          response: "02-25-2021",
          TEST: true,
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionMatchSelection(storeState, getters)(criterion)
        expect(ret).toBe(null)
      })
    })
  })
})
