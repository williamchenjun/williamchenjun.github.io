const isDark = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
    }
    return false;
};

$(document).ready(()=>{
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark()?'#121212':'#ffffff');
    $('span.theme-btn').addClass(isDark()?'dark':'light');
    if (isDark()){
        document.querySelector('span.theme-btn').innerHTML = "&#9788;";
    } else {
        document.querySelector('span.theme-btn').innerHTML = "&#9790;";
    }
    $('body').addClass(isDark()?'dark-theme':'light-theme');
});

$(window).on('load', () => {
    
    const links = [...document.querySelectorAll('ul#navbar-links > li > a')];
    const linksWidths = links.map(el => el.getBoundingClientRect().width);
    const gap = 20;
    const indicatorHalfWidth = 3.5;
    
    $('ul#navbar-links > li > a').ready(()=>{
        const init_pos = linksWidths.slice(0, links.findIndex(x => x == document.querySelector('ul#navbar-links > li > a.active-page'))).reduce((tot, curr) => tot + curr, 0) + document.querySelector('ul#navbar-links > li > a.active-page').getBoundingClientRect().width / 2 + links.findIndex(x => x == document.querySelector('ul#navbar-links > li > a.active-page'))*gap - indicatorHalfWidth;
        $('div.page-indicator').css('margin-left', init_pos);
    });
    
    $('ul#navbar-links > li > a').on('mouseover', (event) => {
        
        let element = event.target;
        let hoverElementID = links.findIndex(x => x == element);
        let hoverElementWidth = linksWidths.slice(0, hoverElementID + 1).reduce((tot, curr) => tot + curr, 0) + (hoverElementID)*gap - linksWidths[hoverElementID]/2 - indicatorHalfWidth; //3 is half width of the indicator

        gsap.to('div.page-indicator', {marginLeft: hoverElementWidth, duration: .4, ease: 'elastic.out(1,0.7)'});
        
    });

    $('ul#navbar-links').on('mouseleave', (event) => {
        let offset = linksWidths.slice(0, links.findIndex(x => x == document.querySelector('ul#navbar-links > li > a.active-page'))).reduce((tot, curr) => tot + curr, 0) + document.querySelector('ul#navbar-links > li > a.active-page').getBoundingClientRect().width / 2 + links.findIndex(x => x == document.querySelector('ul#navbar-links > li > a.active-page'))*gap - indicatorHalfWidth;
        gsap.to('div.page-indicator', {marginLeft: offset, duration: .4, ease: 'elastic.out(1,0.7)'});
    });

    $('span.theme-btn').on('click', (event)=>{
        const el = event.target;
        gsap.to('span.theme-btn', {scale: 0, duration: .2, ease: 'expo.out'});
        if (el.classList.contains('dark')){
            el.classList.remove('dark');
            el.classList.add('light');
            el.innerHTML = "&#9790;";
            gsap.to('span.theme-btn', {scale: 1, duration: .2, ease: 'expo.out', delay: .3});
            document.querySelector('body').classList.remove('dark-theme');
            document.querySelector('body').classList.add('light-theme');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
        } else {
            el.classList.remove('light');
            el.classList.add('dark');
            el.innerHTML = "&#9788;";
            gsap.to('span.theme-btn', {scale: 1, duration: .2, ease: 'expo.out', delay: .3});
            document.querySelector('body').classList.remove('light-theme');
            document.querySelector('body').classList.add('dark-theme');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#121212');
        }
    });
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const newColorScheme = event.matches ? "dark" : "light";
        gsap.to('span.theme-btn', {scale: 0, duration: .2, ease: 'expo.out'});
        if (newColorScheme == "dark"){
            document.querySelector('span.theme-btn').classList.remove('light');
            document.querySelector('span.theme-btn').classList.add('dark');
            gsap.to('span.theme-btn', {scale: 1, duration: .2, ease: 'expo.out', delay: .3});
            document.querySelector('body').classList.remove('light-theme');
            document.querySelector('body').classList.add('dark-theme');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#121212');
            document.querySelector('span.theme-btn').innerHTML = "&#9788;";
        } else {
            document.querySelector('span.theme-btn').classList.remove('dark');
            document.querySelector('span.theme-btn').classList.add('light');
            gsap.to('span.theme-btn', {scale: 1, duration: .2, ease: 'expo.out', delay: .3});
            document.querySelector('body').classList.remove('dark-theme');
            document.querySelector('body').classList.add('light-theme');
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
            document.querySelector('span.theme-btn').innerHTML = "&#9790;";
        }
    
    });
});

