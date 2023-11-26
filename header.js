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

    // setTimeout(()=> {
        
    // }, 3000);
});