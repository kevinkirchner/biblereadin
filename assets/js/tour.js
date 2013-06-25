$(function(){

    var $tip;
    var tipCount = 0;
    var pConfig = {
        html: true,
        placement: IS_MOBILE ? 'bottom' : 'right',
        trigger: 'manual',
        container: 'body > header',
    };
    var $logNav = $readNav.find('#log');
    var $bookmarkNav = $readNav.find('#bookmarks');
    var $planNav = $readNav.find('#reading_plans');

    function wireClose(){
        $header.find('.popover-title a').on('click', closeTour);
    }
    function closeTour(){
        if (arguments.length) {
            arguments[0].preventDefault();
        }
        $navTop.removeClass('hover');
        $header.find('.popover').hide();
        SHOWING_TOUR = false;
        $('body').removeClass('showing-tour');
        return false;
    }
    
    function switchReadNav(navItem) {
        SHOWING_TOUR = false;
        $('.read-nav a[rel="show-nav"]').eq( navItem ).trigger('click');
        SHOWING_TOUR = true;
    }

    function wireTip(){
        switch (tipCount++) {
        case 0:
            SHOWING_TOUR = true;
            $('body').addClass('showing-tour');
            // Button to show  Read Nav > Log 1
            $tip = $logNav.find('li.unread a').eq(1);
            pConfig.title = "<i class='icon-list'></i> Your Readin' Log <a href='#close'><i class='icon-remove'></i></a>";
            pConfig.content = "<p>When you have something to read today, it's marked in <span class='label white'>white text.</span></p><p>&nbsp;</p><p>Passages you've already read are in <span class='label gray'>gray text.</span></p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
            $tip.popover(pConfig);
            $readNav.addClass('hover');
            $tip.popover('show');
            wireTip();
            wireClose();
            break;
        case 1:
            TOUR_STEP = 'log';
            // Button to show  Read Nav > Bookmarks
            $header.find('.popover-content .btn').on('click',function(e){
                e.preventDefault();
                $tip.popover('hide');
                switchReadNav(1);
                $tip = $bookmarkNav.find('a').eq(1);
                pConfig.title = "<i class='icon-bookmark'></i> Your Bookmarks <a href='#close'><i class='icon-remove'></i></a>";
                pConfig.content = "<p>Here's a list of your bookmarked verses. We'll show you how to add bookmarks in a second. ;)</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                $tip.popover(pConfig).popover('show');
                wireTip();
                wireClose();
                return false;
            });
            break;
        case 2:
            TOUR_STEP = 'bookmark';
            // Button to show Read Nav > Calendar
            $header.find('.popover-content .btn').on('click',function(e){
                e.preventDefault();
                $tip.popover('hide');
                switchReadNav(2);
                $tip = $planNav.find('li').eq(1);
                pConfig.title = "<i class='icon-calendar'></i> Your Readin' Plans <a href='#close'><i class='icon-remove'></i></a>";
                pConfig.content = "<p>Find a readin' plan you want, and press the power icon (<i class='icon-power-off'></i>) to activate it. We've activated the first one for you. ;)</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                $tip.popover(pConfig).popover('show');
                wireTip();
                wireClose();
                return false;
            });
            break;
        case 3:
            TOUR_STEP = 'plans1';
            // Button to show Read Nav > Calendar
            $header.find('.popover-content .btn').on('click',function(e){
                e.preventDefault();
                $tip.popover('hide');
                $tip = $planNav.find('li').eq(0);
                pConfig.title = "<i class='icon-calendar'></i> Your Readin' Plans <a href='#close'><i class='icon-remove'></i></a>";
                pConfig.content = "<p>You can even create your own readin' plan!</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                $tip.popover(pConfig).popover('show');
                wireTip();
                wireClose();
                return false;
            });
            break;
        case 4: 
            TOUR_STEP = 'plans2';
            $header.find('.popover-content .btn').on('click',function(e){
                e.preventDefault();
                $tip.popover('hide');
                $readNav.find('li[id]').hide();
                $readNav.find('.actions a').removeClass('hover');
                $tip = $readNav.find('.actions a').last().addClass('hover');
                pConfig.title = "<i class='icon-random'></i> Load random passage <a href='#close'><i class='icon-remove'></i></a>";
                pConfig.placement = "bottom";
                var oldTitle = $tip.attr('title');
                $tip.attr('title', pConfig.title);
                pConfig.title = "<i class='icon-calendar'></i> Your Readin' Plans <a href='#close'><i class='icon-remove'></i></a>";
                pConfig.content = "<p>Click the random button (<i class='icon-random'></i>) to load a random chapter of the Bible to start readin'.</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                $tip.popover(pConfig).popover('show');
                $tip.attr('title', oldTitle);
                wireTip();
                wireClose();
                return false;
            });
            break;
        case 5: 
            TOUR_STEP = 'random';
            $header.find('.popover-content .btn').on('click',function(e){
                e.preventDefault();
                $tip.popover('hide');
                $tip = $searchNav.find('.sub');
                $readNav.add($searchNav).toggleClass('hover');
                pConfig.title = "<i class='icon-search'></i> Searchin' the Bible <a href='#close'><i class='icon-remove'></i></a>";
                pConfig.content = "<p>Just start typing. You can search for a verse, verses, a chapter, or a combo of the three&mdash;just separate each with a semi-colon (;)</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                pConfig.animation = false;
                $tip.popover(pConfig).popover('show');
                $search.focus();
                $search.on('keyup', function(){
                    $tip.popover('show');
                    tipCount = 6;
                    wireTip();
                })
                wireTip();
                wireClose();
                return false;
            });
            break;
        case 6: 
            TOUR_STEP = 'search';
            $header.find('.popover-content .btn').on('click',function(e){
                e.preventDefault();
                $tip.popover('hide');
                $tip = $tweakNav.find('.sub');
                $searchNav.add($tweakNav).toggleClass('hover');
                pConfig.title = "<i class='icon-cog'></i> Tweak <a href='#close'><i class='icon-remove'></i></a>";
                pConfig.content = "<p>Here you can tweak the site's appearance to make it easier on your eyes.</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                pConfig.placement = "bottom";
                $tip.popover(pConfig).popover('show');
                wireTip();
                wireClose();
                return false;
            });
            break;
        case 7: 
            TOUR_STEP = 'tweak';
            $header.find('.popover-content .btn').on('click',function(e){
                e.preventDefault();
                $tip.popover('hide');
                $tip = $shareNav.find('.sub');
                $tweakNav.add($shareNav).toggleClass('hover');
                pConfig.title = "<i class='icon-share'></i> Share <a href='#close'><i class='icon-remove'></i></a>";
                pConfig.content = "<p>Share what you've been readin', share your feedback, or share some <i class='icon-dollar'></i> to cover web hosting and development costs! </p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                pConfig.placement = "bottom";
                $tip.popover(pConfig).popover('show');
                wireTip();
                wireClose();
                return false;
            });
            break;
        case 8: 
            TOUR_STEP = 'share';
            $header.find('.popover-content .btn').on('click',function(e){
                e.preventDefault();
                $tip.popover('hide');
                $shareNav.removeClass('hover');
                $('#tour_interface').modal({
                    backdrop: 'static'
                });
                return false;
            });
            break;
        default:
            closeTour();
        }
        amplify.store('tour', 'step-'+tipCount);
    }

})(jQuery);