'use strict';

import path from 'path';
import {Base} from 'yeoman-generator';
import {genNamedBase} from '../generator-base';

export class Generator extends Base {
    constructor(...args) {
        super(...args);

        this.argument('name', {type: String, required: true});
    }

    initializing() {
        return genNamedBase(this);
    }

    prompting() {
        let name = name;

        this.log(this);
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('Classes/Controller/DefaultController.php'),
            this.destinationPath('Classes/Controller/' + this.controllerName + '.php'),
            {
                extKeyForNamespace: this.extKeyForNamespace,
                controllerName: this.controllerName,
                repositoryName: this.repositoryName,
                repositoryNameLcFirst: this.repositoryNameLcFirst,
                authorName: this.authorName,
                authorMail: this.authorMail,
                controllerActions: this.controllerActions
            }
        );
    }

}

module.exports = Generator;
