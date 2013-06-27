var BR;
var displayPassages;
var bible = {
    allBooks: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Ester","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"],
    otBooks: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Ester","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"],
    ntBooks: ["Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"],
    otLaw: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy"],
    otHistory: ["Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Ester"],
    otPoetry: ["Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon"],
    otMajor: ["Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel"],
    otMinor: ["Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"],
    ntGospels: ["Matthew","Mark","Luke","John"],
    ntHistory: ["Acts"],
    ntPaulsLetters: ["Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon"],
    ntGeneralLetters: ["Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude"],
    ntProphecy: ["Revelation"],
    chapterCount: {"Genesis":50,"Exodus":40,"Leviticus":27,"Numbers":36,"Deuteronomy":34,"Joshua":24,"Judges":21,"Ruth":4,"1 Samuel":31,"2 Samuel":24,"1 Kings":22,"2 Kings":25,"1 Chronicles":29,"2 Chronicles":36,"Ezra":10,"Nehemiah":13,"Esther":10,"Job":42,"Psalms":150,"Proverbs":31,"Ecclesiastes":12,"Song of Songs":8,"Isaiah":66,"Jeremiah":52,"Lamentations":5,"Ezekiel":48,"Daniel":12,"Hosea":14,"Joel":3,"Amos":9,"Obadiah":1,"Jonah":4,"Micah":7,"Nahum":3,"Habakkuk":3,"Zephaniah":3,"Haggai":2,"Zechariah":14,"Malachi":4,"Matthew":28,"Mark":16,"Luke":24,"John":21,"Acts":28,"Romans":16,"1 Corinthians":16,"2 Corinthians":13,"Galatians":6,"Ephesians":6,"Philippians":4,"Colossians":4,"1 Thessalonians":5,"2 Thessalonians":3,"1 Timothy":6,"2 Timothy":4,"Titus":3,"Philemon":1,"Hebrews":13,"James":5,"1 Peter":5,"2 Peter":3,"1 John":5,"2 John":1,"3 John":1,"Jude":1,"Revelation": 22}
};

// this is a small helper extension i stole from
// http://www.texotela.co.uk/code/jquery/reverse/
// it merely reverses the order of a jQuery set.
$.fn.reverse = function() {
    return this.pushStack(this.get().reverse(), arguments);
};

// create two new functions: prevALL and nextALL. they're very similar, hence this style.
$.each( ['prev', 'next'], function(unusedIndex, name) {
    $.fn[ name + 'ALL' ] = function(matchExpr) {
        // get all the elements in the body, including the body.
        var $all = $('body').find('*').andSelf();

        // slice the $all object according to which way we're looking
        $all = (name == 'prev')
            ? $all.slice(0, $all.index(this)).reverse()
            : $all.slice($all.index(this) + 1)
        ;
        // filter the matches if specified
        if (matchExpr) $all = $all.filter(matchExpr);
        return $all;
    };
});

