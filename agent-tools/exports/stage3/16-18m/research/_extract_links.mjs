async function grab(url, re) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-GB' },
      redirect: 'follow',
    });
    const t = await r.text();
    const links = [...new Set([...t.matchAll(re)].map((m) => m[0]))].slice(0, 20);
    console.log('\n===', url, 'status', r.status, 'len', t.length);
    for (const l of links) console.log(l);
  } catch (e) {
    console.log('ERR', url, e.message);
  }
}

const reArgos = /https:\/\/www\.argos\.co\.uk\/product\/\d+/g;
const reSmyths = /\/uk\/en-gb\/[^"'\\s]+\/p\/\d+/g;

await grab('https://www.argos.co.uk/search/wooden-car-ramp/', reArgos);
await grab('https://www.argos.co.uk/search/stacking+rings/', reArgos);
await grab('https://www.argos.co.uk/search/first+words+board+book/', reArgos);
await grab('https://www.argos.co.uk/search/soft+baby+doll/', reArgos);
await grab('https://www.argos.co.uk/search/open+cup+toddler/', reArgos);
await grab('https://www.argos.co.uk/search/chunky+crayons/', reArgos);
await grab('https://www.smythstoys.com/uk/en-gb/search/?text=stacking', reSmyths);
await grab('https://www.smythstoys.com/uk/en-gb/search/?text=ramp+racer', reSmyths);
await grab('https://www.smythstoys.com/uk/en-gb/search/?text=first+words', reSmyths);
await grab('https://www.smythstoys.com/uk/en-gb/search/?text=baby+doll', reSmyths);
await grab('https://www.smythstoys.com/uk/en-gb/search/?text=doidy', reSmyths);
await grab('https://www.boots.com/sitesearch?searchTerm=doidy', /href="(\/[^"]*doidy[^"]*)"/gi);
await grab('https://www.johnlewis.com/search?search-term=doidy+cup', /href="(\/[^"]*doidy[^"]*)"/gi);
await grab('https://www.johnlewis.com/search?search-term=baby+stella', /href="(\/[^"]*stella[^"]*)"/gi);
await grab('https://www.johnlewis.com/search?search-term=priddy+100', /href="(\/[^"]*(priddy|100-words)[^"]*)"/gi);
