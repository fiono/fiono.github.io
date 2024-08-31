$(function() {

    var spider = $("#spider");
    var fly = $("#fly");
    var bee = $("#bumblebee");
    var flowers = [{x: "80", y: "460"}, {x: "180", y: "300"}, {x: "280", y: "200"}]; // {x: "5", y: "30"}];

    function maybeFlip(elem, bool) {
        if (bool) {
            elem.addClass("flipped");
        } else {
            elem.removeClass("flipped");
        }
    }

    // is this bored?
    function prob(threshold) {
        return (Math.random() < threshold);
    }

    function spiderShuffle() {
        if (prob(.07)) {
            window.setTimeout(spiderShuffle, (Math.random() * 30000));
        } else {
            spider.animate({
                "left": "+=" + Math.random() * 15,
                "top": (prob(.45) ? "+=" : "-=") + Math.random() * 5
            }, 50, function() {
                spiderShuffle();
            });
        }
    }

    function checkSpider() {
        var spiderBuf = 50;
        var spiderBox = spider.get(0).getBoundingClientRect();
        var flyBox = fly.get(0).getBoundingClientRect();

        return (flyBox.bottom > (spiderBox.top + spiderBuf)
                && flyBox.top < (spiderBox.bottom - spiderBuf)
                && flyBox.right > (spiderBox.left + 200) // spiders don't eat with their butt
                && flyBox.left < (spiderBox.right)
        );
    }

    function flyFly(xdir, ydir) {
        if (prob(.005)) {
            window.setTimeout(flyFly, (Math.random() * 6000), !xdir, !ydir);
        } else {
            if (checkSpider()) {
                fly.hide();
                spider.animate({"left": "+=25"}, 400);
            } else {
                maybeFlip(fly, xdir);

                var xpos = parseInt(fly.css("left"));
                var ypos = parseInt(fly.css("top"));
                var bwidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                var bheight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

                xdir = (xpos < 0) ? true : ((xpos > bwidth) ? false : (prob(.03) ? !xdir : xdir));
                ydir = (ypos < 0) ? true : ((ypos > bheight) ? false : (prob(.03) ? !ydir : ydir));

                var rand = Math.random() * 10;
                fly.animate({
                    "left": xdir ? xpos + rand : xpos - rand,
                    "top": (ydir ? "+=" : "-=") + Math.random() * 10
                }, 2, function() {
                    flyFly(xdir, ydir)
                });
            }
        }
    }

    function getFlower() {
        return flowers[Math.floor(Math.random() * flowers.length)];
    }

    function buzzTo(flower, buzzTime) {
        var xpos = parseInt(bee.css("left"));
        var ypos = parseInt(bee.css("top"));

        var atFlower = (Math.abs(xpos - flower.x) < 10 && Math.abs(ypos - flower.y) < 10);

        if (atFlower && buzzTime > 500) {
            buzzTo(getFlower(), 0);
        } else {
            buzzTime++;
            maybeFlip(bee, ((xpos - 5) > flower.x && !atFlower));

            bee.animate({
                "left"  : ((xpos > flower.x) ? "-=" : "+=") + Math.random() * 5,
                "top"   : ((ypos > flower.y) ? "-=" : "+=") + Math.random() * 5
            }, 10, function() {
                buzzTo(flower, buzzTime);
            });
        }
    }

    spiderShuffle();
    flyFly(true, true);
    buzzTo(getFlower(), 0);

});
