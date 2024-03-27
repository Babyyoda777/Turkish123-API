// Turkish123.js

import fetch from 'node-fetch';
import cheerio from 'cheerio';

export class Turkish123 {
    constructor() {
        this.info = null;
        this.SearchResults = [];
        this.Trending = [];
        this.streamurl = null;
    }

    async info(id) {
        try {
            const urlString = `https://turkish123.ac/${id}`;
            const response = await fetch(urlString);
            const htmlString = await response.text();
            const $ = cheerio.load(htmlString);
            const img = $('div.thumb img').first().attr('src') || '';
            const about = $('p.f-desc').text().trim();
            const name = $('div.mvic-desc h1').text();
            const lastEp = parseInt($('a.episodi').last().text().split(/\D+/).pop()) || 1;
            const episodes = Array.from({ length: lastEp }, (_, i) => i + 1);
            const passedurl = urlString.endsWith('/') ? urlString.slice(0, -1) : urlString;
            this.info = { id: name, name, img, about, episodes, url: passedurl };
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getStream(episodeurl, episodenumber) {
        try {
            const url = `${episodeurl}-episode-${episodenumber}`;
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            const jsSnippet = $('div.movieplay script').toString();
            const urlStartIndex = jsSnippet.indexOf('https://tukipasti.com');
            if (urlStartIndex !== -1) {
                const urlEndIndex = jsSnippet.indexOf('"', urlStartIndex);
                const extractedURL = jsSnippet.substring(urlStartIndex, urlEndIndex);
                const response2 = await fetch(extractedURL);
                const html2 = await response2.text();
                const $2 = cheerio.load(html2);
                const scripts = $2('script');
                let streamurl = '';
                scripts.each((_, script) => {
                    const scriptContent = $(script).html();
                    if (scriptContent.includes('urlPlay =')) {
                        const urlPlayValue = scriptContent
                            .split('\n')
                            .find(line => line.includes('urlPlay ='))
                            .split('=')[1]
                            .trim()
                            .replace(/[';]/g, '');
                        streamurl += urlPlayValue;
                        this.streamurl = new URL(urlPlayValue);
                    }
                });
                return streamurl;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async search(query) {
        try {
            const url = `https://turkish123.ac/?s=${query}`;
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            const contentElements = $('div.ml-item');
            const results = [];
            contentElements.each((_, contentElement) => {
                const url = $(contentElement).find('a.jt').attr('href');
                const cover = $(contentElement).find('img').attr('src');
                const title = $(contentElement).find('span.mli-info').text();
                const id = url.replace('https://turkish123.ac/', '');
                results.push({ id, url, name: title, img: cover });
            });
            this.SearchResults = results;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async trending() {
        try {
            const url = 'https://turkish123.ac/genre/history/';
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            const contentElements = $('div.ml-item');
            const results = [];
            contentElements.each((_, contentElement) => {
                const url = $(contentElement).find('a.jt').attr('href');
                const cover = $(contentElement).find('img').attr('src');
                const title = $(contentElement).find('span.mli-info').text();
                const id = url.replace('https://turkish123.ac/', '');
                results.push({ id, url, name: title, img: cover });
            });
            if (results.length === 0) {
                console.log('No trending movies found.');
            } else {
                this.Trending = results;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

module.exports = Turkish123;
