'use strict';

import path from 'path';
import {Base} from 'yeoman-generator';
import {genNamedBase} from '../generator-base';

export class Generator extends Base {
    constructor(...args) {
        super(...args);
        this.name = this.appname;
        this.isoDate = new Date().toISOString();

        // this.sourceRoot(path.join(__dirname, '../..', '/templates'));
    }

    initializing() {
        return genNamedBase(this);
    }

    prompting() {

    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('Resources/Private/Language/locallang.xlf'),
            this.destinationPath('Resources/Private/Language/locallang.xlf'),
            {
                extkey: this.name,
                timestamp: this.isoDate
            }
        );
        this.fs.copyTpl(
            this.templatePath('Resources/Private/Language/de.locallang.xlf'),
            this.destinationPath('Resources/Private/Language/de.locallang.xlf'),
            {
                extkey: this.name,
                timestamp: this.isoDate
            }
        );
    }

}

module.exports = Generator;
