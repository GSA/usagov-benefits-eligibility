import { toDate, isEqual, isBefore, isAfter, sub } from "date-fns"

function validateDateAgainstAcceptance({ criterion, userInputDate }) {
  const DETERMINERS = ["months", "days", "years"]
  let determiner = null
  let checkResult = null
  // need to check the date
  for (const index in criterion.acceptableValues) {
    const value = criterion.acceptableValues[index].toLowerCase()
    const operator = value[0]
    const encodedDate = value.substring(1)

    // date that the users input will be checked against (either the acceptable criteria static
    //   input or it will be calculated based on the duration in the acceptable criteria)
    let acceptanceDate = null

    // need to check if there is a determiner in the acceptable value
    if (
      DETERMINERS.some((detChar) => {
        if (encodedDate.includes(detChar)) {
          determiner = detChar
          return true
        }
        return false
      })
    ) {
      const amount = parseInt(value.substring(1, value.indexOf(determiner)))
      const today = new Date(Date.now())
      const changeVal = {}
      changeVal[determiner] = amount
      acceptanceDate = sub(today, changeVal)
    } else {
      acceptanceDate = Date.parse(encodedDate)
    }
    // checking to see if the date from the content file is valid
    if (isNaN(acceptanceDate)) {
      checkResult = null
    }
    // checking to see if the inputted date is valid / complete
    if (!isNaN(userInputDate)) {
      userInputDate = toDate(userInputDate)
      switch (operator) {
        case "=":
          checkResult = isEqual(userInputDate, acceptanceDate)
          break
        case ">":
          // handling the use case of a user being <60Y & >40Y also being reflected as a range
          // >01-01-1962, <01-01-1982
          checkResult = DETERMINERS.includes(determiner)
            ? isAfter(acceptanceDate, userInputDate)
            : isAfter(userInputDate, acceptanceDate)
          break
        case "<":
          checkResult = DETERMINERS.includes(determiner)
            ? isBefore(acceptanceDate, userInputDate)
            : isBefore(userInputDate, acceptanceDate)
          break
        default:
          checkResult = null
          break
      }
      if (checkResult === false) {
        break
      }
    }
  }
  return checkResult
}

export default validateDateAgainstAcceptance
