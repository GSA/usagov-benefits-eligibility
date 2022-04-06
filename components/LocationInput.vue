<template>
  <div>
    <label
      :class="labelClass"
      for="input-type-text"
      :style="selectedStyle">
      {{ label }}
    </label>
    <input
      :class="inputClass"
      :id="`${uniqueId}-${criteriaKey}`"
      :name="`${uniqueId}-${criteriaKey}`"
      type="text"
      @change="updateLocationInfo($event, criteriaKey)" />
  </div>
</template>

<script>
import _ from "lodash"
import { mapGetters } from "vuex"
import validateLocation from "../services/locationHelper"
export default {
  name: "LocationInput",
  props: {
    criteriaKey: {
      type: String,
      default: "no criteria key provided",
    },
    label: {
      type: String,
      default: "no label provided",
    },
    response: {
      type: [String, Object, Boolean],
      default: "no response provided",
    },
    acceptableValues: {
      type: Array,
    },
    location: {
      type: String,
      validator: (value) => {
        return ["benefit-card", "left-rail"].includes(value)
      },
      default: "benefit-card",
    },
  },
  data() {
    return {
      uniqueId: _.uniqueId("locationinput-"),
    }
  },
  computed: {
    ...mapGetters({
      getCriterionByEligibilityKey: "criteria/getCriterionByEligibilityKey",
    }),
    labelClass() {
      return `usa-label usa-label--${this.classFromResponse()}`
    },
    selectedStyle() {
      if (this.location === "left-rail") {
        return "text-bold"
      }
      return ""
    },
    inputClass() {
      return `usa-input usa-input--${this.classFromResponse()}`
    },
    
  },
  mounted() {
    this.uniqueId = _.uniqueId("checkbox-")
  },
  methods: {
    classFromResponse() {
      let cls = "error"
      if (this.response) {
        cls = "success"
      } else if (this.response == null) {
        cls = "empty"
      }
      return cls
    },
    updateLocationInfo(event, key) {
      console.log(this.acceptableValues)
      const zipCode = event.target.value
      localStorage.setItem('zipCode', zipCode)
      validateLocation({
        criterion: this.getCriterionByEligibilityKey(this.criteriaKey),
        response: zipCode,
        callback: (response) => {
          const disasters = response.data.DisasterDeclarationsSummaries
          const eligible = disasters.length > 1
          const localCriterion = {
            criteriaKey: key,
            response: eligible,
          }
          this.$store.dispatch("criteria/updateResponse", localCriterion)          
        }
      })
    },
  },
}
</script>

<style scoped>
.usa-label--empty,
.usa-input--empty {
  color: #1b1b1b;
}

.usa-label--success,
.usa-input--success {
  color: green;
  font-weight: bold;
}

.usa-label--error,
.usa-input--error {
  color: red;
  font-weight: bold;
}
</style>
