export function getImageUrl(imageName, component = 'core') {
    return M.util.image_url(imageName, component);
}

export function getString(identifier, component = 'core', a) {
    return M.util.get_string(identifier, component, a);
}

export function sendQuizResults(wwwRoot, cmId, attemptId, results, flowerid) {
    const promise = new Promise(function(resolve, reject) {
        const params = {};
        params.action = 'quizresults';
        params.attemptid = attemptId;
        params.cmid = cmId;
        params.quizresults = JSON.stringify(results);
        params.flowerid = flowerid;

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function(e) {
            if (this.readyState === 4) {
                if (xhr.status != 200) {
                    reject();
                    return;
                }

                var payload = xhr.responseText;
                var payloadobject = JSON.parse(payload);
                if (payloadobject) {
                    if (!payloadobject.success) {
                        reject(payloadobject);
                    } else {
                        resolve(payloadobject.data);
                    }
                } else {
                    reject();
                }
            }
        };

        xhr.open('POST', wwwRoot + '/mod/readseed/ajaxhelper.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.send(build_querystring(params)); // Defined in javascript-static.
    });
    return promise;
}

export function sendSubmission(wwwRoot, cmid, fileName, recTime) {
    const promise = new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();

        //set up our handler for the response
        xhr.onreadystatechange = function(e) {
            if (this.readyState === 4) {
                if (xhr.status == 200) {
                    var payload = xhr.responseText;
                    var payloadobject = JSON.parse(payload);
                    if (payloadobject) {
                        switch (payloadobject.success) {
                            case false:
                                reject();
                                break;

                            case true:
                            default:
                                resolve(payloadobject.data); // The attempt ID.
                                break;
                        }
                    }
                } else {
                    reject();
                }
            }
        };

        var params = 'cmid=' + cmid + '&filename=' + fileName + '&rectime=' + recTime;
        xhr.open('POST', wwwRoot + '/mod/readseed/ajaxhelper.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.send(params);
    });

    return promise;
}
