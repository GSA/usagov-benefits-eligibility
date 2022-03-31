import SanitizeBears from "~/mixins/SanitizeBears"

describe("sanitize bears mixin", () => {
  it("sanitize url", () => {
    const value = SanitizeBears.methods.sanitizeUrl("http:/www.someplace.com")
    expect(value).toBe("http:/www.someplace.com")
  })

  it("sanitize url with js", () => {
    const value = SanitizeBears.methods.sanitizeUrl("javascript:someMethod('dd')")
    expect(value).toBe("about:blank")
  })
})
