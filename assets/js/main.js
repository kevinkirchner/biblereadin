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

var CURRENT_PASSAGE;
var SHOWING_TOUR = false;
var TOUR_STEP = false;

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

function clearStorage(){
    if(confirm("Remove all your readin' info?")) {
        for (v in amplify.store()) {
            amplify.store(v,null);
        }
    }
}

function setCurrentPassage(psg) {
    CURRENT_PASSAGE = psg;
    console.log(psg);
    // Set share links
    var $fbLink = $('a.facebook-link');
    var $twitterLink = $('a.twitter-link');
    var $emailLink = $('a.email-link');
    // TODO: change sharing links
    // Facebook
    // Twitter
    // Email
}

function loadPassage(psg) {
    // TODO: if passage is just a verse, load the entire chapter and anchor to the verse
    setCurrentPassage(psg);
    return $.ajax({
        url: "http://labs.bible.org/api/",
        data: {type:'json', callback: 'displayPassages', formatting:'para', passage: psg },
        cache: false,
        dataType: "jsonp"
    });
}

function getRandomPassage() {
    // Load Random Passage
    var rand = Math.floor(Math.random()*bible.allBooks.length)+1;
    var book = bible.allBooks[rand];
    var ch = Math.floor(Math.random()*bible.chapterCount[book])+1;
    return book+' '+ch;
}

function formatPassage(p) {
    // optional TODO: put b tags inside of paragraphs and inside spans
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
    // FIXME: Matthew 1:6 doesn't work for some reason
    return '<b id="'+p.bookname.toLowerCase().replace(' ','_')+'_'+p.chapter+'_'+p.verse+'" data-bookname="'+p.bookname+'" data-chapter="'+p.chapter+'" data-verse="'+p.verse+'">'+p.verse+'</b> '+oSpan+txt+cSpan+' ';
}

function displayPassages(passages) {
    // TODO: wrap individual verses
    var plength = passages.length;
    var curBook = '';
    var curChapter = '';
    var $el = $('<section>');
    var txt = '';
    for (var i = 0; i < plength; i++) {
        var p = passages[i];
        if (p.bookname != curBook && p.chapter != curChapter) {
            // add heading
            // TODO: add verse/passage reference if loading specific ones (use CURRENT_PASSAGE)
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
    // Add txt to last section
    $('body > section').html( txt );
    attachVerseEvents();
}

function attachVerseEvents() {
    // TODO: add sharin', bookmarkin' ability
    $('body > section').click(function(e){
        var span = $(e.target);
        var b = span.prevALL('b[id]').first();
        var p = b.data();
        console.log(p);
        span.toggleClass('clicked');
    });
    // TODO: on double click, add note-takin' functionality
}

function getURLParameter(name) {
    var reg = RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [];
    if (reg.length >= 2) {
        return decodeURI( reg[1] );
    }
    return false;
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function markRead(st){
    $('body > section b[id]:not([data-read="true"])').each(function(){
        var el = $(this);
        if (el.offset().top < st) {
            el.data('read',true);
        } else {
            return;
        }
    });
}

// Onload
loadPassage( getURLParameter('psg') || getRandomPassage() );

var BR = amplify.store() || false;

// Navigation ------------------------------------------//
var $readNav = $('.read-nav');
var $tweakNav = $('.tweak-nav');
var $shareNav = $('.share-nav');
var $searchNav = $('.search-nav');
var $search = $('#search');
var $searchNavIcon = $searchNav.find('> a > i');
var $navTop = $('#nav .top');
var $header = $('body > header');
var IS_MOBILE = $navTop.css('position') == 'static';

$('a[href^="#"]').on('click', function(e){ e.preventDefault(); return false; });

$navTop.on('mouseenter', function(){
    if (SHOWING_TOUR && TOUR_STEP != 'search') return;
    var el = $(this);
    $('#nav .top').trigger('mouseleave');
    el.addClass('hover');
    if (el.hasClass('search-nav')) {
        $search.trigger('focus');
    }
}).on('mouseleave', function(){
    if (SHOWING_TOUR) return;
    $(this).removeClass('hover');
});

// Read Nav
$('a[rel="show-nav"]').on('click', function(){
    if (SHOWING_TOUR) return;
    var el = $(this);
    var navSelector = el.attr('href');
    var shownNav = $('.read-nav .inner-sub > li:visible:not(.actions)');
    if (navSelector != '#'+shownNav.attr('id')) {
        $(navSelector).add(shownNav).toggle();
        $('.read-nav .hover').removeClass('hover');
        el.addClass('hover')
    }
});

$('a[rel=random]').on('click',function(e){
    e.preventDefault();
    var psg = getRandomPassage();
    loadPassage( psg );
    if (SHOWING_TOUR) return;
    $(this).parents('.top').removeClass('hover');
    return false;
});

// Tweak Nav
var lastTheme = 'light';
$('.theme-link').on('click', function(e) {
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

var savedTheme = BR.theme || 'light';
if (savedTheme != 'light') {
    setTimeout(function(){
        $('.theme-link[data-theme-color="'+savedTheme+'"]').trigger('click');
    }, 1000);
}

var lastFont = 'sans';
$('.font-link').on('click', function(e) {
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

var savedFont = BR.font || 'sans';
if (savedFont != 'sans') {
    $('.font-link[data-font="'+savedFont+'"]').trigger('click');
}


// Search Nav
$search.typeahead({
    source: bible.allBooks
});

$('#search_form').on('submit',function(e){
    if (!SHOWING_TOUR) $searchNav.removeClass('hover');
    e.preventDefault();

    var $form = $(this);
    var psg = $search.val();
    loadPassage( psg ).complete(function(){
        $search.val('');
    });
})

// Show search when start typing
// TODO: optimize keycodes - http://stackoverflow.com/questions/7694486/browser-key-code-list
$(document).on('keydown',function(e){
    if (!$searchNav.hasClass('hover') && e.keyCode != 27 && e.keyCode != 9 && e.keyCode != 17 && e.keyCode != 18  && e.keyCode != 20 && e.keyCode != 33 && e.keyCode != 34 && e.keyCode != 35 && e.keyCode != 36 && e.keyCode != 224) {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            console.log('typing');
            $searchNav.trigger('mouseenter');
        }
    }
    if (e.keyCode == 27) {
        $searchNav.trigger('mouseleave');
    }
}).on('click',function(e){
    if ($searchNav.has(e.target).length === 0) $searchNav.trigger('mouseleave');
});

// Passage Links
$('a[rel="psg-link"]').on('click',function(e){
    e.preventDefault();
    var el = $(this);
    if(el.parents('.top').size()) el.parents('.top').removeClass('hover');
    loadPassage( el.data('psg') );
    return false;
})

// Marking passages as read
var scrollDepth = 0;
var scrollPaused = 0;
$(window).on('scroll', function(){
    var w = $(this);
    var st = w.scrollTop();
    if (st > scrollDepth) {
        clearTimeout(scrollPaused);
        scrollDepth = st;
        scrollPaused = setTimeout(function(){ markRead(st) }, 500)
    }
})

// Stuff for new people
var brCount = 0; 
for(br in BR) brCount++
if (!brCount) {
    
    // Show modal
    $('#tour').modal('show');
    
    var wireTip;
    // load tour.js
    $.ajax({
      url: '/assets/js/tour.js',
      dataType: 'script',
      cache: true
    });
    
    $('a[rel="tour"]').on('click', function(){
        amplify.store('uid',guid());
        wireTip();
    });
    
    $('a[rel="no-tour"]').on('click', function(){
        amplify.store('uid',guid());
        amplify.store('tour','declined');
    });
}


