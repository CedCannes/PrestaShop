import $ from 'jquery';
import prestashop from 'prestashop';
import 'velocity-animate';

$(document).ready(() => {
  prestashop.on('quickview clicked', function(elm) {
    let data = {
      'action': 'quickview',
      'id_product': elm.dataset.idProduct,
      'id_product_attribute': elm.dataset.idProductAttribute,
    };
    $.post(prestashop.urls.pages.product, data, null, 'json').then(function(resp) {
      $('body').append(resp.quickview_html);
      let productModal = $(`#quickview-modal-${resp.product.id}-${resp.product.id_product_attribute}`);
      productModal.modal('show');
      productConfig(productModal);
    });
  });
  var productConfig = (qv) => {
    const MAX_THUMBS = 4;
    var $arrows = $('.js-arrows');
    var $thumbnails = qv.find('.js-qv-product-images');
    $('.js-thumb').on('click', (event) => {
      if ($('.js-thumb').hasClass('selected')) {
        $('.js-thumb').removeClass('selected');
      }
      $(event.currentTarget).addClass('selected');
      $('.js-qv-product-cover').attr('src', $(event.target).data('image-large-src'));
    });
    if ($thumbnails.find('li').length <= MAX_THUMBS) {
      $arrows.hide();
    } else {
      $arrows.on('click', (event) => {
        if ($(event.target).hasClass('arrow-up') && $('.js-qv-product-images').position().top < 0) {
          move('up');
          $('.arrow-down').css('opacity', '1');
        } else if ($(event.target).hasClass('arrow-down') && $thumbnails.position().top + $thumbnails.height() > $('.js-qv-mask').height()) {
          move('down');
          $('.arrow-up').css('opacity', '1');
        }
      });
    }
  };
  var move = (direction) => {
    const THUMB_MARGIN = 20;
    var $thumbnails = $('.js-qv-product-images');
    var thumbHeight = $('.js-qv-product-images li img').height() + THUMB_MARGIN;
    var currentPosition = $thumbnails.position().top;
    $thumbnails.velocity({
      translateY: (direction === 'up') ? currentPosition + thumbHeight : currentPosition - thumbHeight
    }, function() {
      if ($thumbnails.position().top >= 0) {
        $('.arrow-up').css('opacity', '.2');
      } else if ($thumbnails.position().top + $thumbnails.height() <= $('.js-qv-mask').height()) {
        $('.arrow-down').css('opacity', '.2');
      }
    });
  };
});