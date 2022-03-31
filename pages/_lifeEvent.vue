<template>
  <div>
    <section class="grid-container">
      <div class="grid-row grid-gap">
        <div class="tablet:grid-col">
          <h1
            v-if="lifeEventTitle"
            class="font-heading-lg tablet:font-heading-xl margin-top-6 text-secondary">
            {{ lifeEvent.secondaryHeadline }}
          </h1>
          <p
            v-if="lifeEvent.lede"
            class="tablet:font-heading-lg line-height-serif-6 text-normal measure-6">
            {{ lifeEvent.lede }}
          </p>
          <ol class="usa-process-list">
            <li
              v-for="step in landingPage.processListSteps"
              :key="step"
              class="usa-process-list__item padding-bottom-4">
              <p class="usa-process-list__heading font-sans-md tablet:font-sans-lg line-height-sans-1">
                {{ step }}
              </p>
            </li>
          </ol>
        </div>
      </div>
      <!-- Desktop meta sort and open -->
      <div
        role="complementary"
        class="display-none tablet:display-flex grid-row grid-gap print:display-none">
        <div class="tablet:grid-col-5 desktop:grid-col-4 margin-y-2 print:display-none"></div>
        <div class="tablet:grid-col-4 desktop:grid-col-3 display-flex flex-align-center margin-y-2 print:display-none">
          <div>
            <button
              class="usa-button usa-button--unstyled open-all"
              aria-controls="acc-id"
              @click="openAll">
              Open All
            </button>
            /
            <button
              class="usa-button usa-button--unstyled close-all"
              aria-controls="acc-id"
              @click="closeAll">
              Close All
            </button>
            /
            <button
              class="usa-button usa-button--unstyled clear-all"
              aria-controls="acc-id"
              @click="clearCriteria">
              Clear Selections
            </button>
          </div>
        </div>
        <div class="grid-col margin-y-2 text-right">
          <label
            role="status"
            class="usa-label display-inline margin-right-1"
            for="benefitSort"
            >Showing {{ lifeEventBenefits.length }} related benefits sorted by:
            <select
              id="benefitSort"
              class="usa-select margin-left-auto width-card display-inline-block"
              name="benefitSort"
              aria-label="Sort benefits by"
              @change="sortChange">
              <option
                value="relevance"
                :selected="sort === 'relevance'">
                Relevance
              </option>
              <option
                value="title"
                :selected="sort === 'title'">
                Title (A-Z)
              </option>
            </select>
          </label>
        </div>
      </div>

      <div class="grid-row grid-gap print:display-block">
        <div
          class="tablet:grid-col-5 desktop:grid-col-4 desktop:position-sticky desktop:top-1 desktop:height-viewport desktop:overflow-y-auto shade padding-2 radius-md">
          <h2 class="display-none print:display-block">Eligibility criteria</h2>
          <div>
            <div v-if="filter">
              <div
                class="margin-bottom-3"
                role="alert">
                Currently viewing
                <span class="usa-tag bg-secondary display-inline-flex margin-left-05 padding-0 usa-button-group__item">
                  <button
                    class="usa-tooltip usa-button usa-button--unstyled usa-button--outline usa-button--inverse text-uppercase margin-left-05 border-left border-accent-cool-light padding-x-05 font-sans-3xs"
                    style="padding: 0.25rem; text-decoration: none"
                    :title="`Remove the ${filter} filter`"
                    :aria-label="`Remove the ${filter} filter`"
                    data-position="top"
                    @click="clearFilter">
                    <span class="text-middle text-white">{{ filter }}</span>
                    <svg
                      class="usa-icon text-white text-middle"
                      aria-hidden="true"
                      focusable="false"
                      role="img">
                      <use xlink:href="~/assets/img/sprite.svg#close" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>
            <div class="margin-bottom-2 display-flex print:display-none">
              <div class="text-primary">
                <svg
                  class="usa-icon usa-icon--size-3"
                  aria-labelledby="eligibility-section-criteria-icon-title"
                  focusable="false"
                  role="img">
                  <title id="eligibility-section-criteria-icon-title">Important information</title>
                  <use xlink:href="~/assets/img/sprite.svg#priority_high" />
                </svg>
              </div>
              <div class="font-body-md usa-icon-list">
                {{ lifeEvent.eligibilityCriteriaDescription }}
              </div>
            </div>
            <CriteriaGroup :life-event-criteria="lifeEvent.eligibilityCriteria" />
            <share-results @print="openAll()" />
          </div>
        </div>
        <div class="margin-top-2 tablet:margin-top-0 tablet:grid-col-7 desktop:grid-col-8 print:display-block">
          <!-- Mobile meta sort and open -->
          <h2 class="tablet:display-none font-heading-lg margin-top-6">Benefits Results</h2>
          <div
            role="complementary"
            class="tablet:display-none print:display-none">
            <div class="margin-y-2 print:display-none">
              <fieldset class="usa-fieldset">
                <label
                  role="status"
                  class="usa-label"
                  for="benefitSort"
                  >Showing {{ lifeEventBenefits.length }} related benefits sorted by:</label
                >
                <select
                  id="benefitSort"
                  class="usa-select width-full"
                  name="options"
                  @change="sortChange">
                  <option
                    value="relevance"
                    :selected="sort === 'relevance'">
                    Relevance
                  </option>
                  <option
                    value="title"
                    :selected="sort === 'title'">
                    Title (A-Z)
                  </option>
                </select>
              </fieldset>
            </div>

            <OpenCloseButtons
              :is-close-active-prop="true"
              @open-all="openAll"
              @close-all="closeAll" />
          </div>

          <div class="grid-row grid-gap display-none print:display-block break-before-always">
            <div class="grid-col margin-bottom-3">
              <h2 class="display-none print:display-block">Benefits</h2>
              Showing {{ lifeEventBenefits.length }} related benefits sorted by {{ sort }}.
            </div>
          </div>
          <div
            v-if="$fetchState.pending"
            class="usa-alert usa-alert--info usa-alert--no-icon usa-alert--slim">
            <div class="usa-alert__body">
              <p class="usa-alert__text">Fetching benefits...</p>
            </div>
          </div>
          <div
            v-if="$fetchState.error"
            class="usa-alert usa-alert--error usa-alert--slim">
            <div class="usa-alert__body">
              <p class="usa-alert__text">Error while fetching benefits.</p>
            </div>
          </div>
          <div
            v-if="lifeEventBenefits && lifeEventBenefits.length == 0"
            class="usa-alert usa-alert--error usa-alert--slim">
            <div class="usa-alert__body">
              <p class="usa-alert__text">No matching benefits found.</p>
            </div>
          </div>
          <Accordion
            ref="accordion"
            :life-event-benefits="lifeEventBenefits"
            :life-event-criteria="lifeEvent.eligibilityCriteria" />
        </div>
      </div>
    </section>
    <cross-sell
      title="Other benefits that might be relevant to you."
      :cards="lifeEvent.related"
      class="print:display-none" />
  </div>
