var DocumentationCompiler;
var Y = require('yuidocjs');

module.exports = DocumentationCompiler = (function() {
  function DocumentationCompiler() {};

  DocumentationCompiler.prototype.brunchPlugin = true;
  DocumentationCompiler.prototype.type = 'template';
  DocumentationCompiler.prototype.extension = 'js';
  // Optional for different file extensions
  // DocumentationCompiler.prototype.pattern = /(\.(js|css|scss))$/;
  DocumentationCompiler.prototype.docOptions = {
    linkNatives: true,
    attributesEmit: true,
    selleck: true,
    paths: ['./app'],
    outdir: './docs',
    tabtospace: '2'
    themedir: './theme'
  };

  // RUn for each file that changes (all on init)
  DocumentationCompiler.prototype.compile = function(data, path, callback) {
    var err, error, result;

    try {
      // var json = (new Y.YUIDoc(this.options)).run();
      // Server.options = Y.Project.mix(json, Server.options);
      // Y.Server;
      console.log('test');
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
    return this.test();
  };

  DocumentationCompiler.prototype.test = function() {
    console.log('fuck');
  };

  return DocumentationCompiler;
})();
