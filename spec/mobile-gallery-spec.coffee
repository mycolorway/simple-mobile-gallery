
describe 'Simple mobile-gallery', ->

  it 'should inherit from SimpleModule', ->
    mobileGallery = simple.mobileGallery()
    expect(mobileGallery instanceof SimpleModule).toBe(true)
