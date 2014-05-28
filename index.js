var DocumentationCompiler;
var Y = require('yuidocjs');
var express = require('express');

module.exports = DocumentationCompiler = (function() {
  function DocumentationCompiler() {};

  DocumentationCompiler.prototype.brunchPlugin = true;
  DocumentationCompiler.prototype.type = 'template';
  DocumentationCompiler.prototype.extension = 'js';
  // Optional for different file extensions
  // DocumentationCompiler.prototype.pattern = /(\.(js|css|scss))$/;
  DocumentationCompiler.prototype.options = {
    linkNatives: true,
    attributesEmit: true,
    selleck: true,
    paths: ['./app'],
    outdir: './docs',
    tabtospace: '2',
    themedir: './theme'
  };

  // RUn for each file that changes (all on init)
  DocumentationCompiler.prototype.compile = function(data, path, callback) {
    var err, error, result;

    try {
      // var json = (new Y.YUIDoc(this.options)).run();
      // Server.options = Y.Project.mix(json, Server.options);
      // Y.Server;
      result = data;
      return result;
    } catch (_error) {
      err = _error;
      return error = err;
    } finally {
      callback(error, result);
    }
  };

  // Run once at end of compile cycle
  DocumentationCompiler.prototype.onCompile = function(generatedFiles) {
    return this.start();
  };

  DocumentationCompiler.prototype.start = function() {
    this.options = Y.Project.init(this.options);

    this.options.cacheTemplates = false; // Don't cache the Handlebars templates
    this.options.writeJSON = false; // Don't write the JSON file out

    Y.config.logExclude.yuidoc = true;
    Y.config.logExclude.docparser = true;
    Y.config.logExclude.builder = true;

    if (this.options.external) {
      Y.log('Fetching external data, this may take a minute', 'warn', 'server');
      var json, builder;

      json = (new Y.YUIDoc(this.options)).run();
      this.options = Y.Project.mix(json, this.options);

      builder = new Y.DocBuilder(this.options, json);
      builder.mixExternal(function () {
        Y.log('External data fetched, launching server..', 'info', 'server');
        this._externalData = builder.options.externalData;
        this.init();
      });

    } else {
      this.init();
    }
  };

  DocumentationCompiler.prototype.init = function() {
    var path = require('path');
    var stat;

    this.app = express();
    stat = this.options.themedir || path.join(__dirname, '../', 'themes', 'default');
    this.app.use(express.static(stat));
    this.routes();
  };

  DocumentationCompiler.prototype.routes = function () {
    var app = this.app;

    app.get('/', this.parse, function (req, res) {
        this.home(req, res);
    });

    app.get('/api.js', function (req, res) {
        this.builder.renderAPIMeta(function (js) {
            res.contentType('.js');
            res.send(js);
        });
    });

    app.get('/classes/:class.html', this.parse, function (req, res, next) {
        this.clazz(req, res, next);
    });

    app.get('/modules/:module.html', this.parse, function (req, res, next) {
        this.module(req, res, next);
    });

    app.get('/files/:file.html', this.parse, function (req, res, next) {
        this.files(req, res, next);
    });

    // These routes are special catch routes..

    app.get('//api.js', function (req, res) {
        res.redirect('/api.js');
    });
    app.get('//classes/:class.html', this.parse, function (req, res, next) {
        this.clazz(req, res, next);
    });

    app.get('//modules/:module.html', this.parse, function (req, res, next) {
        this.module(req, res, next);
    });

    app.get('//files/:file.html', this.parse, function (req, res, next) {
        this.files(req, res, next);
    });

    app.get('*', function (req, res) {
      var type = req.url.split('/')[1],
          html = ['<h1>Item Not Found in internal meta-data</h1>'];

      if (type === 'class') {
          type = 'classes';
      }

      if (this.builder && this.builder.data && this.builder.data[type]) {
        if (Object.keys(this.builder.data[type]).length) {
          html.push('<p>But I know about these? Misname your module?</p>');
          html.push('<ul>');
          Object.keys(this.builder.data[type]).forEach(function (item) {
              html.push('<li><a href="../' + path.dirname(req.url) + '/' + item + '.html">' + item + '</a></li>');
          });
          html.push('</ul>');
        }
      }

      res.send(html.join('\n'), 404);
    });
  };

  DocumentationCompiler.prototype.files = function (req, res, next) {
    Y.log("files");
  };

  DocumentationCompiler.prototype.clazz = function (req, res, next) {
    Y.log('class');
  };

  DocumentationCompiler.prototype.module = function (req, res, next) {
    Y.log('module');
  };

  DocumentationCompiler.prototype.home = function (req, res, next) {
    Y.log('home');
  };

  return DocumentationCompiler;
})();
