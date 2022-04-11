<template>
  <fieldset class="usa-fieldset">
    <legend :class="legendClass">
      {{ label }}
    </legend>
    <div class="usa-memorable-date">
      <!-- lower margin of the label -->
      <div class="usa-form-group usa-form-group--month">
        <label
          :class="labelClass"
          :for="`${uniqueId}-${criteriaKey}-month`"
          >Month</label
        >
        <input
          :id="`${uniqueId}-${criteriaKey}-month`"
          v-model="month"
          :class="inputClass"
          aria-describedby="monthinput"
          :name="`${uniqueId}-${criteriaKey}-month`"
          type="text"
          maxlength="2"
          pattern="[0-9]*"
          inputmode="numeric"
          @change="updateElibilityDate($event, criteriaKey)" />
      </div>
      <div class="usa-form-group usa-form-group--day">
        <label
          :class="labelClass"
          :for="`${uniqueId}-${criteriaKey}-day`"
          >Day</label
        >
        <input
          :id="`${uniqueId}-${criteriaKey}-day`"
          v-model="day"
          :class="inputClass"
          aria-describedby="dayinput"
          :name="`${uniqueId}-${criteriaKey}-day`"
          type="text"
          maxlength="2"
          pattern="[0-9]*"
          inputmode="numeric"
          @change="updateElibilityDate($event, criteriaKey)" />
      </div>
      <div class="usa-form-group usa-form-group--year">
        <label
          :class="labelClass"
          :for="`${uniqueId}-${criteriaKey}-year`"
          >Year</label
        >
        <input
          :id="`${uniqueId}-${criteriaKey}-year`"
          v-model="year"
          :class="inputClass"
          aria-describedby="yearinput"
          :name="`${uniqueId}-${criteriaKey}-year`"
          type="text"
          minlength="4"
          maxlength="4"
          pattern="[0-9]*"
          inputmode="numeric"
          @change="updateElibilityDate($event, criteriaKey)" />
      </div>
    </div>
  </fieldset>
</template>

<style scoped>
.usa-legend {
  margin-bottom: -0.6875rem;
}

.usa-legend--empty,
.usa-label--empty,
.usa-input--empty {
  color: #1b1b1b;
}

.usa-legend--success,
.usa-label--success,
.usa-input--success {
  color: green;
  font-weight: bold;
}

.usa-legend--error,
.usa-label--error,
.usa-input--error {
  color: red;
  font-weight: bold;
}
</style>

<script>
import _ from "lodash"

export default {
  name: "DateInput",
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
    dateResponse: {
      type: String,
      default: "no response inputted",
    },
    location: {
      type: String,
      default: "benefit-card",
      validator: (value) => {
        return ["benefit-card", "left-rail"].includes(value)
      },
    },
  },
  watch: {
    dateResponse() {
      this.month = this.pullDateValue(this.dateResponse, 0)
      this.day = this.pullDateValue(this.dateResponse, 1)
      this.year = this.pullDateValue(this.dateResponse, 2)
    },
  },
  data() {
    return {
      uniqueId: _.uniqueId("dateinput-"),
      month: this.pullDateValue(this.dateResponse, 0),
      day: this.pullDateValue(this.dateResponse, 1),
      year: this.pullDateValue(this.dateResponse, 2),
    }
  },
  computed: {
    selectedStyle() {
      return this.location === "left-rail" ? "text-bold" : ""
    },
    labelClass() {
      return `usa-label usa-label--${this.classFromResponse()}`
    },
    legendClass() {
      return `usa-legend usa-legend--${this.classFromResponse()}`
    },
    inputClass() {
      return `usa-input usa-input--${this.classFromResponse()}`
    },
  },
  mounted() {
    this.uniqueId = _.uniqueId("dateinput-")
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
    pullDateValue(dateResponse, index) {
      return `${dateResponse !== null ? dateResponse.split("-")[index] : ""}`
    },
    updateElibilityDate(event, key) {
      // figure out date from 3 boxes
      const month = this.month
      const day = this.day
      const year = this.year
      if (month !== "" && day !== "" && year !== "") {
        const date = `${month}-${day}-${year}`
        const localCriterion = {
          criteriaKey: key,
          response: date,
        }
        this.$store.dispatch("criteria/updateResponse", localCriterion)
      }
    },
  },
}
</script>
