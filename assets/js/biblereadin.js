var BR;
var displayPassages;
var bible = {
    allBooks: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Songs","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"],
    otBooks: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Songs","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"],
    ntBooks: ["Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"],
    otLaw: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy"],
    otHistory: ["Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther"],
    otPoetry: ["Job","Psalms","Proverbs","Ecclesiastes","Song of Songs"],
    otMajor: ["Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel"],
    otMinor: ["Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"],
    ntGospels: ["Matthew","Mark","Luke","John"],
    ntHistory: ["Acts"],
    ntPaulsLetters: ["Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon"],
    ntGeneralLetters: ["Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude"],
    ntProphecy: ["Revelation"],
    chapterCount: {"Genesis":50,"Exodus":40,"Leviticus":27,"Numbers":36,"Deuteronomy":34,"Joshua":24,"Judges":21,"Ruth":4,"1 Samuel":31,"2 Samuel":24,"1 Kings":22,"2 Kings":25,"1 Chronicles":29,"2 Chronicles":36,"Ezra":10,"Nehemiah":13,"Esther":10,"Job":42,"Psalms":150,"Proverbs":31,"Ecclesiastes":12,"Song of Songs":8,"Isaiah":66,"Jeremiah":52,"Lamentations":5,"Ezekiel":48,"Daniel":12,"Hosea":14,"Joel":3,"Amos":9,"Obadiah":1,"Jonah":4,"Micah":7,"Nahum":3,"Habakkuk":3,"Zephaniah":3,"Haggai":2,"Zechariah":14,"Malachi":4,"Matthew":28,"Mark":16,"Luke":24,"John":21,"Acts":28,"Romans":16,"1 Corinthians":16,"2 Corinthians":13,"Galatians":6,"Ephesians":6,"Philippians":4,"Colossians":4,"1 Thessalonians":5,"2 Thessalonians":3,"1 Timothy":6,"2 Timothy":4,"Titus":3,"Philemon":1,"Hebrews":13,"James":5,"1 Peter":5,"2 Peter":3,"1 John":5,"2 John":1,"3 John":1,"Jude":1,"Revelation": 22}
};

// prevent selecting text
$.fn.disableSelection = function() {
    return this
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);
};
$.fn.enableSelection = function() {
    return this
        .removeAttr('unselectable')
        .css('user-select', 'auto')
        .on('selectstart', true);
};

