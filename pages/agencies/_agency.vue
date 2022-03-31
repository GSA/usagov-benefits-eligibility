<template>
  <div>
    <section class="grid-container">
      <div class="grid-row grid-gap">
        <div class="tablet:grid-col">
          <h1
            v-if="benefitAgency"
            class="font-heading-lg tablet:font-heading-xl margin-top-5 text-secondary">
            {{ benefitAgency }}
          </h1>
          <p
            v-if="agency && agency.lede"
            class="tablet:font-heading-lg line-height-serif-6 text-normal measure-6">
            {{ agency.lede }}
          </p>
        </div>
      </div>

      <div class="grid-row grid-gap">
        <div class="tablet:grid-col margin-bottom-3">Showing {{ lifeEventBenefits.length }} benefits</div>
      </div>
      <!-- Desktop meta sort and open -->
      <div class="display-none tablet:display-flex grid-row grid-gap print:display-block">
        <div class="tablet:grid-col margin-bottom-3">
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
      </div>

      <div class="grid-row grid-gap print:display-block">
        <div class="tablet:grid-col-7 desktop:grid-col-8">
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
          <!-- Mobile meta sort and open -->
          <div class="tablet:display-none">
            <h2 class="font-heading-lg margin-top-1">Benefits Results</h2>
            <button
              class="usa-button clear-all"
              aria-controls="acc-id"
              @click="clearCriteria">
              Clear Selections
            </button>
            <OpenCloseButtons
              :is-open-active-prop="true"
              @open-all="openAll"
              @close-all="closeAll" />
          </div>
          <Accordion
            ref="accordion"
            :life-event-benefits="lifeEventBenefits"
            :expanded="true"
            :show-icons="false"
            :show-matching-count="false"
            :tag-click="false" />
        </div>
      </div>

      <div class="grid-row grid-gap margin-top-2">
        <div class="grid-col">
          <print @print="openAll" />
        </div>
      </div>
    </section>
    <cross-sell
      title="Other agencies that might be relevant to you."
      :cards="agency.related"
      class="print:display-none" />
  </div>
</template>

<script>
import _ from "lodash"
import mapTags from "~/mixins/MapTags"
import OpenCloseButtons from "~/components/OpenCloseButtons.vue"

export default {
  components: {
    OpenCloseButtons,
  },
  mixins: [mapTags],
  data() {
    return {
      benefitAgency: "",
      lifeEventBenefits: [],
      agency: {
        title: "",
        summary: "",
        lede: "",
        relatedKeys: [],
        related: [],
      },
    }
  },
  async fetch() {
    const slug = this.$route.params.agency.startsWith("u-s-")
      ? _.lowerCase(this.$route.params.agency).replace(/^u s /, "u.s. ")
      : _.lowerCase(this.$route.params.agency)
    const agencyRegex = new RegExp(_.escapeRegExp(slug), "i")
    const lifeEventBenefits = await this.$content("benefits").sortBy("title").fetch()
    const allEligibilityCriteria = (await this.$content("criteria").fetch()).body
    await this.$store.dispatch("criteria/populate", allEligibilityCriteria)
    this.lifeEventBenefits = lifeEventBenefits.filter(
      (benefit) => benefit?.source?.name && agencyRegex.test(benefit.source.name)
    )
    this.benefitAgency = this.lifeEventBenefits[0]?.source?.name
    // eslint-disable-next-line node/handle-callback-err
    this.agency = await this.$content("agencies", this.$route.params.agency)
      .fetch()
      .catch((_err) => {})
    this.agency.related = []
    for (const related of this.agency.relatedKeys || []) {
      this.agency.related.push(await this.$content("agencies", related).fetch())
    }
  },
  /* istanbul ignore next */
  head() {
    return {
      title: this.benefitAgency,
    }
  },
  methods: {
    mapLifeEvents(lifeEvents) {
      return lifeEvents.map((le) => _.lowerCase(le))
    },
    openAll() {
      this.$refs.accordion.openAll()
    },
    closeAll() {
      this.$refs.accordion.closeAll()
    },
    clearCriteria() {
      this.$store.dispatch("criteria/clear")
    },
  },
}
</script>

<style scoped>
h1 {
  text-transform: capitalize;
}
</style>
