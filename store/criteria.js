import Vue from "vue"
import validateLocation from "~/services/locationHelper"
import stringToHash from "../services/stringToHash"
import validateDateAgainstAcceptance from "~/services/dateHelper"

export const state = () => ({
  eligibilityCriteria: {},
  hashToCriteria: {},
})

export const mutations = {
  // payload must include a criteriaKey and the new response / selected value
  updateResponse(theState, { criteriaKey, response }) {
    // TODO: make sure the response matches one of the available criterion values
    Vue.set(theState.eligibilityCriteria[criteriaKey], "response", response)
    const hashedData = getters.getHashResponses(theState)
    localStorage.setItem("responseData", JSON.stringify(hashedData))
  },

  preloadedResponses(theState, { valueArray }) {
    for (const param of valueArray) {
      const criteriaKey = theState.hashToCriteria[param.criteriaKeyHash]
      if (theState.eligibilityCriteria[criteriaKey] != null) {
        Vue.set(theState.eligibilityCriteria[criteriaKey], "response", param.response)
      }
    }

    const hashedData = getters.getHashResponses(theState)
    localStorage.setItem("responseData", JSON.stringify(hashedData))
  },

  populateCriterion(theState, { criterionArray }) {
    let storedData = {}

    if (process.client && localStorage.getItem("responseData")) {
      storedData = JSON.parse(localStorage.getItem("responseData"))
    }

    for (const criterion of criterionArray) {
      const criteriaKey = criterion.criteriaKey
      criterion.response = storedData[criterion.criteriaKeyHash] ? storedData[criterion.criteriaKeyHash] : null
      Vue.set(theState.eligibilityCriteria, criteriaKey, criterion)
      Vue.set(theState.hashToCriteria, criterion.criteriaKeyHash, criteriaKey)
    }
  },

  clearSelectedCriteria(theState) {
    for (const criteriaKey in theState.eligibilityCriteria) {
      Vue.set(theState.eligibilityCriteria[criteriaKey], "response", null)
    }
    localStorage.setItem("responseData", JSON.stringify({}))
  },
}

export const getters = {
  /**
   * Function that checks the acceptable criteria date encoding and translates
   * it to something that the js engine can parse / check
   *
   * Use Cases                                      | Required encoding (acceptable value(s))
   * - user must be born on MM/DD/YYYY (11/14/1999) | =11-14-1999
   * - user older than 60 years  (Y, M, D)          | >60Y
   * - criteria before MM/DD/YYYY (01/01/2022)      | <01-01-2022
   * - born during YYYY-YYYYY (1990-2000)           | >01-01-1990 , <01-01-2000
   * - same use case as above (but with age range)  | >60Y, <40Y
   * @param {currentState} state
   * @param {storeGetters} getter
   * @returns null / true / false [empty, pass, fail]
   */
  doesCriterionDateMatch: (theState, theGetters) => (criterion) => {
    if (!theGetters.isCriterionSelected(criterion) || !criterion.acceptableValues) {
      return null
    }
    // catch for invalid criteria key that haven't been moved to dates
    if (
      criterion.acceptableValues.some((val) => {
        return ["true", "false"].includes(val.toString())
      })
    ) {
      return null
    }
    // need this to be swapped if passing in a state I.E. testing
    const userInputDate = criterion.TEST
      ? Date.parse(theGetters.getResponseByEligibilityKey(theState)(criterion.criteriaKey))
      : Date.parse(theGetters.getResponseByEligibilityKey(criterion.criteriaKey))
    return validateDateAgainstAcceptance({
      criterion,
      userInputDate,
    })
  },
  doesCriterionMatchSelection: (theState, theGetters) => (criterion) => {
    if (!theGetters.isCriterionSelected(criterion)) {
      return null
    }

    if (theGetters.getCriterionByEligibilityKey(criterion.criteriaKey).type === "date") {
      return criterion.TEST
        ? theGetters.doesCriterionDateMatch(theState)(criterion)
        : theGetters.doesCriterionDateMatch(criterion)
    } else {
      if (!criterion.acceptableValues) {
        return null
      }
      return !!criterion.acceptableValues.find(
        (val) => val === theGetters.getCriterionByEligibilityKey(criterion.criteriaKey).response
      )
    }
  },
  getCriterionByEligibilityKey: (theState) => (criteriaKey) => {
    return (
      theState.eligibilityCriteria[criteriaKey] || {
        key: `error-missing-key--${criteriaKey}`,
        label: `Key named "${criteriaKey}" not found`,
        values: "",
        type: "missing",
      }
    )
  },
  getResponseByEligibilityKey: (theState) => (criteriaKey) => {
    return (
      theState.eligibilityCriteria[criteriaKey].response || {
        key: `error-missing-key--${criteriaKey}`,
        label: `Key named "${criteriaKey}" not found`,
        values: "",
        type: "missing",
      }
    )
  },
  getHashResponses: (theState) => {
    const responses = {}
    for (const criteriaKey in theState.eligibilityCriteria) {
      const criteria = theState.eligibilityCriteria[criteriaKey]
      if (criteria && criteria.response) {
        responses[criteria.criteriaKeyHash] = criteria.response
      }
    }
    return responses
  },
  getTotalEligibleCriteria:
    (theState, theGetters) =>
    (benefitEligibilityCriteria = []) => {
      if (benefitEligibilityCriteria && benefitEligibilityCriteria.length < 1) {
        return 0
      } else {
        const matchingCriteria = benefitEligibilityCriteria.filter((criterion) =>
          theGetters.doesCriterionMatchSelection(criterion)
        )
        return matchingCriteria.length
      }
    },
  getTotalIneligibleCriteria:
    (theState, theGetters) =>
    (benefitEligibilityCriteria = []) => {
      if (benefitEligibilityCriteria && benefitEligibilityCriteria.length < 1) {
        return 0
      } else {
        const matchingCriteria = benefitEligibilityCriteria.filter(
          (criterion) => theGetters.doesCriterionMatchSelection(criterion) === false
        )
        return matchingCriteria.length
      }
    },
  isCriterionSelected: (theState, theGetters) => (criterion) => {
    return !!theGetters.getCriterionByEligibilityKey(criterion.criteriaKey).response
  },
}

export const actions = {
  async populate({ commit, theState }, criteriaArray = []) {
    for (const criterion of criteriaArray) {
      const criteriaKey = criterion.criteriaKey
      criterion.criteriaKeyHash = await stringToHash(criteriaKey)
    }
    commit("populateCriterion", { criterionArray: criteriaArray })
  },

  clear({ commit, theState }, criteriaArray = []) {
    commit("clearSelectedCriteria", {})
  },

  updateResponse({ commit }, { criteriaKey, response }) {
    commit("updateResponse", { criteriaKey, response })
  },
}