(function($,window,document,undefined){

    BR = {
        _e: {
            $w: $(window),
            $navTop: $('#nav .top'),
            $body: $('body'),
            $header: $('body > header'),
            $main: $('body > main'),
            $toggleSubNavLinks: $('a[rel="show-nav"]'),
            $psgLink: $('a[rel="psg-link"]'),
            read: {
                $nav: $('.read-nav'),
                $rand: $('a[rel="random"]'),
                $logNav: $('.read-nav #log'),
                $bookmarkNav: $('.read-nav #bookmarks'),
                $planNav: $('.read-nav #reading_plans')
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
                $nav: $('.share-nav'),
                $twitter: $('a.twitter-link'),
                $facebook: $('a.facebook-link'),
                $email: $('a.email-link')
            },
            modal: {
                $tour: $('#tour'),
                $startTourLink: $('a[rel="tour"]'),
                $noTourLink: $('a[rel="no-tour"]')
            }
        },
        _f: {
            showingTour: false,
            tourStep: amplify.store('tour') || '',
            currentPassage: {
                psg: '',
                bookname: [],
                chapter: [],
                verse: []
            },
            selectedPassage: {
                psg: '',
                bookname: [],
                chapter: [],
                verse: []
            },
            hasStorage: null,
            isMobile: false,
            lastTheme: 'light',
            savedTheme: 'light',
            lastFont: 'sans',
            savedFont: 'sans',
            scrollPaused: 0,
            scrollBottom: 0,
            scrollDepth: 0,
            readOffset: 100,
            tipCount:0,
            tipTotal: 6
        },
        _s: amplify.store(),
        /**
         * TODO: add today's first reading plan to initial passage load fallback
         * @returns BR object
         */
        init: function(){
            var that = this;

            // set some flags and other init things
            that._f.isMobile = that._e.$navTop.css('position') == 'static';
            that._f.savedTheme = that._s.theme || that._f.savedTheme;
            that._f.savedFont = that._s.font || that._f.savedFont;
            displayPassages = that.displayPassages;

            // Load first passage
            that.loadPassage( that.getURLParameter('psg') || that.getRandomPassage() );

            // Attach Events
            that.attachEvents();

            // Show saved tweaks
            if (that._s.theme != 'light') {
                setTimeout(function(){
                    that._e.tweak.$themeLink.filter('[data-theme-color="'+that._s.theme+'"]').trigger('click');
                }, 1000);
            }
            if (that._s.font != 'sans') {
                setTimeout(function(){
                    that._e.tweak.$fontLink.filter('[data-font="'+that._s.font+'"]').trigger('click');
                }, 1200);
            }

            return that;
        },
        /**
         * == Setting Events Methods ==================================
         */
        /**
         * TODO: Mark as read when reaching the bottom of the passage
         */
        attachEvents: function(){
            var that = this;

            that.navHoverEvent();
            that.toggleSubNavEvent();
            that.randomPassageLinkEvent();
            that.themeLinkEvent();
            that.fontLinkEvent();
            that.searchAutocompleteEvent();
            that.searchSubmitEvent();
            that.searchInitEvent();
            that.passageLinkEvent();
            that.killHashLinkEvent();
            that.watchForTypingEvent();

            that._e.$w.on('scroll', function(){
                var st = that._e.$w.scrollTop();
                var wh = that._e.$w.height();
                var dh = $(document).height();
                if (st+wh == dh) {
                    clearTimeout(that._f.scrollBottom);
                    that._f.scrollBottom = setTimeout(function(){ that.markChapterAsRead(); },2000)
                    return;
                }
                return;
                if (st > that._f.scrollDepth) {
                    clearTimeout(that._f.scrollPaused);
                    that._f.scrollPaused = setTimeout(function(){ that.markReadOnScrollEvent() }, 500);
                }
            });

            $(document).on('keydown',function(e){
                if(e.shiftKey) that._e.$main.disableSelection();
            }).on('keyup',function(){
                that._e.$main.enableSelection();
            })
        },
        navHoverEvent: function(){
            var that = this;
            var showSubNav = function(el) {
                that._e.$navTop.removeClass('hover');
                el.addClass('hover');
            }

            that._e.$navTop.on('mouseenter', function(e){
                if (that._f.showingTour && that._f.tourStep != 'search') return;
                var el = $(this);
                showSubNav(el);
                if (el.hasClass('search-nav')) {
                    that._e.search.$input.trigger('focus');
                } else {
                    that._e.search.$input.trigger('blur');
                }
            }).on('mouseleave', function(e){
                if (that._f.showingTour) return;
                $(this).removeClass('hover');
            });

            that._e.search.$nav.off('mouseenter');

            var searchInFocus = false;
            that._e.search.$nav.find('> a').on('click', function(e){
                var el = $(this).parent();
                showSubNav(el);
                if (el.hasClass('search-nav')) {
                    that._e.search.$input.trigger('focus');
                }
            });

            that._e.search.$input.on('focus', function(e){
                searchInFocus = true;
            }).on('blur', function(e){
                searchInFocus = false;
                setTimeout(function(){
                    if(!searchInFocus) {
                        that._e.search.$nav.removeClass('hover');
                    }
                }, 250);
            });

            $(document).on('click', function(e){
                if (that._e.$navTop.has(e.target).length === 0) {
                    that._e.$navTop.removeClass('hover');
                }
            });


        },
        randomPassageLinkEvent: function(){
            var that = this;
            that._e.read.$rand.on('click',function(e){
                e.preventDefault();
                var psg = that.getRandomPassage();
                that.loadPassage( psg );
                if (that._f.showingTour) return;
                $(this).parents('.top').removeClass('hover');
                return false;
            });
        },
        toggleSubNavEvent: function(){
            var that = this;
            that._e.$toggleSubNavLinks.on('click', function(){
                if (that._f.showingTour) return;
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
                $('body').removeClass(that._f.lastTheme).addClass( themeColor );
                that._f.lastTheme = themeColor;
                amplify.store('theme',themeColor);
                if (that._f.showingTour) return;
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
                $('body').removeClass(that._f.lastFont).addClass( font );
                that._f.lastFont = font;
                amplify.store('font',font);
                if (that._f.showingTour) return;
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
                if (!that._f.showingTour) that._e.search.$nav.removeClass('hover');
                var psg = that._e.search.$input.val();
                that.loadPassage( psg ).complete(function(){
                    that._e.search.$input.val('');
                });
            })
        },
        searchInitEvent: function(){
            var that = this;
            that._e.search.$input.typeahead({
                source: bible.allBooks
            });
        },
        passageLinkEvent: function(){
            var that = this;
            that._e.$psgLink.on('click',function(e){
                if($('[data-click-priority]').has(e.target).length === 0) {
                    var el = $(this);
                    if(el.parents('.top').size()) el.parents('.top').removeClass('hover');
                    that.loadPassage( el.data('psg') );
                }
            })
        },
        /**
         * TODO: store read data and use it on load
         */
        markReadOnScrollEvent: function(){
            var that = this;
            var st = that._e.$w.scrollTop();
            that._e.$main.find('span[id]:not([data-read="true"])').each(function(){
                var el = $(this);
                if (el.offset().top + that._f.readOffset < st) {
                    that._f.scrollDepth = st;
                    el.attr('data-read',"true").addClass('read');
                } else {
                    return;
                }
            });
        },
        markChapterAsRead: function(){
            var that = this;
            var st = that._e.$w.scrollTop();
            var wh = that._e.$w.height();
            var dh = $(document).height();
            if (st+wh == dh) {
                that.toggleChapterRead(true)
            }
        },
        toggleChapterRead: function(markRead){
            var that = this;
            var curDate = new Date();
            var curDateFormatted = (curDate.getMonth()+1) + '.' + curDate.getDate() + '.' + (curDate.getFullYear() + '').substr(2);
            var psg = that._f.currentPassage.psg;
            var logItem = {
                psg: psg,
                logDate: curDateFormatted
            };
            var log = that._s.log || [];
            var logRead = that._s.logRead || [];
            // Toggle  link label
            if(markRead && $('a[rel="toggle-read"]').hasClass('passage-unread')) {
                that.toggleReadLink(markRead);
            }

            // Store/Unstore read chapter
            if (markRead) {
                if(jQuery.inArray(psg,logRead) === -1) {
                    log.push(logItem);
                    logRead.push(psg);
                }
            } else {
                var psgPos = log.indexOf(logItem);
                if(psgPos !== -1) log.splice(psgPos,1);
            }
            that._s.log = log;
            that._s.logRead = logRead;
            amplify.store('log', that._s.log );
            amplify.store('logRead', that._s.logRead );

            // Update reading log nav
            that.updateReadingLog();
        },
        updateReadingLog: function(){
            var that = this;
            var log = that._s.log || [];
            if(log.length){
                that._e.read.$logNav.find('.empty-placeholder').addClass('hide');
                var logList = that._e.read.$logNav.find('.log-list');
                var ul = logList.size() ? logList : $('<ul class="log-list"/>');
                var lastDate = false;
                ul.html('');
                jQuery.each(log, function(i){
                    var logItem = log[i];
                    var logDate = lastDate != logItem.logDate ? '<span class="date">' + logItem.logDate + '</span>' : '';
                    ul.append('<li>'+logDate+'<a href="#" rel="psg-link" data-psg="'+logItem.psg+'">'+logItem.psg+'</a></li>');
                    lastDate = logItem.logDate;
                })
                if(!logList.size()) that._e.read.$logNav.append(ul);
            } else {
                that._e.read.$logNav.find('.empty-placeholder').removeClass('hide');
            }
        },
        toggleReadLink: function(){
            var that = this;
            var a = $('a[rel="toggle-read"]');
            a.toggleClass('passage-unread');
            var markRead = a.hasClass('passage-unread');
            var aText = markRead ? a.text().replace('Added','Add') : a.text().replace('Add','Added');
            a.find('span').html(aText);
            if (!arguments.length) that.toggleChapterRead(markRead);

        },
        killHashLinkEvent: function(){
            $('a[href^="#"]').on('click', function(e){ e.preventDefault(); return false; });
        },
        /**
         * Open search bar when you start typing;
         * close it when you hit escape key or click outside of it
         */
        watchForTypingEvent: function(){
            var that = this;
            var disallowedKeys = [27,9,16,17,18,20,33,34,35,36,224]
            // Show search when start typing
            $(document).on('keydown',function(e){
                if (!that._e.search.$nav.hasClass('hover') && disallowedKeys.indexOf( e.keyCode) === -1) {
                    if (!e.metaKey && !e.ctrlKey && !e.altKey) {
                        that._e.search.$nav.trigger('mouseenter');
                    }
                }
                if (e.keyCode == 27) {
                    that._e.search.$nav.trigger('mouseleave');
                }
            }).on('click',function(e){
                if (that._e.search.$nav.has(e.target).length === 0) that._e.search.$nav.trigger('mouseleave');
            });
        },
        /**
         * TODO: store read data and use it on load
         */
        attachVerseEvents: function() {
            var that = this;
            that.killHashLinkEvent();
            that._e.$main.find('span[id]').on('click',function(e){
                return false;
                // handle the display
                var $span = $(this);
                var $prevClickedSpans = $span.prevAll('span.clicked');
                var $nextClickedSpans = $span.nextAll('span.clicked');
                var isClicked = !$span.hasClass('clicked'); // ! b/c it's toggled a couple lines down
                var $tipSpan = isClicked ? $span : ($prevClickedSpans.size() ? $prevClickedSpans.first() : $nextClickedSpans.first());
                if(e.shiftKey) {
                    if ($prevClickedSpans.size()) $span.prevUntil($prevClickedSpans.first()).addClass('clicked')
                    if ($nextClickedSpans.size()) $span.nextUntil($nextClickedSpans.first()).addClass('clicked')
                    $span.addClass('clicked');
                    $tipSpan = $span;
                } else {
                    $span.toggleClass('clicked');
                }

                // handle the storage of selected verses
                // clear last currentPassage
                that._f.selectedPassage = {
                    psg: '',
                    bookname: [],
                    chapter: [],
                    verse: []
                };
                // Add selected verses to that._f.selectedPassage
                var $clickedSpans = that._e.$main.find('span.clicked');
                $clickedSpans.each(function(){
                    var data = $(this).data();
                    if(jQuery.inArray(data.bookname, that._f.selectedPassage.bookname) === -1) that._f.selectedPassage.bookname.push( data.bookname );
                    if(jQuery.inArray(data.chapter, that._f.selectedPassage.chapter) === -1) that._f.selectedPassage.chapter.push( data.chapter );
                    if(jQuery.inArray(data.verse, that._f.selectedPassage.verse) === -1) that._f.selectedPassage.verse.push( data.verse );
                });
                if($clickedSpans.size()){
                    // Fixme: This works for one bookmark, but not multiple bookmarks
                    that._f.selectedPassage.firstVerseSelector = '#'+that._f.selectedPassage.bookname[0].toLowerCase().replace(' ','_')+'_'+that._f.selectedPassage.chapter[0]+'_'+that._f.selectedPassage.verse[0]
                    that._f.selectedPassage.psg = that.getSelectedPassage();
                }
                // handle the popover
                that.hideActiveTip($span);
                if($tipSpan.size()) {
                    // show popover to share verses
                    var $selectedVerses = that.getSelectedVerses();
                    var verseCount = $selectedVerses.size();
                    // use first clicked span unless span is < 100px from the bottom of the page
                    var topOfNext = $tipSpan.next().size() ? $tipSpan.next().offset().top : $tipSpan.offset().top;
                    var wh = that._e.$w.height();
                    var spanPos = topOfNext - wh/2
                    var pConfig = {
                        html: true,
                        trigger: 'manual',
                        placement: 'bottom',
                        container: 'body > main',
                        title: that._f.selectedPassage.psg,
                        content: '<div class="actions"><a class="btn btn-danger btn-large" rel="bookmark"><i class="icon-bookmark"></i></a> <a class="btn btn-large btn-inverse" rel="notes"><i class="icon-file-text-alt"></i> Take Notes</a></div><a class="btn btn-block" rel="unselect-verses"><i class="icon-remove"></i> Unselect All Verses</a>'
                    };
                    $tipSpan.popover(pConfig).popover('show');
                    $('html, body').animate({scrollTop: spanPos }, 500);
                    that.attachVersePopoverEvents();
                }
            });

            $('b.reference').on('click',function(){
                return;
                var $target = $(this);
                var $span = $target.is('span[id]') ? $target : $target.parent();
                $span.toggleClass('clicked');
                if($span.hasClass('read')) {
                    $span.removeAttr('data-read').removeClass('read');
                } else {
                    $span.attr('data-read',"true").addClass('read');
                }
            });
        },
        getSelectedVerses: function(){
            var that = this;
            return that._e.$main.find('span.clicked');
        },
        getSelectedPassage: function(){
            var that = this;
            if(that._f.selectedPassage.psg) return that._f.selectedPassage.psg;

            var psg = '';
            var lastBook = null;
            jQuery.each(that._f.selectedPassage.bookname, function(i){
                var currentBook = that._f.selectedPassage.bookname[i];
                var lastChapter = null;
                if(lastBook && lastBook != currentBook){
                    psg += '; '+currentBook;
                } else {
                    psg += currentBook;
                }
                psg += ' ';
                var lastChapter = null;
                jQuery.each(that._f.selectedPassage.chapter, function(j){
                    var currentChapter = that._f.selectedPassage.chapter[j];
                    psg += !lastChapter ? currentChapter+':' : '; '+currentChapter+':';
                    var lastVerse = null;
                    var contdVerse = false;
                    jQuery.each(that._f.selectedPassage.verse, function(k){
                        var currentVerse = that._f.selectedPassage.verse[k];
                        if(!lastVerse){
                            psg += currentVerse;
                        } else if (currentVerse == lastVerse+1) {
                            contdVerse = true;
                        } else {
                            psg += contdVerse ? '-'+lastVerse+','+currentVerse: ','+currentVerse;
                            contdVerse = false;
                        }
                        lastVerse = currentVerse;
                    });
                    if(contdVerse) psg+= '-'+lastVerse;
                    lastChapter = currentChapter;
                });
                lastBook = currentBook;
            });
            return psg;
        },
        /**
         * TODO: finish bookmarks
         * TODO: finish notes
         */
        attachVersePopoverEvents: function(){
            var that = this;
            that._e.$main.find('.popover .btn').on('click', function(e){
                e.preventDefault();
                var $btn = $(this);
                var selectedPsg = that.getSelectedPassage();
                var currentPsg = that._f.currentPassage.psg;
                switch ($btn.attr('rel')) {
                    case 'bookmark':
                        var bookmarkArr = amplify.store('bookmark') || [];
                        var bookmarkObj = { title: selectedPsg, link: currentPsg, firstVerseSelector: that._f.selectedPassage.firstVerseSelector };
                        if (jQuery.inArray(bookmarkObj, bookmarkArr) === -1) bookmarkArr.push(bookmarkObj);
                        amplify.store( 'bookmark', bookmarkArr );
                        that._s.bookmark = bookmarkArr;
                        break;
                    case 'notes':
                        // FIXME: finish me
                        break;
                    case 'unselect-verses':
                        that._e.$main.find('span.clicked').removeClass('clicked');
                        break;
                };
                that.loadStoredLists();
                that.hideActiveTip();
                return false;
            })
        },
        /**
         * TODO: may have to fix how bookmarks are stored before trying to remove them
         * @param psg
         */
        removeBookmark: function(psg) {
            console.log('remove '+psg+' plz');
        },
        hideActiveTip: function(){
            var that = this;
            var $target = arguments.length ? arguments[0] : false;
            var $popovers = that._e.$body.find('.popover');
            return $popovers.each(function(){
                var $el = $(this);
                if ($el != $target) $el.fadeOut('fast');
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
            var that = this;
            that._f.currentPassage.psg = that.toTitleCase(psg);
            return $.ajax({
                url: "http://labs.bible.org/api/",
                data: {type:'json', callback: 'displayPassages', formatting:'para', passage: psg },
                cache: false,
                dataType: "jsonp"
            });
        },
        /**
         * Format the passages that were returned from the API and attach verse events
         * TODO: replace heading with verse/passage reference if loading specific ones (use _f.currentPassage)
         * @param passages
         */
        displayPassages: function(passages){
            var that = BR;
            var plength = passages.length;
            var curBook = '';
            var curChapter = '';
            var txt = '';
            var readLink = '';
            BR._f.currentPassage.p = passages;
            for (var i = 0; i < plength; i++) {
                var p = passages[i];
                if (p.bookname != curBook && p.chapter != curChapter) {
                    readLink = '<a class="passage-unread" data-psg="'+p.bookname+' '+p.chapter+'" href="#" rel="toggle-read"pl><i class="icon-ok"></i><span>Add '+p.bookname+' '+p.chapter+' to readin\' log</span></a>';
                    if (curBook !== '') txt += readLink;
                    // add heading
                    txt += '<h2 id="'+p.bookname.toLowerCase().replace(' ','_')+'_'+p.chapter.toLowerCase()+'">'+p.bookname+' '+p.chapter+'</h2>'

                    // if title, add it
                    if (p.title) {
                        txt += '<h4><i>'+p.title+'</i></h4>';
                    }
                    // Add text
                    txt += that.formatPassage(p);

                    curBook = p.bookName;
                    curChapter = p.chapter;
                } else {
                    // Add to the passage that already exists
                    // if title, add it
                    if (p.title) {
                        txt += '<h4><i>'+p.title+'</i></h4>';
                    }
                    // Add text
                    txt += that.formatPassage(p);
                }
            }
            txt += readLink;
            // Add txt to last main
            that._e.$main.html( txt );
            that.attachVerseEvents();
        },
        /**
         * add verse numbers and wrap each verse in spans to allow for bookmarkin', sharin', and note takin'
         * TODO: use read data to mark verses as read if applicable
         * @param p
         * @returns {string}
         */
        formatPassage: function(p){
            var that = this;
            var r = /\<p+[a-zA-Z0-9\=\"\s]+\>/gi;
            var ptext = p.text.replace(r,'').replace('<p>','')
            var txt = ptext.replace(/\<\/p\>/gi,'<span class="inner-spacer"/>');
            var spacer = ptext != txt ? ' class="spacer"' : '';
            return '<span'+spacer+' id="'+p.bookname.toLowerCase().replace(' ','_')+'_'+p.chapter+'_'+p.verse+'" data-bookname="'+p.bookname+'" data-chapter="'+p.chapter+'" data-verse="'+p.verse+'"><b class="reference">'+p.verse+'</b> '+txt+'</span> ';
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
            var hasStorage = false;
            var args = arguments.length ? amplify.store(arguments[0]) : amplify.store();
            if (that._f.hasStorage == null || arguments.length) {
                var i = 0;
                for(keys in args) i++;
                hasStorage = i > 0;
            }
            if(!arguments.length) that._f.hasStorage = hasStorage;
            return hasStorage;
        },
        /**
         * clear the amplify storage
         */
        clearStorage: function(){
            if(confirm("Remove all your readin' info?")) {
                for (v in amplify.store()) {
                    amplify.store(v,null);
                }
                window.location.href = "";
            }
        },
        loadStoredLists: function(){
            var that = this;
            var data = that._s;
            $('.tour-placeholder').remove();
            // Bookmarks -------------- //
            if(that.hasStorage('bookmark')) {
                that._e.read.$bookmarkNav.find('ul.empty-placeholder').remove();
                var ul = $('<ul/>')
                jQuery.each(data.bookmark, function(i){
                    var b = data.bookmark[i];
                    ul.append('<li><a href="#" rel="psg-link" data-psg="'+b.link+'"><i class="icon-bookmark"></i> '+b.title+' <span class="delete" data-click-priority="1"><i class="icon-remove"></i></span></a></li>');
                });
                that._e.read.$bookmarkNav.append(ul);
                ul.find('.delete').on('click',function(e){
                    that.removeBookmark( $(this).parent().text() )
                });
            } else {
                that._e.read.$bookmarkNav.find('ul.empty-placeholder').show();
            }
            // Reading Log ----------------- //
            that.updateReadingLog();

            that.killHashLinkEvent();
            that._e.$psgLink = $('a[rel="psg-link"]');
            that.passageLinkEvent();

        },
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
        toTitleCase: function(str){
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
    };

    // Initialize App
    BR.init();



    BR_TOUR = {
        _e: BR._e,
        _f: {
            restart: false
        },
        pConfig: {
            html: true,
            placement: BR._f.isMobile ? 'bottom' : 'right',
            trigger: 'manual',
            container: 'body > header',
        },
        init: function(){
            var that = this;
            // Prepare first tip
            that._e.$tip = null;
            that._e.modal.$tour.modal('show');
            that.attachModalEvents();

            return that;
        },
        restartInit: function(tipCount){
            var that = this;
            that._f.restart = true;
            // Prepare first tip
            that._e.$tip = null;
            that._e.modal.$tour.find('.modal-header').html('<h2>Welcome Back</h2>');
            that._e.modal.$tour.find('.modal-body').html('<p>Would you like to finish your tour?</p>');
            that._e.modal.$startTourLink.html("Yes, Let's finish the tour!");
            that._e.modal.$tour.modal('show');
            BR._f.tipCount = tipCount-1;
            that.attachModalEvents();

            return that;
        },
        attachModalEvents: function(){
            var that = this;
            that._e.modal.$startTourLink.on('click', function(){
                amplify.store('uid',that.guid());
                BR._f.showingTour = true;
                that._e.$body.addClass('showing-tour');
                if(!that._f.restart) {
                    that.attachTipEvent();
                } else {
                    that.runTipSteps();
                }
            });

            that._e.modal.$noTourLink.on('click', function(){
                amplify.store('uid',that.guid());
                amplify.store('tour','declined');
                BR.loadStoredLists();
            });
        },
        attachCloseEvent: function(){
            var that = this;
            that._e.$header.find('.popover-title a').on('click', that.closeTour);
        },
        closeTour: function(){
            var that = BR;
            if (arguments.length) {
                arguments[0].preventDefault();
            }
            that._e.$navTop.removeClass('hover');
            that._e.$header.find('.popover').hide();
            that._f.showingTour = false;
            that._e.$body.removeClass('showing-tour');
            // that._e.search.$input.off('keyup');
            var stepName = that._f.tipCount+1 == that._f.tipTotal+1 ? 'finished' : 'step-'+(that._f.tipCount+1);
            amplify.store('tour', stepName);
            if(stepName == 'finished') {
                BR.loadStoredLists();
            }
            return false;
        },
        switchReadNav: function( navItem ){
            var that = BR;
            that._f.showingTour = false;
            that._e.$toggleSubNavLinks.eq( navItem ).trigger('click');
            that._f.showingTour = true;
        },
        attachTipEvent: function(){
            var that = this;
            switch (BR._f.tipCount++) {
                case 0:
                    that.runTipSteps();
                    break;
                case 1:
                    BR._f.tourStep = 'log';
                    // Button to show  Read Nav > Bookmarks
                    that._e.$body.find('.popover-content .btn').on('click',function(e){
                        e.preventDefault();
                        that._e.$tip.popover('hide');
                        that.runTipSteps();
                        return false;
                    });
                    break;
                case 2:
                    BR._f.tourStep = 'random';
                    that._e.$body.find('.popover-content .btn').on('click',function(e){
                        e.preventDefault();
                        that._e.$tip.popover('hide');
                        that.runTipSteps();
                        return false;
                    });
                    break;
                case 3:
                    BR._f.tourStep = 'search';
                    that._e.$body.find('.popover-content .btn').on('click',function(e){
                        e.preventDefault();
                        that._e.$tip.popover('hide');
                        that.runTipSteps();
                        return false;
                    });
                    break;
                case 4:
                    BR._f.tourStep = 'tweak';
                    that._e.$body.find('.popover-content .btn').on('click',function(e){
                        e.preventDefault();
                        that._e.$tip.popover('hide');
                        that.runTipSteps();
                        return false;
                    });
                    break;
                case 5:
                    BR._f.tourStep = 'share';
                    that._e.$body.find('.popover-content .btn').html("That's It!").on('click',function(e){
                        e.preventDefault();
                        that._e.$tip.popover('hide');
                        that.runTipSteps();
                        return false;
                    });
                    break;
                default:
                    that.closeTour();
            }
            amplify.store('tour', 'step-'+BR._f.tipCount);
        },
        runTipSteps: function(){
            var that = this;
            switch(BR._f.tipCount-1) {
                case 0:
                    // Button to show  Read Nav > Log 1
                    that._e.$tip = that._e.read.$logNav.find('li a').eq(1);
                    that.pConfig.title = "<i class='icon-list'></i> Your Readin' Log <a href='#close'><i class='icon-remove'></i></a>";
                    that.pConfig.content = "<p>Here's a log of all that you've been readin'</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                    that._e.$tip.popover(that.pConfig);
                    that._e.read.$nav.addClass('hover');
                    that._e.$tip.popover('show');
                    that.attachTipEvent();
                    that.attachCloseEvent();
                    break;
                case 1:
                    that._e.read.$nav.addClass('hover');
                    that._e.read.$nav.find('li[id]').hide();
                    that._e.read.$nav.find('.actions a').removeClass('hover');
                    that._e.$tip = that._e.read.$nav.find('.actions a').last().addClass('hover');
                    var oldTitle = that._e.$tip.attr('title');
                    that.pConfig.title = "<i class='icon-random'></i> Load random passage <a href='#close'><i class='icon-remove'></i></a>";
                    that._e.$tip.attr('title', that.pConfig.title);
                    that.pConfig.content = "<p>Click the random button (<i class='icon-random'></i>) to load a random chapter of the Bible to start readin'.</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                    that.pConfig.placement = "bottom";
                    that._e.$tip.popover(that.pConfig).popover('show');
                    that._e.$tip.attr('title', oldTitle);
                    that.attachTipEvent();
                    that.attachCloseEvent();
                    break;
                case 2:
                    that._e.$tip = that._e.search.$nav.find('.sub');
                    that._e.read.$nav.removeClass('hover');
                    that._e.search.$nav.addClass('hover');
                    that.pConfig.title = "<i class='icon-search'></i> Searchin' the Bible <a href='#close'><i class='icon-remove'></i></a>";
                    that.pConfig.content = "<p>Just start typing. You can search for a verse, verses, a chapter, or a combo of the three&mdash;just separate each with a semi-colon (;)</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                    that.pConfig.animation = false;
                    that.pConfig.placement = "bottom";
                    that._e.$tip.popover(that.pConfig).popover('show');
                    that._e.search.$input.focus();
                    that._e.search.$input.on('keyup', function(){
                        if (BR._f.showingTour) {
                            that._e.$tip.popover('show');
                            that._e.$body.find('.popover-content .btn').on('click',function(e){
                                e.preventDefault();
                                that._e.$tip.popover('hide');
                                that.runTipSteps();
                                return false;
                            });
                        }
                    });
                    that.attachTipEvent();
                    that.attachCloseEvent();
                    break;
                case 3:
                    that._e.$tip = that._e.tweak.$nav.find('.sub');
                    that._e.search.$nav.removeClass('hover');
                    that._e.tweak.$nav.addClass('hover');
                    that.pConfig.title = "<i class='icon-cog'></i> Tweak <a href='#close'><i class='icon-remove'></i></a>";
                    that.pConfig.content = "<p>Here you can tweak the site's appearance to make it easier on your eyes.</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                    that.pConfig.animation = true;
                    that.pConfig.placement = "bottom";
                    that._e.$tip.popover(that.pConfig).popover('show');
                    that.attachTipEvent();
                    that.attachCloseEvent();
                    break;
                case 4:
                    that._e.$tip = that._e.share.$nav.find('.sub');
                    that._e.tweak.$nav.removeClass('hover');
                    that._e.share.$nav.addClass('hover');
                    that.pConfig.title = "<i class='icon-share'></i> Share <a href='#close'><i class='icon-remove'></i></a>";
                    that.pConfig.content = "<p>Share what you've been readin' or share your feedback!</p><div class='clearfix'><a href='#next' class='btn btn-small f-right btn-primary'>Got It</a></div>";
                    that.pConfig.placement = "bottom";
                    that._e.$tip.popover(that.pConfig).popover('show');
                    that.attachTipEvent();
                    that.attachCloseEvent();
                    break;
                case 5:
                    amplify.store('tour','finished')
                    that.closeTour();
                    break;
                default:
                    return false;
            }
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
            var that = this;
            return that.s4() + that.s4() + '-' + that.s4() + '-' + that.s4() + '-' +
                that.s4() + '-' + that.s4() + that.s4() + that.s4();
        }
    }
    // If no record of visit, run the tour
    if (!BR._s.tour) {
        BR_TOUR.init();
    } else if(BR._s.tour.indexOf('step-')!==-1) {
        BR_TOUR.restartInit( BR._s.tour.substring(5) );
    } else {
        BR.loadStoredLists();
    }

})(jQuery,this,document);