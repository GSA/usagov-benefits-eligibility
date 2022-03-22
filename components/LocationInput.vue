<template>
  <div>
    <label
      class="usa-label"
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
    selectedStyle() {
      if (this.location === "left-rail") {
        return "text-bold"
      }
      return ""
    },
    inputClass() {
      return `usa-input usa-input${this.response === null ? "" : this.response === false ? "--error" : "--success"}`
    },
  },
  mounted() {
    this.uniqueId = _.uniqueId("checkbox-")
  },
  methods: {
    updateLocationInfo(event, key) {
      const zipCode = event.target.value
      window[key + "_element"] = event.target
      const localCriterion = {
        criteriaKey: key,
        response: zipCode,
      }
      this.$store.dispatch("criteria/updateResponse", localCriterion)
    },
  },
}
</script>

<style></style>
