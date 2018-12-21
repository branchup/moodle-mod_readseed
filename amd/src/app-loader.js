define(['mod_readseed/app', 'https://cdn.jsdelivr.net/gh/justinhunt/cloudpoodll@latest/amd/build/cloudpoodll.min.js'], function(
  app,
  CloudPoodll
) {
  return {
    init: function(domId, appOptions, recorderOptions) {
      app.init(domId, appOptions, recorderOptions, CloudPoodll);
    }
  };
});
