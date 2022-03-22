import zipcodes from "zipcodes"
import zipnrviens from "zipcodes-nrviens"

function validateLocation({ criterion, response, element }) {
  if (criterion.acceptableValues) {
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
    const zipCodeInfo = zipnrviens.lookup(parseInt(response))
    const { state, county } = zipCodeInfo
    const requestUrl = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter(state eq '${state}' and declaredCountyArea eq '${county} (County)') and incidentEndDate eq ''}`
    axios
      .get(requestUrl)
      .then((response) => {
        const disasters = response.data.DisasterDeclarationsSummaries
        return disasters.length > 1
      })
      .catch((err) => {
        console.error(err)
      })
  }
  return null
}

export default validateLocation
