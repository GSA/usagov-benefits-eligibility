<template>
  <div>
    <a
      class="usa-skipnav"
      href="#main-content"
      >{{ $t("skipnav") }}</a
    >

    <section
      class="usa-banner"
      aria-label="Official government website">
      <div class="usa-accordion">
        <header class="usa-banner__header">
          <div class="usa-banner__inner">
            <div class="grid-col-auto">
              <img
                class="usa-banner__header-flag"
                src="../assets/img/us_flag_small.png"
                alt="U.S. flag" />
            </div>
            <div class="grid-col-fill tablet:grid-col-auto">
              <p class="usa-banner__header-text">{{ $t("banner.official") }}</p>
              <p
                class="usa-banner__header-action print:display-none"
                aria-hidden="true">
                {{ $t("banner.know") }}
              </p>
            </div>
            <button
              class="usa-accordion__button usa-banner__button print:display-none"
              aria-expanded="false"
              aria-controls="gov-banner">
              <span class="usa-banner__button-text">{{ $t("banner.know") }}</span>
            </button>
          </div>
        </header>

        <div
          id="gov-banner"
          class="usa-banner__content usa-accordion__content">
          <div class="grid-row grid-gap-lg">
            <div class="usa-banner__guidance tablet:grid-col-6">
              <img
                class="usa-banner__icon usa-media-block__img"
                src="../assets/img/icon-dot-gov.svg"
                role="img"
                alt=""
                aria-hidden="true" />
              <div class="usa-media-block__body">
                <p>
                  <strong>
                    {{ $t("banner.dropdown.official") }}
                  </strong>
                  <br />
                  <span>
                    {{ $t("banner.dropdown.officialDetailsDotGovPrefix") }}
                    <strong>.gov</strong>{{ $t("banner.dropdown.officialDetails") }}
                  </span>
                </p>
              </div>
            </div>
            <div class="usa-banner__guidance tablet:grid-col-6">
              <img
                class="usa-banner__icon usa-media-block__img"
                src="../assets/img/icon-https.svg"
                role="img"
                alt=""
                aria-hidden="true" />
              <div class="usa-media-block__body">
                <p>
                  <strong>
                    {{ $t("banner.dropdown.secure") }}
                  </strong>
                  <br />
                  {{ $t("banner.dropdown.secureDetailsLockPrefix") }}
                  <strong>{{ $t("banner.dropdown.secureDetailsLockStrong") }}</strong>
                  (
                  <span class="icon-lock">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="52"
                      height="64"
                      viewBox="0 0 52 64"
                      class="usa-banner__lock-image"
                      role="img"
                      aria-labelledby="banner-lock-title banner-lock-description"
                      focusable="false">
                      <title id="banner-lock-title">Lock</title>
                      <desc id="banner-lock-description">A locked padlock</desc>
                      <path
                        fill="#000000"
                        fill-rule="evenodd"
                        d="M26 0c10.493 0 19 8.507 19 19v9h3a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4h3v-9C7 8.507 15.507 0 26 0zm0 8c-5.979 0-10.843 4.77-10.996 10.712L15 19v9h22v-9c0-6.075-4.925-11-11-11z" />
                    </svg>
                  </span>
                  ) {{ $t("banner.dropdown.secureDetailsLockPostfix") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="usa-overlay" />
    <header class="usa-header usa-header--extended">
      <div class="usa-navbar display-flex flex-justify flex-align-center flex-justify-center">
        <div
          id="extended-logo"
          class="usa-logo"
          style="max-width: 60%">
          <em class="usa-logo__text display-flex flex-align-center">
            <nuxt-link
              to="/"
              title="USAGov Logo"
              aria-label="USAGov Logo">
              <img
                class="circle-5 desktop:circle-10 margin-right-2 tablet:margin-right-1"
                src="~/assets/img/logo-img-usagov.png"
                alt="USAGov Logo" />
            </nuxt-link>
            <nuxt-link
              to="/"
              title="Home"
              aria-label="Home"
              class="margin-left-1">
              {{ $t("projectName") }}
            </nuxt-link>
          </em>
        </div>
        <button class="usa-menu-btn print:display-none">Menu</button>
      </div>
      <nav
        aria-label="Primary navigation"
        class="usa-nav print:display-none">
        <div class="usa-nav__inner">
          <button class="usa-nav__close">
            <img
              src="../assets/img/usa-icons/close.svg"
              role="img"
              alt="close" />
          </button>
          <div class="usa-nav__secondary">
            <ul class="usa-nav__secondary-links">
              <li class="usa-nav__secondary-item">
                <a href="https://www.usa.gov/phone">1-844-USA-GOV1</a>
              </li>
            </ul>
            <form
              class="usa-search"
              role="search">
              <label
                class="usa-sr-only"
                for="extended-search-field-small"
                >Search small</label
              >
              <input
                id="extended-search-field-small"
                ref="search"
                class="usa-input"
                type="search"
                name="search"
                :value="query" />
              <button
                class="usa-button"
                type="submit"
                @click="doSearch">
                <span class="usa-sr-only">Search</span>
                <svg
                  class="usa-icon text-middle usa-icon--size-3"
                  aria-hidden="true"
                  focusable="false"
                  role="img">
                  <use xlink:href="~/assets/img/sprite.svg#search" />
                </svg>
              </button>
            </form>
          </div>
          <ul class="usa-nav__primary usa-accordion">
            <li
              v-if="isLifeEventPage"
              class="usa-nav__primary-item">
              <nuxt-link
                to="/"
                class="usa-nav__link">
                <span>Benefits by life event</span>
              </nuxt-link>
            </li>
            <li
              v-else
              class="usa-nav__primary-item">
              <nuxt-link
                to="/"
                exact
                class="usa-nav__link">
                <span>Benefits by life event</span>
              </nuxt-link>
            </li>
            <li class="usa-nav__primary-item">
              <nuxt-link
                to="/types"
                class="usa-nav__link">
                <span>Benefits by type</span>
              </nuxt-link>
            </li>
            <li class="usa-nav__primary-item">
              <nuxt-link
                to="/agencies"
                class="usa-nav__link">
                <span>Benefits by agency</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLifeEventPage: this.doesRouteMatchLifeEventPages(),
      query: this.$route?.query?.q || "",
    }
  },
  watch: {
    $route() {
      this.isLifeEventPage = this.doesRouteMatchLifeEventPages()
    },
  },
  methods: {
    doesRouteMatchLifeEventPages() {
      /* istanbul ignore next */
      return (
        this.$route &&
        this.$route.matched &&
        this.$route.matched[0] &&
        this.$route.matched[0].path &&
        this.$route.matched[0].path === "/:slug"
      )
    },
    doSearch(evt) {
      this.$router.push({
        path: "/search/",
        query: { q: this.$refs.search.value },
      })
      evt.preventDefault()
    },
  },
}
</script>
