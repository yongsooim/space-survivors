/// <reference path="./Box2D.d.ts" />

import Box2DFactory from 'box2d-wasm' // ....

Box2DFactory({
  // By default, this looks for Box2D.wasm relative to public/build/bundle.js:
  // @example (url, scriptDirectory) => `${scriptDirectory}${url}`
  // But we want to look for Box2D.wasm relative to public/index.html instead.
  //
  locateFile: (url, scriptDirectory) => {
    // console.log('in worker : ' + url)
    // console.log('in worker : ' + scriptDirectory)
    // console.log('in worker : ' + './' + url)
    const localPath = scriptDirectory.split('@fs')[0] + 'assets/' + url
    console.log(localPath)
    return localPath
    // return './' + url
    // return './assets/' + url
    // return scriptDirectory + '../assets/' + url
  } // Uncaught RuntimeError: Aborted(CompileError: WebAssembly.instantiate(): BufferSource argument is empty). Build with -s ASSERTIONS=1 for more info.

})
