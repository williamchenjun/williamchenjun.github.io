$(document).ready(() => {
    const links = [...document.querySelectorAll('ul#navbar-links > li > a')];
    const linksWidths = links.map(el => el.offsetWidth);
    const gap = 20;
    const indicatorHalfWidth = 3.5;

    $('div.page-indicator').css('margin-left', linksWidths.slice(0, links.findIndex(x => x == document.querySelector('ul#navbar-links > li > a.active-page'))).reduce((tot, curr) => tot + curr, 0) + document.querySelector('ul#navbar-links > li > a.active-page').offsetWidth / 2 + links.findIndex(x => x == document.querySelector('ul#navbar-links > li > a.active-page'))*gap - indicatorHalfWidth + 'px');
    
    $('ul#navbar-links > li > a').on('mouseover', (event) => {
        
        let element = event.target;
        let hoverElementID = links.findIndex(x => x == element);
        let hoverElementWidth = linksWidths.slice(0, hoverElementID + 1).reduce((tot, curr) => tot + curr, 0) + (hoverElementID)*gap - linksWidths[hoverElementID]/2 - indicatorHalfWidth; //3 is half width of the indicator

        gsap.to('div.page-indicator', {marginLeft: hoverElementWidth, duration: .4, ease: 'elastic.out(1,0.7)'});
        
    });

    $('ul#navbar-links').on('mouseleave', (event) => {
        let offset = linksWidths.slice(0, links.findIndex(x => x == document.querySelector('ul#navbar-links > li > a.active-page'))).reduce((tot, curr) => tot + curr, 0) + document.querySelector('ul#navbar-links > li > a.active-page').offsetWidth / 2 + links.findIndex(x => x == document.querySelector('ul#navbar-links > li > a.active-page'))*gap - indicatorHalfWidth;
        gsap.to('div.page-indicator', {marginLeft: offset, duration: .4, ease: 'elastic.out(1,0.7)'});
    });
});