</template>

<script>
import _ from "lodash"
import { mapGetters, mapState } from "vuex"
import mapTags from "~/mixins/MapTags"
import OpenCloseButtons from "~/components/OpenCloseButtons.vue"

export default {
  name: "LifeEvent",
  components: {
    OpenCloseButtons,
  },
  mixins: [mapTags],
  layout: "default",
  async asyncData({ $content }) {
    const landingPage = await $content("landing-page").fetch()
    return { landingPage }
  },
  data() {
    return {
      filter: "",
      alert: false,
      lifeEvent: {
        slug: "",
        title: "",
        lede: "",
        summary: "",
        eligibilityCriteria: [],
        relatedKeys: [],
        related: [],
      },
      lifeEventBenefits: [],
      allLifeEventBenefits: [],
      sort: "relevance",
    }
  },

  async fetch() {
    const lifeEvent = await this.$content("life-events", this.$route.params.lifeEvent).fetch()

    const lifeEventBenefits = await this.$content("benefits")
      .where({
        lifeEvents: { $contains: this.$route.params.lifeEvent },
      })
      .sortBy("title")
      .fetch()

    const allEligibilityCriteria = (await this.$content("criteria").fetch()).body
    await this.$store.dispatch("criteria/populate", allEligibilityCriteria)

    lifeEvent.related = []
    for (const related of lifeEvent.relatedKeys || []) {
      lifeEvent.related.push(await this.$content("life-events", related).fetch())
    }

    this.lifeEvent = lifeEvent
    this.allLifeEventBenefits = this.lifeEventBenefits = lifeEventBenefits
  },
  /* istanbul ignore next */
  head() {
    return {
      title: this.lifeEvent.secondaryHeadline,
    }
  },
  computed: {
    lifeEventTitle() {
      return this.lifeEvent.secondaryHeadline
    },
    ...mapGetters({
      getTotalEligibleCriteria: "criteria/getTotalEligibleCriteria",
      getTotalIneligibleCriteria: "criteria/getTotalIneligibleCriteria",
    }),
    ...mapState({
      eligibilityCriteria: (state) => state.criteria.eligibilityCriteria,
    }),
  },
  watch: {
    eligibilityCriteria: {
      handler(newEligibilityCriteria) {
        this.sortBenefits()
      },
      deep: true,
    },
    lifeEvent: {
      handler(lifeEvent) {
        this.sortBenefits()
      },
    },
  },
  beforeDestroy() {
    /* istanbul ignore next */
    this.$root.$off("tag:click", this.tagClick)
  },
  mounted() {
    this.$root.$on("tag:click", this.tagClick)
  },
  methods: {
    clearCriteria() {
      this.$store.dispatch("criteria/clear")
      this.sortBenefits()
    },

    getVirtualCriteria() {
      const lifeEventCriteria = Object.fromEntries(
        this.lifeEvent.eligibilityCriteria
          .map((ec) => ec.criteriaKeys)
          .flat()
          .map((criteriaKey) => [criteriaKey, true])
      )
      const virtualCriteria = {}
      for (const benefit of this.lifeEventBenefits) {
        for (const criteria of benefit.eligibility) {
          if (!lifeEventCriteria[criteria.criteriaKey]) {
            virtualCriteria[criteria.criteriaKey] = true
          }
        }
      }
      return virtualCriteria
    },
    closeAll() {
      this.$refs.accordion.closeAll()
    },
    openAll() {
      this.$refs.accordion.openAll()
    },
    sortChange(event) {
      this.sort = event.target.value
      this.sortBenefits()
    },
    sortBenefits() {
      if (this.sort === "title") {
        this.lifeEventBenefits = _.sortBy(this.lifeEventBenefits, [this.sort])
      } else {
        const forceToBottom = 2048
        const virtualCriteria = this.getVirtualCriteria()
        this.lifeEventBenefits.forEach((benefit) => {
          const matches = (benefit.matches = this.getTotalEligibleCriteria(benefit.eligibility))
          const ineligible = this.getTotalIneligibleCriteria(benefit.eligibility) > 0
          const virtualBenefitEligibility = (benefit.virtualBenefitEligibility = (benefit.eligibility || []).filter(
            (c) => virtualCriteria[c.criteriaKey]
          ).length)
          benefit.inverseMatchRatio =
            1 - matches / (benefit.eligibility.length - virtualBenefitEligibility) + (ineligible ? forceToBottom : 0)
        })
        this.lifeEventBenefits = _.sortBy(this.lifeEventBenefits, ["inverseMatchRatio", "title"])
      }
    },
    tagClick(tag) {
      this.lifeEventBenefits = _.filter(this.allLifeEventBenefits, (benefit) => {
        return benefit.tags.includes(tag)
      })
      this.filter = tag
      this.sortBenefits()
      // eslint-disable-next-line vue/valid-next-tick
      setTimeout(() => this.$nextTick(() => this.$refs.accordion.focus()), 250)
    },
    clearFilter() {
      this.filter = ""
      this.lifeEventBenefits = this.allLifeEventBenefits
      this.sortBenefits()
      this.$nextTick(() => this.$refs.accordion.focus())
    },
  },
}
</script>

<style scoped>
.benefit-list-move {
  transition: transform 2s;
}

/*
tablet and higher
uswds breakpoints https://designsystem.digital.gov/utilities/layout-grid/
*/
@media only screen and (min-width: 640px) {
  .usa-process-list > .usa-process-list__item:last-child {
    padding-bottom: 0;
  }
}
</style>
