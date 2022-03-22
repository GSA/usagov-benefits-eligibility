import { mount, shallowMount } from "@vue/test-utils"
import LocationInput from "@/components/LocationInput.vue"
import beforeAllTests from "../beforeAllTests"
import { state as criteriaState, mutations, getters } from "~/store/criteria"
import { Store } from "vuex"
import { testEnvironment } from "~/jest.config"

const CRITERIA_KEY = "applicant_disaster_zone"
const ID = `locationinput-1-${CRITERIA_KEY}`
const PROPS = {
  criteriaKey: CRITERIA_KEY,
  label: "Testing Location Label",
  response: "00000",
  location: "benefit-card",
}

describe("LocationInput", () => {
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

  test("is a Vue instane", () => {
    const wrapper = mount(LocationInput, {
      propsData: PROPS,
    })
    expect(wrapper.vm).toBeTruthy()
  })

  test("displays with no props", () => {
    const wrapper = mount(LocationInput)
    expect(wrapper.vm).toBeTruthy()
  })

  test("location (left-rail) returns different selected style", () => {
    const wrapper = mount(LocationInput, {
      propsData: {
        ...PROPS,
        location: "benefit-card",
        response: true,
      },
    })
    expect(wrapper.vm.selectedStyle).toBe("")
  })

  test("location (benefit-card) returns different selected style", () => {
    const wrapper = mount(LocationInput, {
      propsData: {
        ...PROPS,
        location: "left-rail",
        response: true,
      },
    })
    expect(wrapper.vm.selectedStyle).toBe("text-bold")
  })
})
