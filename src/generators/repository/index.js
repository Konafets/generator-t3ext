'use strict';

import path from 'path';
import {Base} from 'yeoman-generator';
import {genNamedBase} from '../generator-base';

export class Generator extends Base {
    constructor(...args) {
        super(...args);

        this.argument('repositoryName', {type: String, required: true});
        this.argument('authorName', {type: String, required: true});
        this.argument('authorMail', {type: String, required: true});
        this.name = this.appname;
    }

    initializing() {
        return genNamedBase(this);
    }

    prompting() {
        // this.log(this)
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('Classes/Domain/Repository/DefaultRepository.php'),
            this.destinationPath('Classes/Domain/Repository/' + this.repositoryName + '.php'),
            {
                extKeyForNamespace: this.classedName,
                repositoryName: this.repositoryName,
                authorName: this.authorName,
                authorMail: this.authorMail
            }
        );
    }

}

module.exports = Generator;
