const urlMatchers = [
  'https://wiki-jirait.kornferry.com/*',
  'https://jirait.kornferry.com/*',
  'http://wiki-jirait.kornferry.com/*',
  'http://jirait.kornferry.com/*',
];

const modifyScheme = url =>
  /^https/i.test(url) ? url : url.replace(/^([^:]+)/, 'https');

const modifyQuery = (url) => {
  const match = url.match(/^([^\?\#]+)\??([^#]*)?(#.*)?$/);
  if (!match) {
    return url;
  }
  let [, base, query, fragment] = match;
  let params = (query || '').split('&');
  if (!params.find(_ => /sso=/i.test(_))) {
    params.push('sso=false');
  }
  return `${base}?${params.filter(_=>_.length).join('&')}${fragment || ''}`;
}

const processTab = tab => {
  const url = modifyQuery(modifyScheme(tab.url));
  if (tab.url !== url) {
    chrome.tabs.update(tab.id, {url: url});
  }
}

const processTabs = _ =>
  chrome.tabs.query({url: urlMatchers}, tabs =>
    tabs.forEach(processTab)
  );

chrome.tabs.onUpdated.addListener(_ => processTabs());

chrome.runtime.onInstalled.addListener(_ => processTabs());
