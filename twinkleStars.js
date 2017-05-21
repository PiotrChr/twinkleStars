    $.fn.twinkleStars = function(options) {
        let settings = $.extend({
            width: $(this).width(),
            height: $(this).height(),
            density: 5,
            timespan: 2,
            blinkSpeed: 0.5,
            gap: 1,
            container: this,
            moveWithCursor: true,
            moveFactor: 5,
            starsContainerId: 'twinkleStars'
        }, options );

        let twinkleStarsC = new TwinkleStarsClass(settings);

        if (settings.moveWithCursor === true) {
            $(settings.container).on('mousemove',twinkleStarsC.iLikeToMoveIt);
        }

        return this;
    };

    function TwinkleStarsClass(options) {
        this.twinkles = [];
        this.stars = [];
        self = this;

        this.settings = $.extend({
            width: 100,
            height: 100,
            density: 5,
            timespan: 2,
            blinkSpeed: 0.5,
            easing: 'smoothmove',
            gap: 1,
            starsContainerId: 'twinkleStars',
            stars: [
                'gfx/stars/small1.png',
                'gfx/stars/small2.png',
                'gfx/stars/mid1.png',
                'gfx/stars/mid2.png'
            ]
        }, options );

        if ($.easing[this.settings.easing] !== 'function') {
            console.error('Easing: ' + this.settings.easing + ' not found. Are you sure jquery-ui is included?');
            this.settings.easing = undefined;
        }

        for (let i=0;i<this.settings.stars.length;i++) {
            let image = $(new Image()).attr({
                'src' : self.settings.stars[i],
                'class': 'twinkleStar'
            });
            self.stars.push(image);
        }

        $(self.settings.container).append($('<div />').attr({
            id: self.settings.starsContainerId
        }));

        this.on();

    }

    TwinkleStarsClass.prototype.twinkle = function(timespan,blinkspeed) {

        const self = this;
        let twink = setInterval(function() {
            const id = 'star_' + getRandomInt(0, 999999);
            let pos = self.getRandomXY();

            let star = $(self.stars[getRandomInt(0,self.stars.length - 1)]).clone(true);
            star.attr({
                'id' : id,
                'posleft': pos[0],
                'postop': pos[1]
            }).css({
                'position' : 'absolute',
                'top' : pos[1] + 'px',
                'left' : pos[0] + 'px'
            }).appendTo('#' + self.settings.starsContainerId).fadeIn(blinkspeed * 1000, function() {
                var that = this;
                setTimeout(function() {
                    $(that).fadeOut(blinkspeed * 1000, function() {
                        $(that).remove();
                    });
                }, timespan * 1000);
            });
        }, timespan * 1000 + 2 * blinkspeed);
        self.twinkles.push(twink);
    };

    TwinkleStarsClass.prototype.removeTwinks = function(amount) {
        if (amount > this.twinkles.length) {
            amount = this.twinkles.length;
        }

        for (i=0;i<amount;i++) {
            clearInterval(this.twinkles[this.twinkles.length - 1]);
            this.twinkles.pop();
        }
    };

    TwinkleStarsClass.prototype.addTwinks = function(amount) {
        for (let i=0;i<amount;i++) {
            setTimeout(function() {
                self.twinkle(self.settings.timespan, self.settings.blinkSpeed);
            }, getRandomInt(0, 1500));
        }
    };

    TwinkleStarsClass.prototype.getRandomXY = function() {
        return [getRandomInt(0, this.settings.width),getRandomInt(0, this.settings.height)];
    };

    TwinkleStarsClass.prototype.getRandomStarKey = function() {
        return getRandomInt(0,this.settings.stars.length);
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    TwinkleStarsClass.prototype.iLikeToMoveIt = function(e) {

        const strength = self.settings.moveFactor;
        let x = e.pageX;
        let y = e.pageY;
        let movementX = (x - $(window).width()/2)/strength * -1;
        let movementY = (y - $(window).height()/2)/strength * -1;

        $('#' + self.settings.starsContainerId).animate({
            top: parseInt(movementY) + 'px',
            left: parseInt(movementX) + 'px'
        }, {queue:false,duration:1000,easing: self.settings.easing});

        //var stars = $('#' + self.settings.starsContainerId).find('img');

		/*$.each(stars, function(k,star) {
		 var posX = parseInt($(star).attr('posleft'));
		 var posY = parseInt($(star).attr('postop'));
		 $(star).animate({
		 top: parseInt(posY + movementY) + 'px',
		 left: parseInt(posX + movementX) + 'px'
		 }, {queue:false,duration:1000,easing:'smoothmove'});
		 })
		 */


    };

    TwinkleStarsClass.prototype.on = function() {
        this.addTwinks(this.settings.density);
    };

    TwinkleStarsClass.prototype.off = function() {
        this.removeTwinks(this.twinks.length);
    };
