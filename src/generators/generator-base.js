'use strict';

import lodash from 'lodash';
import s from 'underscore.string';
import yoWelcome from 'yeoman-welcome';
import semver from 'semver';
import * as genUtils from './util';
import path from 'path';

// extend lodash with underscore.string
lodash.mixin(s.exports());

export function genBase(self) {
    self = self || this;

    let yoCheckPromise;
    if(!process.env.CI) {
      yoCheckPromise = genUtils.runCmd('yo --version').then(stdout => {
        if(!semver.satisfies(semver.clean(stdout), '>= 1.7.1')) {
          throw new Error(`ERROR: You need to update yo to at least 1.7.1 (npm i -g yo)
  'yo --version' output: ${stdout}`);
        }
      });
    } else {
      // CI won't have yo installed
      yoCheckPromise = Promise.resolve();
    }

    self.lodash = lodash;
    self.yoWelcome = yoWelcome;


    let baseDetermineAppname = self.determineAppname.bind(self);
    self.determineAppname = () => {
      if(self['name']) {
        return self['name'];
      } else {
        return baseDetermineAppname();
      }
    };

    self.appname = lodash.camelize(lodash.slugify(
      lodash.humanize(self.determineAppname())
    ));
    self.scriptAppName = self.appname + genUtils.appSuffix(self);


    // let baseDetermineExtensionKey = this.appname;
    // self.determineExtensionKey = () => {
    //   if(self['name']) {
    //     return self['name'];
    //   } else {
    //     return baseDetermineExtensionKey();
    //   }
    // };
    //
    // self.extkey = lodash.camelize(lodash.slugify(
    //   lodash.humanize(self.determineExtensionKey())
    // ));
    //
    // self.appname = lodash.camelize(lodash.slugify(
    //   lodash.humanize(self.determineExtensionKey())
    // ));
    //



    // self.scriptAppName = self.appname + genUtils.appSuffix(self);

    // self.filters = self.filters || self.config.get('filters');
    //
    // // dynamic assertion statements
    // self.expect = function() {
    //   return self.filters.expect ? 'expect(' : '';
    // };
    // self.to = function() {
    //   return self.filters.expect ? ').to' : '.should';
    // };
    //
    // // dynamic relative require path
    // self.relativeRequire = genUtils.relativeRequire.bind(self);
    // // process template directory
    // self.processDirectory = genUtils.processDirectory.bind(self);
    // // rewrite a file in place
    // self.rewriteFile = genUtils.rewriteFile;

    self.sourceRoot(path.join(__dirname, '../', '/templates'));

    return yoCheckPromise;
}

export function genNamedBase(self) {
  self = self || this;

  // extend genBase
  return genBase(self).then(() => {
    let name = self.name.replace(/\//g, '-');

    self.cameledName = lodash.camelize(name);
    self.classedName = lodash.classify(name);

    self.basename = path.basename(self.name);
    self.dirname = (self.name.indexOf('/') >= 0) ? path.dirname(self.name) : self.name;
  });
}
