
class MobileGallery extends SimpleModule

  opts:
    el:      null
    itemCls: ""
    wrapCls: ""

  @i18n:
    'zh-CN':
      close: '关闭'
      origin: '原图'
    'en':
      close: 'Close'
      origin: 'Original Image'

  @_tpl:
    gallery: """
      <div class="simple-mobile-gallery loading">
        <div class="image-wrapper"></div>
        <div class="gallery-control">
          <a href="javascript:;" id="link-close">#{ @::_t('close') }</a>
          <a href="#" id="link-origin" target="_blank">#{ @::_t('origin') }</a>
        </div>
      </div>
    """

    image: """
      <img src="" class="gallery-image">
    """


  _init: ->
    if @opts.el is null
      throw '[Gallery] - 内容不能为空'

    $('.simple-mobile-gallery').data('mobile-gallery')?.destroy()
    @_render()
    @_bind()
    @gallery.data('mobile-gallery', @)


  _render: ->
    @pageTop = document.body.scrollTop
    $(document.body).children(':not(.simple-mobile-gallery)').hide()

    @curThumb = @opts.el
    @thumbs = @curThumb.closest( @opts.wrapCls ).find( @opts.itemCls )
    @winHeight = $(window).height()
    curSrc = @_getCurSrc @curThumb

    @gallery = $(MobileGallery._tpl.gallery)
      .find('.image-wrapper')
      .css('line-height', "#{ @winHeight }px")
      .end().find('#link-origin').attr('href', curSrc)
      .end().appendTo "body"

    @galleryImage = $(MobileGallery._tpl.image).attr('src', curSrc)
      .appendTo @gallery.find('.image-wrapper')

    @galleryImage.load =>
      @gallery.removeClass 'loading'
      @galleryImage.css
        opacity: 1


  _bind: ->
    $(document.body).on 'touchstart.mobileGallery', @_touchstart
      .on 'click', '.gallery-control #link-close', @destroy


  _touchstart: (e) =>
    if @galleryImage.height() > @winHeight
      offsetTop = @galleryImage.offset().top
      touch = event.touches[0]
      @startPos =
        x: touch.clientX
        y: touch.clientY - offsetTop

      @galleryImage.css
          transition: 'opacity 300ms ease-out'

      @gallery.on 'touchmove.mobileGallery', @_touchmove
        .on 'touchend.mobileGallery', @_touchend


  _touchmove: (e) =>
    e.preventDefault()

    touch = event.touches[0]
    endPos =
      x: touch.clientX - @startPos.x,
      y: touch.clientY - @startPos.y

    @galleryImage.css
      transform: "translate(0px, #{ endPos.y }px)"


  _touchend: (e) =>
    offsetTop = @galleryImage.offset().top
    offsetY = @galleryImage.height() - @winHeight

    if offsetTop > 0
      @galleryImage.css
        transition: 'all 300ms ease-out'
        transform: 'translate(0px, 0px)'
    else if offsetY + offsetTop < 0
      @galleryImage.css
        transition: 'all 300ms ease-out'
        transform: "translate(0px, #{ 0 - offsetY }px)"

    @gallery.off '.mobileGallery'


  _getCurSrc: ($el) ->
    $img = if $el.is('[src]') then $el else $el.find('[src]:first')
    return $el.data('image-src') or $el.data('origin-src') or $img.attr('src')


  destroy: =>
    $(document.body).off '.mobileGallery'
      .children().show()
    document.body.scrollTop = @pageTop
    @gallery.remove()



mobileGallery = (opts) ->
  new MobileGallery(opts)
