module.exports = function(options) {

    var express = require('express');
    var proxy = require('http-proxy-middleware');
    var bodyParser = require('body-parser');
    var path = require('path');

    // require the page rendering logic
    var Renderer = require('./SimpleRenderer.js');

    var publicPath = options.devServer ?
        'http://localhost:2992/_assets/' :
        '/_assets/';

    var config = require('../config/default/config.json');

    try {
        Object.assign(config, require('../config/config.json'));
    }
    catch (e) {
        // do nothing
    }

    var app = express();

    // serve the static assets
    app.use('/_assets', express.static(path.join(__dirname, '..', 'dist'), {
        maxAge: '200d' // We can cache them as they include hashes
    }));
    app.use('/', express.static(path.join(__dirname, '..', 'public')));
    app.use('/serviceWorker.js', express.static(path.join(__dirname, '..', 'push/serviceWorker.js')));
    app.use('/manifest.json', express.static(path.join(__dirname, '..', 'push/manifest.json')));
    app.get('/serviceWorker.js', function(req, res) {
        res.redirect(publicPath + 'sw.js');
    });

    if (options.devServer) {
        app.use(proxy('/sw.js', {
            target: publicPath
        }));
    }

    app.use(bodyParser.json());


    app.get('/embedded', function(req, res) {
        var renderer = new Renderer({
            scriptUrl: publicPath + 'smooch.js',
            data: config,
            embedded: true
        });

        renderer.render(
            req.path, {}, function(err, html) {
                if (err) {
                    res.statusCode = 500;
                    res.contentType = 'text; charset=utf8';
                    res.end(err.message);
                    return;
                }
                res.contentType = 'text/html; charset=utf8';
                res.end(html);
            }
        );
    });

    // application
    app.get('/*', function(req, res) {
        var renderer = new Renderer({
            scriptUrl: publicPath + 'smooch.js',
            data: config
        });

        renderer.render(
            req.path, {}, function(err, html) {
                if (err) {
                    res.statusCode = 500;
                    res.contentType = 'text; charset=utf8';
                    res.end(err.message);
                    return;
                }
                res.contentType = 'text/html; charset=utf8';
                res.end(html);
            }
        );
    });


    var port = process.env.PORT || options.defaultPort || 8080;
    app.listen(port, function() {
        console.log('Server listening on port ' + port); //eslint-disable-line no-console
    });
};
