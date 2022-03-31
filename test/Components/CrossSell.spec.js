import { mount } from "@vue/test-utils"
import CrossSell from "@/components/CrossSell.vue"
import beforeAllTests from "@/test/beforeAllTests"

describe("CrossSell", () => {
  beforeAll(async () => {
    await beforeAllTests()
  })

  it("should be a Vue instance", () => {
    const wrapper = mount(CrossSell, {
      propsData: {
        title: "Title",
        cards: [
          {
            cardTitle: "Test card title",
            cardBody: "Test card body",
            primaryButtonText: "Test card primary button text",
            primaryButtonLink: "#test-card-primary-button-link",
          },
        ],
      },
    })
    expect(wrapper.vm).toBeTruthy()
  })

  it("should be a Vue instance with no cards", () => {
    const wrapper = mount(CrossSell, {
      propsData: {
        title: "Title",
        cards: [],
      },
    })
    expect(wrapper.vm).toBeTruthy()
  })
  it("should be a Vue instance with no cards", () => {
    const wrapper = mount(CrossSell, {
      propsData: {
        title: "Title",
      },
    })
    expect(wrapper.vm).toBeTruthy()
  })
})
