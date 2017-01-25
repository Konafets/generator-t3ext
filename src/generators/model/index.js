'use strict';

import path from 'path';
import {Base} from 'yeoman-generator';
import {genNamedBase} from '../generator-base';

export class Generator extends Base {
    constructor(...args) {
        super(...args);

        this.argument('name', {type: String, required: true});
        // this.sourceRoot(path.join(__dirname, '../..', '/templates'));
    }

    initializing() {
        return genNamedBase(this);
    }

    prompting() {
        let name = name;

        // this.log(this);
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('Classes/Domain/Model/DefaultModel.php'),
            this.destinationPath('Classes/Domain/Model/' + this.name + '.php'),
            {
                extKeyForNamespace: this.extKeyForNamespace,
                modelName: this.name,
                // authorName: this.authorName,
                // authorMail: this.authorMail,
                // modelProperties: this.modelProperties
            }
        );
    }

}

module.exports = Generator;