(function($,window,document,undefined){

    BR = {
        _e: {
            $navTop: $('#nav .top'),
            $header: $('body > header'),
            $main: $('body > main'),
            $toggleSubNavLinks: $('a[rel="show-nav"]'),
            $psgLink: $('a[rel="psg-link"]'),
            read: {
                $nav: $('.read-nav'),
                $rand: $('a[rel="random"]')
            },
            search: {
                $nav: $('.search-nav'),
                $input: $('#search'),
                $form: $('#search_form')
            },
            tweak: {
                $nav: $('.tweak-nav'),
                $themeLink: $('.theme-link'),
                $fontLink: $('.font-link')
            },
            share: {
                $nav: $('.share-nav')
                $twitter: $('a.twitter-link'),
                $facebook: $('a.facebook-link'),
                $email: $('a.email-link')
            }
        },
        _f: {
            showingTour: false,
            tourStep: '',
            currentPassage: null,
            hasStorage: null,
            isMobile: false,
            lastTheme: 'light',
            savedTheme: 'light',
            lastFont: 'sans',
            savedFont: 'sans'
        },
        _s: amplify.store(),
        /**
         * TODO: add today's first reading plan to initial passage load fallback
         * @returns BR object
         */
        init: function(){
            var that = this;

            // set some flags and other init things
            that._f.isMobile = that._e.css('position') == 'static';
            that._f.savedTheme = that._s.theme || that._f.savedTheme;
            that._f.savedFont = that._s.font || that._f.savedFont;
            displayPassages = that.displayPassages;

            // Load first passage
            that.loadPassage( that.getURLParameter('psg') || that.getRandomPassage() );

            // Attach Events
            that.attachEvents();

            // Show saved tweaks
            // TODO

            return that;
        },
        /**
         * == Setting Events Methods ==================================
         */
        attachEvents: function(){
            var that = this;
            that.killHashLinkEvent();
            that.navHoverEvent();
            that.toggleSubNavEvent();
            that.randomPassageLinkEvent();
            that.themeLinkEvent();
            that.fontLinkEvent();
            that.searchAutocompleteEvent();
            that.searchSubmitEvent();
            that.searchInitEvent();
            that.passageLinkEvent();
            that.markReadOnScrollEvent();
        },
        navHoverEvent: function(){
            var that = this;
            that._e.$navTop.('mouseenter', function(){
                if (SHOWING_TOUR && TOUR_STEP != 'search') return;
                var el = $(this);
                that._e.$navTop.trigger('mouseleave');
                el.addClass('hover');
                if (el.hasClass('search-nav')) {
                    that._e.search.$input.trigger('focus');
                }
            }).on('mouseleave', function(){
                if (SHOWING_TOUR) return;
                $(this).removeClass('hover');
            });
        },
        randomPassageLinkEvent: function(){
            var that = this;
            that._e.read.$rand.on('click',function(e){
                e.preventDefault();
                var psg = that.getRandomPassage();
                that.loadPassage( psg );
                if (SHOWING_TOUR) return;
                $(this).parents('.top').removeClass('hover');
                return false;
            });
        },
        toggleSubNavEvent: function(){
            var that = this;
            that._e.$toggleSubNavLinks.on('click', function(){
                if (SHOWING_TOUR) return;
                var el = $(this);
                var navSelector = el.attr('href');
                var shownNav = that._e.read.$nav.find('.inner-sub > li:visible:not(.actions)');
                if (navSelector != '#'+shownNav.attr('id')) {
                    $(navSelector).add(shownNav).toggle();
                    that._e.read.$nav.find('.hover').removeClass('hover');
                    el.addClass('hover')
                }
            });
        },
        themeLinkEvent: function(){
            var that = this;
            that._e.tweak.$themeLink.on('click', function(e) {
                e.preventDefault();
                var el = $(this);
                var themeColor = el.data('theme-color');
                $('body').removeClass(lastTheme).addClass( themeColor );
                lastTheme = themeColor;
                amplify.store('theme',themeColor);
                if (SHOWING_TOUR) return;
                $(this).parents('.top').removeClass('hover');
                return false;
            });
        },
        fontLinkEvent: function(){
            var that = this;
            that._e.tweak.$fontLink.on('click', function(e) {
                e.preventDefault();
                var el = $(this);
                var font = el.data('font');
                $('body').removeClass(lastFont).addClass( font );
                lastFont = font;
                amplify.store('font',font);
                if (SHOWING_TOUR) return;
                $(this).parents('.top').removeClass('hover');
                return false;
            });
        },
        searchAutocompleteEvent: function(){
            this._e.search.$input.typeahead({
                source: bible.allBooks
            });
        },
        searchSubmitEvent: function(){
            var that = this;
            that._e.search.$form.on('submit',function(e){
                e.preventDefault();
                if (!SHOWING_TOUR) that._e.search.$nav.removeClass('hover');
                var psg = that._e.search.$input.val();
                that.loadPassage( psg ).complete(function(){
                    that._e.search.$input.val('');
                });
            })
        },
        searchInitEvent: function(){

        },
        passageLinkEvent: function(){

        },
        markReadOnScrollEvent: function(){

        },
        killHashLinkEvent: function(){

        },
        /**
         * TODO: add sharin' and bookmarkin' ability
         * TODO: on double click, add note takin' ability
         */
        attachVerseEvents: function() {
            var that = this;
            that._e.$main.click(function(e){
                var span = $(e.target);
                var b = span.prevALL('b[id]').first();
                var p = b.data();
                console.log(p);
                span.toggleClass('clicked');
            });
        },
        /**
         * == Passage Methods =================================
         */
        /**
         * get a given passage and run the callback displayPassages
         * @param psg
         * @returns $.ajax object
         */
        loadPassage: function(psg) {
            return $.ajax({
                url: "http://labs.bible.org/api/",
                data: {type:'json', callback: 'displayPassages', formatting:'para', passage: psg },
                cache: false,
                dataType: "jsonp"
            });
        },
        /**
         * Format the passages that were returned from the API and attach verse events
         * TODO: add verse/passage reference if loading specific ones (use _f.currentPassage)
         * @param passages
         */
        displayPassages: function(passages){
            var that = this;
            var plength = passages.length;
            var curBook = '';
            var curChapter = '';
            var txt = '';
            for (var i = 0; i < plength; i++) {
                var p = passages[i];
                if (p.bookname != curBook && p.chapter != curChapter) {
                    // add heading
                    txt += '<h2 id="'+p.bookname.toLowerCase().replace(' ','_')+'_'+p.chapter.toLowerCase()+'">'+p.bookname+' '+p.chapter+'</h2>'

                    // if title, add it
                    if (p.title) {
                        txt += '<h4><i>'+p.title+'</i></h4>';
                    }
                    // Add text
                    txt += formatPassage(p);

                    curBook = p.bookName;
                    curChapter = p.chapter;
                } else {
                    // Add to the passage that already exists
                    // if title, add it
                    if (p.title) {
                        txt += '<div class="spacer"></div><h4><i>'+p.title+'</i></h4>';
                    }
                    // Add text
                    txt += formatPassage(p);
                }
            }
            // Add txt to last main
            that._e.$main.html( txt );
            that.attachVerseEvents();
        },
        /**
         * add verse numbers and wrap each verse in spans to allow for bookmarkin', sharin', and note takin'
         * TODO: [Optional] put b tags inside of paragraphs and inside spans
         * @param p
         * @returns {string}
         */
        formatPassage: function(p){
            var closingPos = p.text.indexOf('</');
            var openingPos = p.text.indexOf('">');
            var ptext = p.text.replace('">','"><span>');
            var txt = ptext.replace('</','</span></');
            // if end tag was replaced, then prepend verse with open span
            var oSpan = txt!=ptext ? '<span>' : '';
            // if open tag was replaced, then append verse with closing span
            var cSpan = ptext!=p.text ? '</span>' : '';
            // if end AND open tag as replaced AND a closing tag is not before an opening tag, don't do anything
            if (txt!=ptext && ptext!=p.text) {
                // if (closingPos > -1 && openingPos > -1 && closingPos > openingPos) {
                oSpan = cSpan = '';
                // if end AND open tag were NOT replaced, wrap the verse in a span
            } else if (txt == p.text) {
                oSpan = '<span>';
                cSpan = '</span>';
            }
            return '<b id="'+p.bookname.toLowerCase().replace(' ','_')+'_'+p.chapter+'_'+p.verse+'" data-bookname="'+p.bookname+'" data-chapter="'+p.chapter+'" data-verse="'+p.verse+'">'+p.verse+'</b> '+oSpan+txt+cSpan+' ';
        },
        /**
         * Get a random book and a random chapter from that book
         * @returns {string}
         */
        getRandomPassage: function(){
            var rand = Math.floor(Math.random()*bible.allBooks.length)+1;
            var book = bible.allBooks[rand];
            var ch = Math.floor(Math.random()*bible.chapterCount[book])+1;
            return book+' '+ch;
        },
        /**
         * == After Action Methods =====================================
         */
        /**
         * TODO: set social links off of _f.currentPassage
         */
        setSocialLinks: function() {

        },
        /**
         * == Storage Methods =======================================
         */
        /**
         * check if there's any amplify storage stored
         * @returns {bool}
         */
        hasStorage: function(){
            var that = this;
            if (that._f.hasStorage == null) {
                var i = 0;
                for(keys in amplify.store()) i++;
                that._f.hasStorage = i > 0;
            }
            return that._f.hasStorage;
        },
        /**
         * clear the amplify storage
         */
        clearStorage: function(){
            if(confirm("Remove all your readin' info?")) {
                for (v in amplify.store()) {
                    amplify.store(v,null);
                }
            }
        }
        /**
         * == Utility Methods ============================================
         */
        getURLParameter: function(name){
            var reg = RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [];
            if (reg.length >= 2) {
                return decodeURI( reg[1] );
            }
            return false;
        },
        /**
         * Create a string of 4 random alphanumeric characters
         * @returns {string}
         */
        s4: function(){
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        },
        /**
         * Create a 32bit random unique identifier
         * @returns {string}
         */
        guid: function(){
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

    };

    // Initialize App
    BR.init();



    BR_TOUR = {
        _e: {
            modal: {
                $tour: $('#tour'),
                $startTourLink: $('a[rel="tour]"'),
                $noTourLink: $('a[rel="no-tour"]')
            }
        },
        init: function(){

        }
    }
    // If no record of visit, run the tour
    if (!BR.hasStorage()) {
        BR_TOUR.init();
    }

})(jQuery,this,document);