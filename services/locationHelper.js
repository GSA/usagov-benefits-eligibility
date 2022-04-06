import zipcodes from "zipcodes"
import zipnrviens from "zipcodes-nrviens"
import axios from "axios"

function validateLocation({ criterion, response, callback }) {
  if (criterion.acceptableValues) {
    if (!criterion.acceptableValues.some((value) => ["ih", "ia", "pa", "hm"].contains(value))) {
      switch (criterion.acceptableValues.length) {
        case 1:
          return criterion.acceptableValues[0] === response
        case 2: {
          // need to pull zip code and radius
          let radius = criterion.acceptableValues[0].includes("mi")
            ? criterion.acceptableValues[0]
            : criterion.acceptableValues[1]
          const startingZip = criterion.acceptableValues[0].includes("mi")
            ? criterion.acceptableValues[1]
            : criterion.acceptableValues[0]
          radius = radius.split("mi")[0]
          return zipcodes.distance(parseInt(response), parseInt(startingZip)) < radius
        }
        default:
          return !!criterion.acceptableValues.find((val) => val === response)
      }
    } else {
      checkZip(response, callback, criterion.acceptableValues[0].split(""))
    }
  } else {
    checkZip(response, callback)
  }
  return null
}

function checkZip(userResponse, callback, program = null) {
  const zipCodeInfo = zipnrviens.lookup(parseInt(userResponse))
  const { state, county } = zipCodeInfo
  let requestUrl = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter=(state eq '${state}' and declaredCountyArea eq '${county} (County)' and incidentEndDate eq ''`
  if (program !== null) {
    requestUrl += " " + program + "ProgramDeclared eq true)"
  } else {
    requestUrl += ")"
  }
  axios
    .get(requestUrl)
    .then(callback)
    .catch((err) => {
      console.error(err)
    })
}

export default validateLocation
