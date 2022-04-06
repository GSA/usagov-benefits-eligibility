import { mount, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import CriteriaChild from "@/components/CriteriaChild.vue"
import beforeAllTests from "@/test/beforeAllTests"
import { actions, getters, mutations, state as criteriaState } from "~/store/criteria"

describe("CriteriaChild", () => {
  let store

  beforeAll(async () => {
    await beforeAllTests()
  })

  beforeEach(() => {
    criteriaState.namespaced = true
    store = new Vuex.Store({
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
    const wrapper = shallowMount(CriteriaChild, {
      propsData: {},
      store,
    })
    expect(wrapper.vm).toBeTruthy()
  })

  test("displays nothing when there are no criteria passed in", () => {
    const wrapper = shallowMount(CriteriaChild, {
      store,
    })
    expect(wrapper.find(".eligibility-criterion").text()).toBeFalsy()
  })

  test("test label", () => {
    const wrapper = mount(CriteriaChild, {
      store,
      propsData: {
        criteriaKey: "key",
        label: "bal bal",
        type: "boolean",
        values: ["true", "false"],
        criteriaGroupKey: "test-group-key",
        response: "balkajdflkjslf",
      },
    })
    expect(wrapper.find("label").text()).toBe("bal bal")
  })

  test("test label using default", () => {
    const wrapper = mount(CriteriaChild, {
      store,
      propsData: {
        criteriaKey: "myKey",
        type: "boolean",
        values: ["true", "false"],
        criteriaGroupKey: "test-group-key",
        response: "balkajdflkjslf",
      },
    })
    expect(wrapper.find("label").text()).toBe("No label provided")
  })

  test("no watcher created if no top-level filter is defined", () => {
    const wrapper = mount(CriteriaChild, {
      store,
      propsData: {
        criteriaKey: "myKey",
        type: "boolean",
        values: ["true", "false"],
        criteriaGroupKey: "test-group-key",
        response: "balkajdflkjslf",
        topLevelFilters: [
          {
            criteriaKey: ["filterKey"],
            type: "boolean",
            values: ["true", "false"],
            disableGroupKey: "group-i-dont-care-about-1",
            disableGroupWhen: "true",
          },
          {
            criteriaKey: ["otherKey"],
            type: "boolean",
            values: ["true", "false"],
            disableGroupKey: "group-i-dont-care-about-2",
            disableGroupWhen: "false",
          },
        ],
      },
    })

    let watcherWasCreated = false
    for (let watcherIndex in wrapper.vm._watchers) {
      let watcher = wrapper.vm._watchers[watcherIndex]
      if (
        watcher.expression === "$store.state.criteria.eligibilityCriteria.filterKey.response" ||
        watcher.expression === "$store.state.criteria.eligibilityCriteria.otherKey.response"
      ) {
        watcherWasCreated = true
      }
    }
    expect(watcherWasCreated).toBeFalsy()
  })

  test("watcher created for no top-level filter", () => {
    const wrapper = mount(CriteriaChild, {
      store,
      propsData: {
        criteriaKey: "myKey",
        type: "boolean",
        values: ["true", "false"],
        criteriaGroupKey: "test-group-key",
        response: "balkajdflkjslf",
        topLevelFilters: [
          {
            criteriaKey: ["filterKey"],
            type: "boolean",
            values: ["true", "false"],
            disableGroupKey: "test-group-key",
            disableGroupWhen: "true",
          },
          {
            criteriaKey: ["otherKey"],
            type: "boolean",
            values: ["true", "false"],
            disableGroupKey: "group-i-dont-care-about-2",
            disableGroupWhen: "false",
          },
        ],
      },
    })

    let watcherWasCreated = false
    for (let watcherIndex in wrapper.vm._watchers) {
      let watcher = wrapper.vm._watchers[watcherIndex]
      if (watcher.expression === "$store.state.criteria.eligibilityCriteria.filterKey.response") {
        watcherWasCreated = true
      }
    }
    expect(watcherWasCreated).toBeTruthy()
  })

  test("watcher called when stated changes", () => {
    store.state.criteria = {
      eligibilityCriteria: {
        filterKey: {
          response: false,
        },
      },
    }

    const wrapper = mount(CriteriaChild, {
      store,
      propsData: {
        criteriaKey: "myKey",
        type: "boolean",
        values: ["true", "false"],
        criteriaGroupKey: "test-group-key",
        response: "balkajdflkjslf",
        topLevelFilters: [
          {
            criteriaKey: ["filterKey"],
            type: "boolean",
            values: ["true", "false"],
            disableGroupKey: "test-group-key",
            disableGroupWhen: "true",
          },
          {
            criteriaKey: ["otherKey"],
            type: "boolean",
            values: ["true", "false"],
            disableGroupKey: "group-i-dont-care-about-2",
            disableGroupWhen: "false",
          },
        ],
      },
    })

    expect(wrapper.vm.isGroupKeyDisabled).toBeFalsy()
    store.state.criteria.eligibilityCriteria["filterKey"].response = true
    expect(wrapper.vm.isGroupKeyDisabled).toBeFalsy()
  })
})
