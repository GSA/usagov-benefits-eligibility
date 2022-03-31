import { mount, shallowMount } from "@vue/test-utils"
import DateInput from "@/components/DateInput.vue"
import beforeAllTests from "@/test/beforeAllTests"
import { state as criteriaState, mutations, getters } from "~/store/criteria"
import { Store } from "vuex"

const CRITERIA_KEY = "applicant_senior"
const PROPS_DATA = {
  criteriaKey: CRITERIA_KEY,
  label: "Testing DateInput Label",
  response: "test",
  dateResponse: "11-14-1999",
  location: "benefit-card",
}

describe("DateInput", () => {
  let store, actions
  beforeAll(async () => {
    await beforeAllTests()
  })

  beforeEach(() => {
    criteriaState.namespaced = true

    actions = {
      updateResponse: jest.fn(),
    }

    store = new Store({
      modules: {
        criteria: {
          namespaced: true,
          state: criteriaState,
          actions,
          mutations,
          getters,
        },
      },
    })
  })

  test("is a Vue instance", () => {
    const wrapper = mount(DateInput, {
      propsData: PROPS_DATA,
    })
    expect(wrapper.vm).toBeTruthy()
  })

  test("displays with no props", () => {
    const wrapper = mount(DateInput)
    expect(wrapper.vm).toBeTruthy()
  })

  test("displays with default location correctly", () => {
    const wrapper = shallowMount(DateInput, {
      propsData: {
        criteriaKey: CRITERIA_KEY,
        label: "Testing DateInput Label",
        response: "test",
        location: "left-rail",
        dateResponse: "00-00-0000",
      },
    })
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.vm.labelClass).toBeDefined()
    expect(wrapper.vm.legendClass).toBeDefined()
    expect(wrapper.vm.inputClass).toBeDefined()
    expect(wrapper.vm.selectedStyle).toBeDefined()
    expect(wrapper.vm.pullDateValue("00-00-0000", 0)).toBeDefined()
  })

  test("displays with default location correctly", () => {
    const wrapper = shallowMount(DateInput, {
      propsData: {
        criteriaKey: CRITERIA_KEY,
        label: "Testing DateInput Label",
        response: null,
        location: "benefit-card",
        dateResponse: null,
      },
    })
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.vm.labelClass).toBeDefined()
    expect(wrapper.vm.legendClass).toBeDefined()
    expect(wrapper.vm.inputClass).toBeDefined()
    expect(wrapper.vm.selectedStyle).toBeDefined()
    expect(wrapper.vm.pullDateValue(null, 0)).toBeDefined()
  })

  test("clicking input values results in update in store", async () => {
    const wrapper = shallowMount(DateInput, { propsData: PROPS_DATA, store })
    const UID = wrapper.find("input").element.id.split(`-${CRITERIA_KEY}`)[0]
    const monthInput = wrapper.find(`#${UID}-${CRITERIA_KEY}-month`)
    monthInput.element.value = "01"
    monthInput.trigger("change")
    expect(actions.updateResponse.mock.calls.length).toBe(1)
    const dayInput = wrapper.find(`#${UID}-${CRITERIA_KEY}-day`)
    dayInput.element.value = "01"
    dayInput.trigger("change")
    expect(actions.updateResponse.mock.calls.length).toBe(2)
    const yearInput = wrapper.find(`#${UID}-${CRITERIA_KEY}-year`)
    yearInput.element.value = "2022"
    yearInput.trigger("change")
    expect(actions.updateResponse.mock.calls.length).toBe(3)
  })
})
