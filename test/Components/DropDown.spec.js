import { mount, shallowMount } from "@vue/test-utils"
import { Store } from "vuex"
import DropDown from "@/components/DropDown.vue"
import beforeAllTests from "@/test/beforeAllTests"
import { getters, mutations, state as criteriaState } from "~/store/criteria"

const MOCK_CRITERIA = {
  criteriaKey: "deceased_served_in_active_military",
  label: "The deceased served in the active military, naval, or air service and",
  type: "select",
  values: [
    "was discharged under conditions other than dishonorable",
    "died while on active duty",
    "had retired from the service",
  ],
}

describe("<DropDown/>", () => {
  let store
  let actions

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
    const wrapper = mount(DropDown, {
      propsData: {
        criteriaKey: MOCK_CRITERIA.criteriaKey,
        label: MOCK_CRITERIA.label,
        values: MOCK_CRITERIA.values,
      },
    })
    expect(wrapper.vm).toBeTruthy()
  })

  test("displays without any props", () => {
    const wrapper = mount(DropDown, {})
    expect(wrapper.vm).toBeTruthy()
  })

  test("displays eligibilityCriteria when one is passed in", () => {
    const wrapper = shallowMount(DropDown, {
      propsData: { ...MOCK_CRITERIA },
      store,
    })
    expect(wrapper.find("label").text()).toBe("The deceased served in the active military, naval, or air service and")
    expect(wrapper.find("option:checked").element.value).toBeFalsy()
  })

  test("updates when a select criteria response changes", async () => {
    const wrapper = shallowMount(DropDown, {
      propsData: { ...MOCK_CRITERIA },
      store,
    })
    const choices = wrapper.find("select").findAll("option")
    await choices.at(2).setSelected()
    expect(wrapper.find("option:checked").element.value).toBe("died while on active duty")
    expect(actions.updateResponse).toHaveBeenCalled()
  })

  test("component has disabled styles when disabled", () => {
    const wrapper = mount(DropDown, {
      propsData: {
        criteriaKey: MOCK_CRITERIA.criteriaKey,
        label: MOCK_CRITERIA.label,
        values: MOCK_CRITERIA.values,
        isDisabled: true,
      },
    })
    expect(wrapper.vm.disabledStyle).toBe("border-2px border-dotted border-gray-30 padding-1")
    expect(wrapper.vm.disabledLabel).toBe("text-gray-30")
  })

  test("component no disabled styles when not disabled", () => {
    const wrapper = mount(DropDown, {
      propsData: {
        criteriaKey: MOCK_CRITERIA.criteriaKey,
        label: MOCK_CRITERIA.label,
        values: MOCK_CRITERIA.values,
        isDisabled: false,
      },
    })
    expect(wrapper.vm.disabledStyle).toBeNull()
    expect(wrapper.vm.disabledLabel).toBeNull()
  })
})
