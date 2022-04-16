/*  ---------------------------------------------------
    Template Name: Ogani
    Description:  Ogani eCommerce  HTML Template
    Author: Colorlib
    Author URI: https://colorlib.com
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Gallery filter
        --------------------*/
        $('.featured__controls li').on('click', function () {
            $('.featured__controls li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.featured__filter').length > 0) {
            var containerEl = document.querySelector('.featured__filter');
            var mixer = mixitup(containerEl);
        }

        
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Humberger Menu
    $(".humberger__open").on('click', function () {
        $(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").addClass("active");
        $("body").addClass("over_hid");
    });

    $(".humberger__menu__overlay").on('click', function () {
        $(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").removeClass("active");
        $("body").removeClass("over_hid");
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*-----------------------
        Categories Slider
    ------------------------*/
    $(".categories__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 4,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            0: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 3,
            },

            992: {
                items: 4,
            }
        }
    });


    $('.hero__categories__all').on('click', function(){
        $('.hero__categories ul').slideToggle(400);
    });

    /*--------------------------
        Latest Product Slider
    ----------------------------*/
    $(".latest-product__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------------
        Product Discount Slider
    -------------------------------*/
    $(".product__discount__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            320: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 2,
            },

            992: {
                items: 3,
            }
        }
    });

    /*---------------------------------
        Product Details Pic Slider
    ----------------------------------*/
    $(".product__details__pic__slider").owlCarousel({
        loop: true,
        margin: 20,
        items: 4,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------
		Price Range Slider
	------------------------ */
    var rangeSlider = $(".price-range"),
        minamount = $("#minamount"),
        maxamount = $("#maxamount"),
        minPrice = rangeSlider.data('min'),
        maxPrice = rangeSlider.data('max');
    const minPriceSearch = $('#price-min').val()
    const maxPriceSearch = $('#price-max').val()
    rangeSlider.slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPriceSearch, maxPriceSearch],
        slide: function (event, ui) {
            minamount.val('$' + ui.values[0]);
            maxamount.val('$' + ui.values[1]);
        }
    });
    minamount.val('$' + rangeSlider.slider("values", 0));
    maxamount.val('$' + rangeSlider.slider("values", 1));

    /*--------------------------
        Select
    ----------------------------*/
    $("select").niceSelect();

    /*------------------
		Single Product
	--------------------*/
    $('.product__details__pic__slider img').on('click', function () {

        var imgurl = $(this).data('imgbigurl');
        var bigImg = $('.product__details__pic__item--large').attr('src');
        if (imgurl != bigImg) {
            $('.product__details__pic__item--large').attr({
                src: imgurl
            });
        }
    });

    /*-------------------
		Quantity change
	--------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseInt(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 1) {
                var newVal = parseInt(oldValue) - 1;
            } else {
                newVal = 1;
            }
        }
        $button.parent().find('input').val(newVal);
        $button.parent().find('input').trigger('input')
    });
    

    $('.shoping-cart-click > a').click(function(e){
        e.preventDefault();
        const href = $(this).attr('href')
        $.get( href + '&quantity=1', function(res) {
            if(res.number){
                $('#cart-item-number').text(res.number)
                $('#cart-item-number-mobile').text(res.number)
                const idProduct = href.split("=")[1]
                
                //convert a locale en-US to float
                let totalPrice = parseFloat($('#cart-item-price').text().replace(',', ''))
                
                // select price after sale
                const productPrice = parseFloat($(`#price-item-${idProduct}`).contents().get(1).nodeValue)
                

                totalPrice += productPrice 
                $('#cart-item-price-mobile').text(totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
                $('#cart-item-price').text(totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))

                $.notify("Add to cart sucess!", "success");

            } else { window.location.href = '/auth/login'}
          })        
    })
    
    $('.shoping-loveItem-click > a').click(function(e){
        e.preventDefault();
        const href = $(this).attr('href')
        $.get( href, function(res) {
            if(res.number){
                $('#love-item-number').text(res.number)
                $('#love-item-number-mobile').text(res.number)
                $.notify("Add to love item sucess!", "success");
            } else {window.location.href = "/auth/login"};

          })                  
    })

    $('.quantative-event-change').on('change', function(e){
        let quantitive = parseInt($(this).val())        
        let idProduct = $(this).attr('id').split('-')[1]
        const price = $(`#price-${idProduct}`).text()

        if(isNaN(quantitive) || quantitive == 0){
            $(`#total-${idProduct}`).text(price)
            $(this).val(1)
        } else $(this).val(quantitive)
        setTotalPrice()
    })

    $('.quantative-event-change').on('input', function(e){
        let quantitive = parseInt($(this).val())
        let idProduct = $(this).attr('id').split('-')[1]

        const price = parseFloat($(`#price-${idProduct}`).text().replace(',', ''))
        const total = (price * quantitive).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        $(`#total-${idProduct}`).text(total)
        setTotalPrice()
        
    })

    function setTotalPrice(){
        const totalItem = $('.shoping__cart__total')
        let totalPrice = 0
        for(let i = 0; i < totalItem.length; i++) {
            totalPrice = totalPrice + parseFloat(totalItem[i].textContent.replace(',',''))
        }
        totalPrice = totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        $('#total-cart-price').text(totalPrice)
    }
    
    $('.icon_close').click(function(e){
        const idProduct = $(this).attr('id').split('-')[1]

        const itemDeleteTotalPrice = parseFloat($(`#total-${idProduct}`).text().replace(',', ''))
        let totalPrice = parseFloat($('#total-cart-price').text().replace(',', ''))
        totalPrice = (totalPrice - itemDeleteTotalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        $('#total-cart-price').text(totalPrice)
        $(`#item-${idProduct}`).remove()        
    })


    $('#update-cart-btn').click(function(e){
        const items = $('.quantative-event-change')
        let itemCart = []
        for(let i = 0; i < items.length; i++){
            const item = {
                idProduct: items[i].getAttribute('id').split('-')[1],
                quantity: items[i].value,
            }
            itemCart.push(item)
        }
        $.ajax({
            type: "POST",
            url: '/shoping-cart/update-cart',
            data: JSON.stringify({items: itemCart}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                window.location.href = '/shoping-cart'
            }
          });             
    })
    


    $('#continue-shoping-btn').click(function(e){
        const items = $('.quantative-event-change')
        let itemCart = []
        for(let i = 0; i < items.length; i++){
            const item = {
                idProduct: items[i].getAttribute('id').split('-')[1],
                quantity: items[i].value,
            }
            itemCart.push(item)
        }
        $.ajax({
            type: "POST",
            url: '/shoping-cart/update-cart',
            data: JSON.stringify({items: itemCart}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                window.location.href = '/shop-grid'
            }
          });             
    })

    $('#checkout-btn').click(function(e){
        e.preventDefault()
        const items = $('.quantative-event-change')
        let itemCart = []
        for(let i = 0; i < items.length; i++){
            const item = {
                idProduct: items[i].getAttribute('id').split('-')[1],
                quantity: items[i].value,
            }
            itemCart.push(item)
        }
        $.ajax({
            type: "POST",
            url: '/shoping-cart/update-cart',
            data: JSON.stringify({items: itemCart}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                window.location.href = '/shoping-cart/checkout'
            }
          });             
    })

    $('#add-to-cart-click-btn').click(function(e){
        e.preventDefault();
        const href = $(this).attr('href')

        const quantity = $('.quantative-event-change').val()
        console.log(quantity)
        $.get( href + `&quantity=${quantity}`, function(res) {
            if(res.number){
                window.location.href = '/shoping-cart'

            } else { window.location.href = '/auth/login'}
          })        
    })

    $('#add-to-loveItem-click-btn').click(function(e){
        e.preventDefault();
        const href = $(this).attr('href')
        console.log(href)
        $.get(href, function(res) {
            if(res.number){
                $.notify("Add to love item sucess!", "success");
            } else { window.location.href = '/auth/login'}
          })        
    })


    $('#comment-btn-click').click(function(){
        const userName = $('#name-user-comment').val()
        const content = $('#content-user-comment').val()
        const numberComment = Number($('#number-comment-product').text())
        let href = window.location.href
        if(href.includes('page=')){
            href = href.substring(0, href.search('page=') - 1)
        }
        const productId = href.split('shop-grid/')[1]
        if(userName === '' || content ===''){
            $.notify("Please enter name and content", "error")
            return
        }
        const comment = {
            userName,
            productId,
            content,
        }
        $.ajax({
            type: "POST",
            url: `${href}/comment`,
            data: JSON.stringify({comment}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                const date = new Date()
                const dateComment = date.getHours() + 'h' + date.getMinutes() + ' - ' + date.getDate() + '/' + (date.getMonth()+1) + '/'+ date.getFullYear();
                $('.comment-product').prepend(`
                    <div class="commented-section mt-2">
                        <div class="d-flex flex-row align-items-center commented-user">
                            <h5 class="mr-2 mb-1" style="font-weight: 650;">${userName}</h5>
                            <span class="dot mb-1"></span>
                            <span class="mb-1 ml-2">${dateComment}</span>
                        </div>
                        <div class="ml-4 comment-text-sm">
                            <span>${content}</span>
                        </div>
                    </div>
                `)
            }
        });

        $('#content-user-comment').val('')
        $('#number-comment-product').text(`${numberComment + 1}`)
    })

    $('#change-password').click(function(e){
        e.preventDefault()
        const oldPassword = $('#oldPassword').val()
        const newPassword = $('#newPassword').val()
        const repeatPassword = $('#repeatPassword').val()
        if(newPassword === '' || repeatPassword === '' || oldPassword == ''){
            return $.notify("Please enter password", "error")
        } else if(newPassword !== repeatPassword) {
            return $.notify("Invalid repeat password", "error")
        } else {
            $('#forget-password-form').submit()
        }
    })


    $('.pagination-click').click(function(e){
        e.preventDefault()
        let href = window.location.href
        if(href.includes('page=')){
            href = href.substring(0, href.search('page=') - 1)
        }
        if(href.includes('?')){
            href = href + '&' + $(this).attr('href')
        } else {
            href = href + '?' + $(this).attr('href')
        }
        window.location.href = href
    })


    $('.btn-apply-click').click(function(e){
        e.preventDefault()
        const minPrice = parseInt($('#minamount').val().replace('$', '')) || 1
        const maxPrice = parseInt($('#maxamount').val().replace('$', '')) || 500
        let href = window.location.href
        if(href.includes('page=')){
            href = href.substring(0, href.search('page=') - 1)
        }
        if(href.includes('minprice=')){
            href = href.substring(0, href.search('minprice=') - 1)
        }
        if(href.includes('?')){
            href = href + '&minprice=' + minPrice + '&maxprice=' + maxPrice
        } else {
            href = href + '?minprice=' + minPrice + '&maxprice=' + maxPrice
        }
        console.log(href)
        window.location.href = href
    })



    $('#update-loveItem-btn').click(function(e){
        const items = $('.love-item-list')
        let itemCart = []
        for(let i = 0; i < items.length; i++){
            const item = {
                idProduct: items[i].getAttribute('id').split('-')[1],
            }
            itemCart.push(item)
        }
        $.ajax({
            type: "POST",
            url: '/shoping-cart/update-loveItem',
            data: JSON.stringify({items: itemCart}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                window.location.href = '/shoping-cart/love-item'
            }
          });             
    })
    


    $('#continue-shoping-love-item-btn').click(function(e){
        const items = $('.love-item-list')
        let itemCart = []
        for(let i = 0; i < items.length; i++){
            const item = {
                idProduct: items[i].getAttribute('id').split('-')[1],
            }
            itemCart.push(item)
        }
        $.ajax({
            type: "POST",
            url: '/shoping-cart/update-loveItem',
            data: JSON.stringify({items: itemCart}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                window.location.href = '/shop-grid'
            }
          });             
    })

    $('.cancle-btn-click').click(function (e) {
        e.preventDefault();
        const idOrder = $(this).parent().attr('id').split('-')[1]
        console.log(idOrder)
        const state = $(`#state-${idOrder}`).text()
        console.log(state)
        if(state !== 'waiting'){
            return $.notify("Cann't cancle order shipping", "error")
        }
        if(confirm("Are you sure cancle ?")){window.location.href = window.location.href + `/cancle-order?orderId=${idOrder}`}
    })

    $('.recieved-btn-click').click(function (e) {
        e.preventDefault();
        const idOrder = $(this).attr('href').split('=')[1]
        const state = $(`#state-${idOrder}`).text()
        if(state !== 'shipping'){
            return $.notify("Cann't do this action now !", "error")
        }
        if(confirm("Did you recieved order?")){window.location.href = window.location.href + `/recieved?orderId=${idOrder}`}
    })
    
})(jQuery);



