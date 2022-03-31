import { createLocalVue, shallowMount } from "@vue/test-utils"
import Accordion from "@/components/Accordion.vue"
import beforeAllTests from "@/test/beforeAllTests"
import Vuex from "vuex"

const localVue = createLocalVue()
localVue.use(Vuex)

describe("Accordion", () => {
  let store
  let getters
  let oldClient

  beforeAll(async () => {
    await beforeAllTests()
  })

  beforeEach(() => {
    oldClient = process.client
    process.client = true
    getters = {
      doesCriterionMatchSelection: () => jest.fn().mockReturnValue(true).mockReturnValueOnce(false),
      getTotalEligibleCriteria: () => jest.fn().mockReturnValue(2).mockReturnValueOnce(3).mockReturnValueOnce(0),
    }
    store = new Vuex.Store({
      modules: {
        criteria: {
          namespaced: true,
          getters,
        },
      },
    })
  })

  afterEach(() => {
    process.client = oldClient
  })

  const propsData = {
    lifeEventBenefits: [
      {
        title: "One title",
        slug: "one-slug",
        tags: [],
        eligibility: [
          {
            criteriaKey: "one-criteria",
            acceptableValues: [true],
          },
          {
            criteriaKey: "two-criteria",
            acceptableValues: [true],
          },
          {
            criteriaKey: "three-criteria",
            acceptableValues: [true],
          },
        ],
      },
      {
        title: "Two title",
        slug: "two-slug",
        tags: [],
        eligibility: [
          {
            criteriaKey: "one-criteria",
            acceptableValues: [true],
          },
          {
            criteriaKey: "two-criteria",
            acceptableValues: [true],
          },
          {
            criteriaKey: "three-criteria",
            acceptableValues: [true],
          },
        ],
      },
      {
        title: "Three title",
        slug: "three-slug",
        tags: [],
        eligibility: [
          {
            criteriaKey: "one-criteria",
            acceptableValues: [true],
          },
          {
            criteriaKey: "two-criteria",
            acceptableValues: [true],
          },
          {
            criteriaKey: "three-criteria",
            acceptableValues: [true],
          },
          {
            criteriaKey: "virtual-criteria",
          },
        ],
      },
    ],
    lifeEventCriteria: [
      {
        criteriaKeys: ["one-criteria"],
      },
      {
        criteriaKeys: ["two-criteria", "three-criteria"],
      },
    ],
  }

  it("should be a Vue instance", () => {
    const wrapper = shallowMount(Accordion, {
      propsData,
      store,
      localVue,
    })
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.vm.$options.data()).toBeTruthy()
  })

  it("should open and close accordions when called", () => {
    const wrapper = shallowMount(Accordion, {
      propsData,
      store,
      localVue,
    })
    jest.spyOn(wrapper.vm, "toggleAccordion").mockReturnValue()
    wrapper.vm.closeAll()
    expect(wrapper.vm.toggleAccordion).toHaveBeenCalled()
    wrapper.vm.openAll()
    expect(wrapper.vm.toggleAccordion).toHaveBeenCalled()
    wrapper.vm.focus()
    expect(wrapper.vm.toggleAccordion).toHaveBeenCalled()
  })

  describe("sanitizedBenefitUrl tests", () => {
    it("text example.com", () => {
      const wrapper = shallowMount(Accordion, {
        propsData,
        store,
        localVue,
      })
      const url = wrapper.vm.sanitizedBenefitUrl({
        source: {
          link: "http://www.example.com",
        },
      })
      expect(url).toBe("http://www.example.com")
    })
    it("sanitizedBenefitUrl about:blank if javascript is injected", () => {
      const wrapper = shallowMount(Accordion, {
        propsData,
        store,
        localVue,
      })
      const url = wrapper.vm.sanitizedBenefitUrl({
        source: {
          link: "javascript:somethingBad('dd')",
        },
      })
      expect(url).toBe("about:blank")
    })
  })

  describe("getCriteriaMatchLanguage tests", () => {
    it("false value for critiera selected", () => {
      getters = {
        doesCriterionMatchSelection: () => jest.fn().mockReturnValue(false).mockReturnValueOnce(false),
        getTotalEligibleCriteria: () => jest.fn().mockReturnValue(2).mockReturnValueOnce(3).mockReturnValueOnce(0),
      }
      store = new Vuex.Store({
        modules: {
          criteria: {
            namespaced: true,
            getters,
          },
        },
      })
      const wrapper = shallowMount(Accordion, {
        propsData,
        store,
      })
      const text = wrapper.vm.getCriteriaMatchLanguage([{}])
      expect(text).toBe("(you are not eligible)")
    })
    it("nothing selected", () => {
      getters = {
        doesCriterionMatchSelection: () => jest.fn().mockReturnValue(null),
        getTotalEligibleCriteria: () => jest.fn().mockReturnValue(0),
      }
      store = new Vuex.Store({
        modules: {
          criteria: {
            namespaced: true,
            getters,
          },
        },
      })
      const wrapper = shallowMount(Accordion, {
        propsData,
        store,
      })
      const text = wrapper.vm.getCriteriaMatchLanguage([{}])
      expect(text).toBe(null)
    })
  })
})
