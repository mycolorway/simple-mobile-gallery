(function() {
  describe('Simple mobile-gallery', function() {
    return it('should inherit from SimpleModule', function() {
      var mobileGallery;
      mobileGallery = simple.mobileGallery();
      return expect(mobileGallery instanceof SimpleModule).toBe(true);
    });
  });

}).call(this);
