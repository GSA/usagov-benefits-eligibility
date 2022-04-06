<template>
  <div
    class="usa-summary-box margin-bottom-2"
    role="region"
    aria-labelledby="summary-box-key-information">
    <div class="usa-summary-box__body">
      <div class="usa-summary-box__text">
        <form class="usa-form">
          <fieldset class="usa-fieldset">
            <template v-for="criteriaGroup in topLevelFilters">
              <div
                :id="'criteriaGroup-' + criteriaGroup.criteriaGroupKey"
                :key="criteriaGroup.criteriaGroupKey">
                <template v-for="criterion in getCriteriaMap(criteriaGroup.criteriaKey)">
                  <h3
                    id="summary-box-key-information"
                    :key="`heading-${criterion.criteriaKey}`"
                    class="usa-summary-box__heading">
                    {{ criteriaGroup.label }}
                  </h3>
                  <CriteriaChild
                    :key="criterion.criteriaKey"
                    :criteria-key="criterion.criteriaKey"
                    :label="criterion.label"
                    :values="criterion.values.split('; ')"
                    :type="criterion.type"
                    :criteria-group-key="criteriaGroup.criteriaGroupKey"
                    :response="criterion.response"
                    class="margin-y-2 tablet:margin-y-3" />
                </template>
              </div>
            </template>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import CriteriaChild from "./CriteriaChild.vue"

export default {
  name: "SummaryBox",
  components: {
    CriteriaChild,
  },
  props: {
    topLevelFilters: {
      type: Array,
      default: /* istanbul ignore next */ () => [],
    },
  },

  computed: {
    ...mapGetters({
      getCriterionByEligibilityKey: "criteria/getCriterionByEligibilityKey",
    }),
  },
  methods: {
    getCriteriaMap(criteriaKeys) {
      return criteriaKeys.map((criterionKey) => {
        return this.getCriterionByEligibilityKey(criterionKey)
      })
    },
  },
}
</script>
