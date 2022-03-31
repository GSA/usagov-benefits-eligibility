const thirdPartySanitize = require("@braintree/sanitize-url").sanitizeUrl

export default {
  methods: {
    sanitizeUrl(inputUrl) {
      return thirdPartySanitize(inputUrl)
    },
  },
}
