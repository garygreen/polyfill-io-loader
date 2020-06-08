var url = '__URL__';
var detections = [__DETECTION_ENTRIES__]

function loadScript(src, done) {
	var script = document.createElement('script');
	script.src = src;
	script.onload = done;
	script.onerror = function() {
		done(new Error('Failed to load script ' + src));
	};
	document.head.appendChild(script);
}

function getMissing()
{
    var polyfill = [];
    for (var i = 0; i < detections.length; i++) {
        if (! detections[i][1]) {
            polyfill.push(detections[i][0]);
        }
    }

    return polyfill;
}

function loadPolyfills(loadedCallback)
{
    var polyfills = getMissing();
    if (! polyfills.length) {
        return loadedCallback();
    }

    loadScript(url + '?features=' + polyfills.join(',') + '&flags=always', loadedCallback);
}

export default loadPolyfills;
