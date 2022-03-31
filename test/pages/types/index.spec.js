import { shallowMount } from "@vue/test-utils"
import Page from "@/pages/types/index.vue"
import beforeAllTests from "@/test/beforeAllTests"

describe("pages/types/_type.vue", () => {
  beforeAll(async () => {
    await beforeAllTests()
  })

  it("should be a Vue instance with default data", () => {
    const wrapper = shallowMount(Page)
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.vm.$options.data().lifeEventTags).toBeTruthy()
  })

  it("should get all the tags, return a unique list that's sorted", async () => {
    let contentRequest
    const contentMock = {
      only: () => contentMock,
      fetch: () => {
        return Promise.resolve(
          {
            benefits: [
              { tags: ["one", "two", "three"] },
              { tags: ["one", "two", "three", "four"] },
              { tags: ["one", "two", "three", "four", "five"] },
            ],
            types: [
              { slug: "one", title: "One title", summary: "One summary" },
              { slug: "three", title: "Three title", summary: "Three summary" },
            ],
          }[contentRequest]
        )
      },
    }
    const $content = (path) => {
      contentRequest = path
      return contentMock
    }
    const wrapper = shallowMount(Page)
    const result = await wrapper.vm.$options.asyncData({ $content })
    expect(result.lifeEventTags.join()).toBe("five,four,one,three,two")
  })

  it("should merge tags with categories", () => {
    const wrapper = shallowMount(Page, {
      data: () => ({
        types: {
          one: { slug: "one", title: "One title", summary: "One summary" },
          three: { slug: "three", title: "Three title", summary: "Three summary" },
        },
      }),
    })
    const results = wrapper.vm.mapTags(["one", "two", "three"])
    expect(results[0].title).toBe("One")
    expect(results[1].title).toBe("Two")
  })
})
