Polyfill.io loader for Webpack
---

## Install
```
npm i polyfill-io-loader --save-dev
```

## Features

1. **Lazy load** - evergreen browsers that support all the given features will not contact polyfill.io at all - it will just initialise the main app. This avoids an unnecessary http round trip.

2. **Retrieve minimal polyfills** - it will only pull the missing functionality your browser needs and not all the polyfills you list.

3. **Load from custom self hosted url/cdn** - if your self hosting your own polyfill.io then you can point it towards your CDN url.

## Usage

```js
import loadPolyfills from 'polyfill-io-loader!?Promise,NodeList.prototype.forEach,Object.assign';

loadPolyfills(function() {
    // All polyfills have been loaded.
    // Initialise your app here.
});
```

### Load from custom CDN/url:

```js
import loadPolyfills from 'polyfill-io-loader!?Promise,url=http://my-custom-cdn.com';
```

## How does it work?

When the loader runs, it pulls the minimal js detections code for each of the polyfills you list in the import. At runtime of your app, it will check all the detections then make a request to polyfill.io with all the missing functionality:

So for example:

```js
import loadPolyfills from 'polyfill-io-loader!?Promise,fetch,Object.assign';
```

If the browser supports `Promise` but not `fetch` or `Object.assign`, the following request will be made to polyfill.io:

```
https://polyfill.io/v3/polyfill.min.js?features=fetch,Object.assign&flags=always
```

## Contributing

This library aims to be lightweight and minimal, but if you feel a new option or functionality is required, please create an issue for feedback.
