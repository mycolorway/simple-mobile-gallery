
describe 'Simple mobile-gallery', ->
  gallery = null
  $el = $("""
    <div class="image-list">
      <img class="image" src="../images/01.png" data-image-src="images/01-large.png">
      <img class="image" src="../images/02.png" data-image-src="images/02-large.png">
    </div>
    """).appendTo 'body'

  beforeEach ->
    gallery = simple.mobileGallery
      el: $el.find('img:first')
      itemCls: ".image"
      wrapCls: ".image-list"

  afterEach ->
    gallery.destroy()


  it 'should inherit from SimpleModule', ->
    expect(gallery instanceof SimpleModule).toBe(true)

  it 'should render gallery', ->
    expect(gallery.gallery.hasClass('simple-mobile-gallery')).toBe(true)
    expect(gallery.gallery.find('.image-wrapper img').length).toBeGreaterThan(0)

  it 'link-origin button should have image src', ->
    link = gallery.gallery.find('#link-origin').attr('href')
    src = gallery.image[0].src
    expect(src.indexOf link).toBeGreaterThan(0)

  it 'should render image list when have multi images', ->
    expect(gallery.list.find('img').length).toBe($('.image-list .image').length)

  it 'should be destroyed when click close button', ->
    gallery.gallery.find('#link-close').click()
    expect($('.simple-mobile-gallery').length).toBe(0)

  it 'should be destroyed when call destroy', ->
    gallery.destroy()
    expect($('.simple-mobile-gallery').length).toBe(0)

