(function() {
  describe('Simple mobile-gallery', function() {
    var $el, gallery;
    gallery = null;
    $el = $("<div class=\"image-list\">\n  <img class=\"image\" src=\"../images/01.png\" data-image-src=\"images/01-large.png\">\n  <img class=\"image\" src=\"../images/02.png\" data-image-src=\"images/02-large.png\">\n</div>").appendTo('body');
    beforeEach(function() {
      return gallery = simple.mobileGallery({
        el: $el.find('img:first'),
        itemCls: ".image",
        wrapCls: ".image-list"
      });
    });
    afterEach(function() {
      return gallery.destroy();
    });
    it('should inherit from SimpleModule', function() {
      return expect(gallery instanceof SimpleModule).toBe(true);
    });
    it('should render gallery', function() {
      expect(gallery.gallery.hasClass('simple-mobile-gallery')).toBe(true);
      return expect(gallery.gallery.find('.image-wrapper img').length).toBeGreaterThan(0);
    });
    it('link-origin button should have image src', function() {
      var link, src;
      link = gallery.gallery.find('#link-origin').attr('href');
      src = gallery.image[0].src;
      return expect(src.indexOf(link)).toBeGreaterThan(0);
    });
    it('should render image list when have multi images', function() {
      return expect(gallery.list.find('img').length).toBe($('.image-list .image').length);
    });
    it('should be destroyed when click close button', function() {
      gallery.gallery.find('#link-close').click();
      return expect($('.simple-mobile-gallery').length).toBe(0);
    });
    return it('should be destroyed when call destroy', function() {
      gallery.destroy();
      return expect($('.simple-mobile-gallery').length).toBe(0);
    });
  });

}).call(this);
