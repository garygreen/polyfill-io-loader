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
    //
    // For example:
    // ReactDOM.render(<ClientRoot />, document.getElementById('root'));
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

## How to know which polyfills to use?

1. create your production client bundle (something like: npm run build)
2. run `npx create-polyfill-service-url analyse --file dist/main.5cac0bed.js` <- replace the filename with the one provided by the bundler in the previous step. This will analyze your production bundle and create a list of polyfills according to your browserslist settings.
3. if the list of polyfill seems long, check the log of the `create-polyfill-service-url`. If you see something like `'we do not know if and_qq 12.12.0 supports fetch'`, update your browserlist to exclude those browsers.

## Contributing

This library aims to be lightweight and minimal, but if you feel a new option or functionality is required, please create an issue for feedback.
