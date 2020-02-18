var request = require('request');
const cheerio = require('cheerio');

const selectorsOld = {
    "title":".clipTitle > h3",
    "description":".clip > .dtext > p:not(:first-child)",
    "tags":"div.clipInfo.clip_details > div:last-child",
    "poster":"div.mediaSrc video",
    "image":"div.mediaSrc img",
    "price": "div.clip_details span.clip_detail_label > span.highlight",
    "store":"h4.studioTitle > a"
};

const selectorsNew = {
    "title":".clipTitle > h3",
    "description":".clip > .dtext > p:not(:first-child)",
    "tags":"div.clipInfo.clip_details > div:last-child",
    "poster":"div.mediaSrc video",
    "image":"div.mediaSrc img",
    "price": "div.clip_details span.clip_detail_label > span.highlight",
    "store":"h4.studioTitle > a"
};

exports.scrapeC4S = (url) => {

    let selector;

    if(url.includes())
    {
        selector = selectorsOld;
    }
    else if(url.includes())
    {
        selector = selectorsNew;
    }
    else
    {
        return {};
    }
    

    let p = new Promise((resolve,reject) => {
    
        request(url, (err, resp, body) => {

            if(err)
            {
                reject();
            }
            //console.log('Scraping: ' + url);
            const $ = cheerio.load(body);
            
            let video = {};
            video.title = $(selector.title).text()
            let description = '';

            let desc_ps = $(selector.description);
            for(let i=0; i<desc_ps.length; i++)
            {
                description += $(desc_ps[i]).text()+'\n'
            }
            description = description.trim();
            
            let tags = $(selector.tags).text().trim().replace('Keywords:','').trim();
            tags = tags.charAt(tags.length-1) === '.' ? tags.slice(0,-1) : tags;
            tags = tags.split(', ');

            video.description = description;
            video.tags = tags;

            let gif = $(selector.poster).attr('poster');
            let still = $(selector.image).attr('src');

            let poster =  gif ? gif : (still ? still : '');
            if(poster)
            {
                video.thumbnail = 'https:' + poster;
            }

            let price = $(selector.price).eq(0).text().replace(/\s+/g,'').replace('USD','').replace('$','');
            if(price && !isNaN(parseFloat(price)))
            {
                video.price = parseFloat(price);
            }

            let store = $(selector.store).text();
            if(store)
            {
                video.store = store;
            }

            let storelink = $(selector.store).attr('href');
            if(storelink)
            {
                video.storelink = 'https://www.clips4sale.com' + storelink;
            }
            
            
            resolve(video);
        });

    })

    return Promise.resolve(p);


};