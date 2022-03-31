import { shallowMount } from "@vue/test-utils"
import Page from "~/pages/agencies/_agency.vue"
import beforeAllTests from "~/test/beforeAllTests"

describe("pages/agencies/_agency.vue", () => {
  let $fetchState

  beforeAll(async () => {
    await beforeAllTests()
    $fetchState = {
      pending: false,
      error: false,
    }
  })

  it("should be a Vue instance with default data", () => {
    const wrapper = shallowMount(Page, {
      mocks: { $fetchState },
    })
    expect(wrapper.vm).toBeTruthy()
    const results = wrapper.vm.$options.data()
    expect(results.lifeEventBenefits).toBeTruthy()
  })

  it("should fetch benefits for a specific agency", async () => {
    let contentRequest
    const contentMock = {
      sortBy: () => contentMock,
      where: () => contentMock,
      fetch: () => {
        return Promise.resolve(
          {
            agencies: {
              relatedKeys: ["one"],
            },
            benefits: [
              {
                title: "One",
                summary: "One summary",
                source: { name: "One two three" },
                lifeEvents: ["Three", "Four"],
              },
              { title: "Two", summary: "Two summary", source: { name: "One two three" }, lifeEvents: [] },
              { title: "Three", summary: "Three summary", source: { name: "U.S. One Two" }, lifeEvents: [] },
            ],
            criteria: [],
          }[contentRequest]
        )
      },
    }
    const $content = (path) => {
      contentRequest = path
      return contentMock
    }
    const $route = {
      params: {
        agency: "one-two-three",
      },
    }
    const $store = {
      dispatch: () => Promise.resolve(),
    }
    const wrapper = shallowMount(Page, {
      mocks: {
        $content,
        $fetchState,
        $route,
        $store,
      },
    })
    await wrapper.vm.$options.fetch.apply(wrapper.vm)
    expect(wrapper.vm.benefitAgency).toBe("One two three")
    expect(wrapper.vm.lifeEventBenefits.map((b) => b.title).join()).toBe("One,Two")

    $route.params.agency = "u-s-one-two"
    const wrapper2 = shallowMount(Page, {
      mocks: {
        $content,
        $fetchState,
        $route,
        $store,
      },
    })
    await wrapper2.vm.$options.fetch.apply(wrapper2.vm)
    expect(wrapper2.vm.benefitAgency).toBe("U.S. One Two")
  })

  it("should expand,collapse, and clear all accordion cards", async () => {
    const $store = {
      dispatch: () => Promise.resolve(),
    }
    const wrapper = shallowMount(Page, {
      mocks: { $fetchState, $store },
    })
    const openAllSpy = jest.fn()
    const closeAllSpy = jest.fn()
    const clearAllSpy = jest.fn()
    wrapper.vm.$refs.accordion.openAll = openAllSpy
    wrapper.vm.$refs.accordion.closeAll = closeAllSpy
    wrapper.vm.$store.dispatch = clearAllSpy
    await wrapper.find(".usa-button.open-all").trigger("click")
    expect(openAllSpy).toHaveBeenCalled()
    await wrapper.find(".usa-button.close-all").trigger("click")
    expect(closeAllSpy).toHaveBeenCalled()
    await wrapper.find(".usa-button.clear-all").trigger("click")
    expect(clearAllSpy).toHaveBeenCalled()
  })
})
