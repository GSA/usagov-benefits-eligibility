import zipcodes from "zipcodes"
import zipnrviens from "zipcodes-nrviens"
import axios from "axios"

function validateLocation({ values, response, callback }) {
  if (values) {
    if (!values.some((value) => ["ih", "ia", "pa", "hm"].indexOf(value))) {
      switch (values.length) {
        case 1:
          return values[0] === response
        case 2: {
          // need to pull zip code and radius
          let radius = values[0].includes("mi") ? values[0] : values[1]
          const startingZip = values[0].includes("mi") ? values[1] : values[0]
          radius = radius.split("mi")[0]
          return zipcodes.distance(parseInt(response), parseInt(startingZip)) < radius
        }
        default:
          return !!values.find((val) => val === response)
      }
    } else {
      checkZip(response, callback, values[0])
    }
  }
  checkZip(response, callback)
  return null
}

function checkZip(userResponse, callback, program = null) {
  const zipCodeInfo = zipnrviens.lookup(parseInt(userResponse))
  const { state, county } = zipCodeInfo
  let requestUrl = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter=(state eq '${state}' and declaredCountyArea eq '${county} (County)' and incidentEndDate eq ''`
  if (program !== null) {
    requestUrl += " and " + program + "ProgramDeclared eq true)"
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
