(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('simple-mobile-gallery', ["jquery",
      "simple-module"], function ($, SimpleModule) {
      return (root.returnExportsGlobal = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),
      require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['mobileGallery'] = factory(jQuery,
      SimpleModule);
  }
}(this, function ($, SimpleModule) {

var MobileGallery, mobileGallery,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MobileGallery = (function(_super) {
  __extends(MobileGallery, _super);

  function MobileGallery() {
    this.destroy = __bind(this.destroy, this);
    this._touchend = __bind(this._touchend, this);
    this._touchmove = __bind(this._touchmove, this);
    this._touchstart = __bind(this._touchstart, this);
    return MobileGallery.__super__.constructor.apply(this, arguments);
  }

  MobileGallery.prototype.opts = {
    el: null,
    itemCls: "",
    wrapCls: ""
  };

  MobileGallery.i18n = {
    'zh-CN': {
      close: '关闭',
      origin: '原图'
    },
    'en': {
      close: 'Close',
      origin: 'Original Image'
    }
  };

  MobileGallery._tpl = {
    gallery: "<div class=\"simple-mobile-gallery loading\">\n  <div class=\"image-wrapper\"></div>\n  <div class=\"gallery-control\">\n    <a href=\"javascript:;\" id=\"link-close\">" + (MobileGallery.prototype._t('close')) + "</a>\n    <a href=\"#\" id=\"link-origin\" target=\"_blank\">" + (MobileGallery.prototype._t('origin')) + "</a>\n  </div>\n</div>",
    image: "<img src=\"\" class=\"gallery-image\">"
  };

  MobileGallery.prototype._init = function() {
    var _ref;
    if (this.opts.el === null) {
      throw '[Gallery] - 内容不能为空';
    }
    if ((_ref = $('.simple-mobile-gallery').data('mobile-gallery')) != null) {
      _ref.destroy();
    }
    this._render();
    this._bind();
    return this.gallery.data('mobile-gallery', this);
  };

  MobileGallery.prototype._render = function() {
    var curSrc;
    this.pageTop = document.body.scrollTop;
    $(document.body).children(':not(.simple-mobile-gallery)').hide();
    this.curThumb = this.opts.el;
    this.thumbs = this.curThumb.closest(this.opts.wrapCls).find(this.opts.itemCls);
    this.winHeight = $(window).height();
    curSrc = this._getCurSrc(this.curThumb);
    this.gallery = $(MobileGallery._tpl.gallery).find('.image-wrapper').css('line-height', "" + this.winHeight + "px").end().find('#link-origin').attr('href', curSrc).end().appendTo("body");
    this.galleryImage = $(MobileGallery._tpl.image).attr('src', curSrc).appendTo(this.gallery.find('.image-wrapper'));
    return this.galleryImage.load((function(_this) {
      return function() {
        _this.gallery.removeClass('loading');
        return _this.galleryImage.css({
          opacity: 1
        });
      };
    })(this));
  };

  MobileGallery.prototype._bind = function() {
    return $(document.body).on('touchstart.mobileGallery', this._touchstart).on('click', '.gallery-control #link-close', this.destroy);
  };

  MobileGallery.prototype._touchstart = function(e) {
    var offsetTop, touch;
    if (this.galleryImage.height() > this.winHeight) {
      offsetTop = this.galleryImage.offset().top;
      touch = event.touches[0];
      this.startPos = {
        x: touch.clientX,
        y: touch.clientY - offsetTop
      };
      this.galleryImage.css({
        transition: 'opacity 300ms ease-out'
      });
      return this.gallery.on('touchmove.mobileGallery', this._touchmove).on('touchend.mobileGallery', this._touchend);
    }
  };

  MobileGallery.prototype._touchmove = function(e) {
    var endPos, touch;
    e.preventDefault();
    touch = event.touches[0];
    endPos = {
      x: touch.clientX - this.startPos.x,
      y: touch.clientY - this.startPos.y
    };
    return this.galleryImage.css({
      transform: "translate(0px, " + endPos.y + "px)"
    });
  };

  MobileGallery.prototype._touchend = function(e) {
    var offsetTop, offsetY;
    offsetTop = this.galleryImage.offset().top;
    offsetY = this.galleryImage.height() - this.winHeight;
    if (offsetTop > 0) {
      this.galleryImage.css({
        transition: 'all 300ms ease-out',
        transform: 'translate(0px, 0px)'
      });
    } else if (offsetY + offsetTop < 0) {
      this.galleryImage.css({
        transition: 'all 300ms ease-out',
        transform: "translate(0px, " + (0 - offsetY) + "px)"
      });
    }
    return this.gallery.off('.mobileGallery');
  };

  MobileGallery.prototype._getCurSrc = function($el) {
    var $img;
    $img = $el.is('[src]') ? $el : $el.find('[src]:first');
    return $el.data('image-src') || $el.data('origin-src') || $img.attr('src');
  };

  MobileGallery.prototype.destroy = function() {
    $(document.body).off('.mobileGallery').children().show();
    document.body.scrollTop = this.pageTop;
    return this.gallery.remove();
  };

  return MobileGallery;

})(SimpleModule);

mobileGallery = function(opts) {
  return new MobileGallery(opts);
};


return mobileGallery;


}));

