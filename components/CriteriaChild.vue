<template>
  <div class="eligibility-criterion">
    <div
      v-if="type === 'boolean'"
      :key="criteriaKey"
      class="usa-checkbox">
      <CheckBox
        :criteria-key="criteriaKey"
        :label="getCriterionLabel()"
        :response="response"
        :is-disabled="isGroupKeyDisabled"
        location="left-rail" />
    </div>
    <div
      v-if="type === 'location'"
      :key="criteriaKey">
      <LocationInput
        :criteriaKey="criteriaKey"
        :label="getCriterionLabel(criterion)"
        :response="getCriterionByEligibilityKey(criteriaKey).response"
        location="benefit-card" />
    </div>
    <div
      v-if="type === 'date'"
      :key="criteriaKey">
      <DateInput
        :criteria-key="criteriaKey"
        :acceptableValues="getCriterionByEligibilityKey(criteriaKey).acceptableValues"
        :label="getCriterionLabel()"
        :response="doesCriterionDateMatch(getCriterionByEligibilityKey(criteriaKey))"
        :date-response="getCriterionByEligibilityKey(criteriaKey).response"
        location="left-rail" />
    </div>

    <div
      v-if="type === 'select'"
      :key="criteriaKey">
      <DropDown
        :label="getCriterionLabel()"
        :criteria-key="criteriaKey"
        :values="values"
        :response="response"
        :criteria-index="criteriaGroupKey"
        :is-disabled="isGroupKeyDisabled"
        location="left-rail" />
    </div>

    <div
      v-if="type === 'radio'"
      :key="criteriaKey">
      <RadioButton
        :criteria-key="criteriaKey"
        :label="getCriterionLabel()"
        :values="values"
        :response="response"
        :is-disabled="isGroupKeyDisabled"
        location="left-rail" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import RadioButton from "./RadioButton"
import DropDown from "./DropDown"
import CheckBox from "./CheckBox"
import LocationInput from "./LocationInput"
import DateInput from "./DateInput.vue"

export default {
  components: {
    RadioButton,
    DropDown,
    CheckBox,
    LocationInput,
    DateInput
  },
  props: {
    criteriaKey: {
      type: String,
      default: "No key provided"
    },
    label: {
      type: String,
      default: "No label provided"
    },
    type: {
      type: String,
      default: "No type provided"
    },
    values: {
      type: Array,
      default: () => []
    },
    criteriaGroupKey: {
      type: String,
      default: "criteriaGroup"
    },
    response: {
      type: [Boolean, String],
      default: false
    },
    criteria: {
      type: Object,
      default: () => {
      }
    },
    topLevelFilters: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isGroupKeyDisabled: false
    }
  },
  computed: {
    ...mapGetters({
      getCriterionByEligibilityKey: "criteria/getCriterionByEligibilityKey",
      doesCriterionDateMatch: "criteria/doesCriterionDateMatch"
    })
  },

  created() {
    let myTopLevelFilter = null

    for (const filter in this.topLevelFilters) {
      if (this.topLevelFilters[filter].disableGroupKey === this.criteriaGroupKey) {
        myTopLevelFilter = this.topLevelFilters[filter]
        break
      }
    }

    if (myTopLevelFilter !== null) {
      const myCriteria = myTopLevelFilter.criteriaKey
      this.$watch(`$store.state.criteria.eligibilityCriteria.${myCriteria}.response`, (newValue) => {
        this.isGroupKeyDisabled = false
        if (myTopLevelFilter.disableGroupWhen.includes(newValue)) {
          this.isGroupKeyDisabled = true
        }
      })
    }
  },
  methods: {
    getCriterionLabel() {
      return this.label || this.getCriterionByEligibilityKey(this.criteriaKey).label
    }
  }
}
</script>
<style
  type="scss"
  scoped>
.eligibility-criteria__child {
  border-left: 2px solid #dee1e2;
  margin-left: 0.25rem;
}

.usa-checkbox__label,
.usa-radio__label {
  margin: 1rem 0 1.25rem;
  line-height: 1.1;
  padding-left: 2.5rem;
}

.usa-checkbox__label::before,
.usa-radio__label::before {
  margin-right: 1.25em;
  vertical-align: middle;
}

.usa-select:last-child {
  margin-bottom: 1.25rem;
}

.usa-checkbox {
  background: none;
}

@media print {
  .eligibility-criterion input[type="checkbox"]:not(:checked) ~ label {
    display: none;
  }

  .usa-select-empty {
    display: none;
  }

  .criteria-group-empty {
    display: none;
  }
}
</style>
