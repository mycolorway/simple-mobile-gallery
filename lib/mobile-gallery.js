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
      origin: 'Original'
    }
  };

  MobileGallery._tpl = {
    gallery: "<div class=\"simple-mobile-gallery loading\">\n  <i class=\"fa fa-circle-o-notch fa-spin\" id=\"icon-loading\"></i>\n\n  <div class=\"gallery-control\">\n    <a href=\"javascript:;\" id=\"link-close\">" + (MobileGallery.prototype._t('close')) + "</a>\n    <a href=\"#\" id=\"link-origin\" target=\"_blank\">" + (MobileGallery.prototype._t('origin')) + "</a>\n  </div>\n</div>",
    image: "<div class=\"image-wrapper\">\n  <img />\n</div>"
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
    var $curThumb, count, curSrc, index;
    this.pageTop = document.body.scrollTop;
    $(document.body).children().hide();
    $curThumb = this.opts.el;
    this.thumbs = $curThumb.closest(this.opts.wrapCls).find(this.opts.itemCls);
    this.isMulti = this.thumbs.length > 1;
    this.winWidth = $(window).width();
    this.winHeight = $(window).height();
    this.gallery = $(MobileGallery._tpl.gallery).css('line-height', "" + this.winHeight + "px").appendTo("body");
    if (this.isMulti) {
      index = this.thumbs.index($curThumb);
      count = this.thumbs.length;
      this.list = $('<div class="images-list" />').appendTo(this.gallery);
      $("<span><span class='index'>" + (index + 1) + "</span>/" + count + "</span>").appendTo(this.gallery.find('.gallery-control'));
      this.thumbs.each((function(_this) {
        return function(i, el) {
          var curSrc;
          curSrc = _this._getCurSrc($(el));
          return $(MobileGallery._tpl.image).find('img').data('src', curSrc).end().appendTo(_this.list);
        };
      })(this));
      this.list.css({
        width: count * this.winWidth,
        transform: "translate(" + (0 - this.winWidth * index) + "px, 0px)"
      });
      this.image = this.list.find('img').eq(index);
    } else {
      curSrc = this._getCurSrc($curThumb);
      this.image = $(MobileGallery._tpl.image).appendTo(this.gallery);
      this.image = this.image.find('img').data('src', curSrc);
    }
    this.image[0].src = this.image.data('src');
    this.image.show();
    return this.gallery.find('#link-origin').attr('href', this.image.attr('src')).end().find('.image-wrapper').css({
      width: this.winWidth,
      height: this.winHeight
    });
  };

  MobileGallery.prototype._bind = function() {
    $(document).on('touchstart.mobileGallery', this._touchstart).on('click', '.gallery-control #link-close', this.destroy);
    return $('.simple-mobile-gallery img').load((function(_this) {
      return function(e) {
        _this.gallery.removeClass('loading');
        return $(e.target).css({
          opacity: 1
        });
      };
    })(this));
  };

  MobileGallery.prototype._touchstart = function(e) {
    var touch;
    touch = event.touches[0];
    this.startPos = {
      x: touch.clientX,
      y: touch.clientY
    };
    this.endPods = this.startPos;
    return this.gallery.on('touchmove.mobileGallery', this._touchmove).on('touchend.mobileGallery', this._touchend);
  };

  MobileGallery.prototype._touchmove = function(e) {
    var touch;
    e.preventDefault();
    touch = event.touches[0];
    return this.endPods = {
      x: touch.clientX,
      y: touch.clientY
    };
  };

  MobileGallery.prototype._touchend = function(e) {
    var $image, $index, detlaX, index, offsetLeft, src, translateX;
    this.gallery.off('.mobileGallery');
    if (this.isMulti) {
      $index = this.gallery.find('.index');
      detlaX = this.endPods.x - this.startPos.x;
      offsetLeft = this.list.offset().left;
      if (detlaX > 100) {
        $image = this.image.closest('.image-wrapper').prev().find('img');
        translateX = offsetLeft + this.winWidth;
        index = $index.text() * 1 - 1;
      } else if (detlaX < -100) {
        $image = this.image.closest('.image-wrapper').next().find('img');
        translateX = offsetLeft - this.winWidth;
        index = $index.text() * 1 + 1;
      }
      if ($image != null ? $image.length : void 0) {
        src = $image.data('src');
        this.gallery.find('#link-origin').attr('href', src);
        if (!$image[0].src) {
          this.gallery.addClass('loading');
        }
        $index.text(index);
        this.image = $image.attr('src', src).show();
        return this.list.css({
          transform: "translate(" + translateX + "px, 0px)"
        });
      }
    }
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

