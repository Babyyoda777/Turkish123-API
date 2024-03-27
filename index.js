// index.js

import { Turkish123 } from './Turkish123.js'; // Assuming Turkish123 is exported as named export in Turkish123.js

const turkish123 = new Turkish123();


module.exports.handler = async (req, res) => {
    const { method, query, path } = req;

    switch (path) {
        case '/info': {
            const { id } = query;
            await turkish123.info(id);
            res.json(turkish123.info);
            break;
        }
        case '/getStream': {
            const { episodeurl, episodenumber } = query;
            const streamurl = await turkish123.getStream(episodeurl, episodenumber);
            res.json({ streamurl });
            break;
        }
        case '/search': {
            const { query: searchQuery } = query;
            await turkish123.search(searchQuery);
            res.json(turkish123.SearchResults);
            break;
        }
        case '/trending': {
            await turkish123.trending();
            res.json(turkish123.Trending);
            break;
        }
        default: {
            res.status(404).json({ error: 'Not Found' });
        }
    }
};
