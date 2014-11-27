
class MobileGallery extends SimpleModule

  opts:
    el:      null
    itemCls: ""
    wrapCls: ""
    formatSrc: null

  @i18n:
    'zh-CN':
      close: '关闭'
      origin: '原图'
    'en':
      close: 'Close'
      origin: 'Original'

  @_tpl:
    gallery: """
      <div class="simple-mobile-gallery loading">
        <i class="fa fa-circle-o-notch fa-spin" id="icon-loading"></i>

        <div class="gallery-control">
          <a href="javascript:;" id="link-close">#{ @::_t('close') }</a>
          <a href="#" id="link-origin" target="_blank">#{ @::_t('origin') }</a>
        </div>
      </div>
    """

    image: """
      <div class="image-wrapper">
        <img />
      </div>
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
    $(document.body).children().hide()

    $curThumb = @opts.el
    @thumbs = $curThumb.closest( @opts.wrapCls ).find( @opts.itemCls )
    @isMulti = (@thumbs.length > 1)
    @winWidth = $(window).width()
    @winHeight = $(window).height()

    @gallery = $(MobileGallery._tpl.gallery)
      .css('line-height', "#{ @winHeight }px")
      .appendTo "body"

    if @isMulti
      index = @thumbs.index $curThumb
      count = @thumbs.length

      @list = $('<div class="images-list" />').appendTo @gallery
      $("<span><span class='index'>#{ index + 1 }</span>/#{ count }</span>")
        .appendTo @gallery.find('.gallery-control')

      @thumbs.each (i, el) =>
        curSrc = @_getCurSrc $(el)
        $(MobileGallery._tpl.image).find('img').data('src', curSrc)
          .end().appendTo @list

      @list.css
        width: count * @winWidth
        transform: "translate(#{ 0 - @winWidth * index }px, 0px)"
      @image = @list.find('img').eq index

    else
      curSrc = @_getCurSrc $curThumb
      @image = $(MobileGallery._tpl.image).appendTo @gallery
      @image = @image.find('img').data('src', curSrc)

    @image[0].src = @image.data 'src'
    @image.show()

    @gallery.find('#link-origin')
      .attr('href', @image.attr('src'))
      .end().find('.image-wrapper')
      .css
        width: @winWidth
        height: @winHeight

  _bind: ->
    $(document)
      .on 'touchstart.mobileGallery', @_touchstart
      .on 'click', '.gallery-control #link-close', @destroy

    $('.simple-mobile-gallery img').load (e) =>
      @gallery.removeClass 'loading'
      $(e.target).css
        opacity: 1


  _touchstart: (e) =>
    @startPosX = event.touches[0].clientX
    @endPosX = @startPosX

    @gallery.on 'touchmove.mobileGallery', @_touchmove
      .on 'touchend.mobileGallery', @_touchend


  _touchmove: (e) =>
    e.preventDefault()
    @endPosX = event.touches[0].clientX


  _touchend: (e) =>
    @gallery.off '.mobileGallery'

    if @isMulti
      $index = @gallery.find('.index')
      detlaX = @endPosX - @startPosX
      offsetLeft = @list.offset().left

      # prev image
      if detlaX > 100
        $image = @image.closest('.image-wrapper').prev().find('img')
        translateX = offsetLeft + @winWidth
        index = $index.text() * 1 - 1

      # next image
      else if detlaX < -100
        $image = @image.closest('.image-wrapper').next().find('img')
        translateX = offsetLeft - @winWidth
        index = $index.text() * 1 + 1

      if $image?.length
        @list.css
          transform: "translate(#{ translateX }px, 0px)"

        src = $image.data 'src'
        $index.text index
        @gallery.find('#link-origin').attr('href', src)
        @gallery.addClass('loading') unless $image[0].src
        @image = $image.attr('src', src).show()


  _getCurSrc: ($el) ->
    $img = if $el.is('[src]') then $el else $el.find('[src]:first')
    src = $el.data('image-src') or $el.data('origin-src') or $img.attr('src')
    src = @opts.formatSrc.call(@, src) if $.isFunction @opts.formatSrc
    return src


  destroy: =>
    $(document.body).off '.mobileGallery'
      .children().show()
    document.body.scrollTop = @pageTop
    @gallery.remove()



mobileGallery = (opts) ->
  new MobileGallery(opts)
