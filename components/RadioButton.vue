<template>
  <fieldset
    class="usa-fieldset"
    :class="disabledStyle">
    <template v-if="location === 'left-rail'">
      <legend
        class="usa-legend usa-legend text-bold tablet:padding-top-1"
        :class="disabledLabel">
        {{ label }}
      </legend>
    </template>
    <template v-else>
      <legend
        class="usa-legend usa-legend"
        :class="selectedStyle">
        {{ label }}
      </legend>
    </template>
    <template v-for="(value, index) in values">
      <div
        :key="value"
        class="usa-radio tablet:padding-left-1">
        <input
          :id="`${uniqueId}-${criteriaKey}-${value}`"
          class="usa-radio__input"
          type="radio"
          :name="`${uniqueId}-${criteriaKey}-${value}`"
          :value="value"
          :checked="response === value"
          :disabled="isDisabled"
          @change="updateEligibilitySelected" />
        <label
          class="usa-radio__label tablet:margin-top-1"
          :for="`${uniqueId}-${criteriaKey}-${value}`"
          >{{ value }}</label
        >
      </div>
      <div
        v-if="location === 'benefit-card' && lastItem(index, values)"
        :key="`${value}-${naUniqueId}`"
        class="usa-radio tablet:padding-left-1">
        <input
          :id="`${uniqueId}-${criteriaKey}-${value}-${naUniqueId}`"
          class="usa-radio__input"
          type="radio"
          :name="`${uniqueId}-${criteriaKey}-${value}-${naUniqueId}`"
          :value="'not applicable'"
          :checked="response === 'not applicable'"
          @change="updateEligibilitySelected" />
        <label
          :for="`${uniqueId}-${criteriaKey}-${value}-${naUniqueId}`"
          class="usa-radio__label tablet:margin-top-1"
          >not applicable</label
        >
      </div>
    </template>
  </fieldset>
</template>

<script>
import _ from "lodash"
export default {
  name: "RadioButton",
  props: {
    criteriaKey: {
      type: String,
      default: "No key provided",
    },
    label: {
      type: String,
      default: "No label provided",
    },
    values: {
      type: Array,
      default: () => [],
    },
    response: {
      type: [String, Object, Boolean],
      default: "No response provided",
    },
    location: {
      default: "benefit-card",
      validator: (value) => {
        return ["left-rail", "benefit-card"].includes(value)
      },
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uniqueId: _.uniqueId("radio-"),
      naUniqueId: _.uniqueId("na-"),
    }
  },
  computed: {
    selectedStyle() {
      if (
        (this.location === "benefit-card" && this.response === "not applicable") ||
        typeof this.response === "object"
      ) {
        return "text-base text-normal font-weight-normal"
      }
      return "text-bold"
    },
    disabledStyle() {
      if (this.isDisabled) {
        return "border-2px border-dotted border-gray-30 padding-1"
      }
      return null
    },
    disabledLabel() {
      if (this.isDisabled) {
        return "text-gray-30"
      }
      return null
    },
  },
  mounted() {
    this.uniqueId = _.uniqueId("radio-")
    this.naUniqueId = _.uniqueId("na-")
  },
  methods: {
    updateEligibilitySelected(e) {
      const localCriterion = {
        criteriaKey: this.criteriaKey,
        response: e.target.value,
      }
      this.$store.dispatch("criteria/updateResponse", localCriterion)
    },
    lastItem(index, list) {
      return index === list.length - 1
    },
  },
}
</script>

<style scoped>
.usa-radio {
  background: transparent;
}

.font-weight-normal {
  font-weight: 400;
}
</style>
