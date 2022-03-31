import { shallowMount } from "@vue/test-utils"
import Page from "~/pages/types/_type.vue"
import beforeAllTests from "~/test/beforeAllTests"

describe("pages/types/_type.vue", () => {
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
    expect(results.benefitTopic).toBe("")
    expect(results.lifeEventBenefits).toBeTruthy()
  })

  it("should fetch benefits for a specific category", async () => {
    let contentRequest
    const contentMock = {
      sortBy: () => contentMock,
      where: () => contentMock,
      fetch: () => {
        return Promise.resolve(
          {
            benefits: [
              { title: "One", summary: "One summary", lifeEvents: ["Three", "Four"] },
              { title: "Two", summary: "Two summary", lifeEvents: [] },
            ],
            criteria: [],
            types: {
              relatedKeys: ["one"],
            },
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
        type: "one-two-three",
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
    expect(wrapper.vm.benefitTopic).toBe("One two three")
    expect(wrapper.vm.lifeEventBenefits.map((b) => b.title).join()).toBe("One,Two")
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
