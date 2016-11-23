'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

String.prototype.ucfirst = function () {
    return this.charAt(0).toUpperCase() + this.substr(1);
};
String.prototype.lcfirst = function () {
    return this.charAt(0).toLowerCase() + this.substr(1);
};

module.exports = yeoman.Base.extend({
    constructor: function() {
        yeoman.Base.apply(this, arguments);

        this.option('coffee');
    },

    initializing: {
        sayHello: function() {
            this.log(yosay('Lets get some shit done'));
            this.log('initializing - Your initialization methods (checking current project state, getting configs, etc)')
        },
        readConfig: function () {
            this.configFileExists = this.fs.exists(this.destinationPath('genconf.json'));
            if (this.configFileExists) {
                var i;
                var configFile = this.fs.readJSON(this.destinationPath('genconf.json'));
                // Get the values from the config file

                // General data
                this.extKey = this.appname; // take the extkey from the current folder name
                this.extKeyForNamespace = this.extKey.replace(/_\w/g, function (matches) {
                    return matches[1].toUpperCase();
                }).ucfirst();
                this.extkeyLowerCase = this.extKey.replace(/_/g, '');

                this.isoDate = new Date().toISOString();

                // From the meta data
                this.title = configFile.meta.title;
                this.description = configFile.meta.description;
                this.authorName = configFile.meta.authors[0].name;
                this.authorMail = configFile.meta.authors[0].email;
                this.authorCompany = configFile.meta.authors[0].company;
                this.initGit = configFile.meta.initGit;
                this.initGitFlow = configFile.meta.initGitFlow;

                // Models
                this.modelName = configFile.models[0].name;
                this.modelNameLowerCase = this.modelName.toLowerCase();
                var modelProperties = configFile.models[0].properties;
                this.modelProperties = [];

                // SQL
                this.fields = '';

                for (i = 0; i < modelProperties.length; i++) {
                    var propertyName = modelProperties[i].name;
                    var type = modelProperties[i].type;

                    var property = [];
                    property['type'] = type;
                    property['property'] = propertyName;
                    property['propertyUcFirst'] = propertyName.ucfirst();
                    this.modelProperties.push(property);

                    this.fields += '  ' + propertyName;

                    switch (type) {
                        case 'int':
                            this.fields += " int(11) DEFAULT '0' NOT NULL,\n";
                            break;
                        case 'string':
                            this.fields += " varchar(255) DEFAULT '' NOT NULL,\n";
                            break;
                    }
                }

                // Controllers
                this.controllerName = configFile.controllers[0].name;
                if (this.controllerName.includes('Controller') == false) {
                    this.controllerName = this.controllerName + 'Controller';
                }

                var controllerActions = configFile.controllers[0].actions;

                this.controllerActions = [];
                for (i = 0; i < controllerActions.length; i++) {
                    var actionName = controllerActions[i].name;
                    if (actionName.includes('Action') == false) {
                        actionName += 'Action';
                    }
                    var action = [];
                    action['name'] = actionName;
                    action['nameUcFirst'] = actionName.ucfirst();
                    this.controllerActions.push(action);
                }

                this.log(this.fields[2]);

                // Services
                    //TODO: Get services

                // Repositories
                this.repositoryName = this.modelName + 'Repository';
                this.repositoryNameLcFirst = this.repositoryName.lcfirst();
                    //TODO: Get extra repositories
            }
        }
    },
    prompting: function() {
        if (this.configFileExists == false) {
            return this.prompt([{
                type: 'input',
                name: 'extkey',
                message: 'Your extension key',
                default: this.appname // default to current folder name
            }, {
                type: 'input',
                name: 'title',
                message: 'The title of the extension'
            }, {
                type: 'input',
                name: 'description',
                message: 'A description of the extension'
            }, {
                type: 'input',
                name: 'authorName',
                message: 'The name of the extension author',
                store: true
            }, {
                type: 'input',
                name: 'authorMail',
                message: 'The email of the extension author',
                store: true
            }, {
                type: 'input',
                name: 'authorCompany',
                message: 'The company name of the extension author',
                store: true
            }, {
                type: 'input',
                name: 'controllerName',
                message: 'Enter a name for the first controller'
            }, {
                type: 'input',
                name: 'modelName',
                message: 'Enter a name for the first model'
            }, {
                type: 'confirm',
                name: 'initGit',
                message: 'Should I initialize an empty git repo?',
                store: true
            }, {
                type: 'confirm',
                name: 'initGitFlow',
                message: '... and Git Flow too?',
                store: true
            }]).then(function(answers) {
                this.extKey = answers.extkey;
                this.title = answers.title;
                this.description = answers.description;
                this.authorName = answers.authorName;
                this.authorMail = answers.authorMail;
                this.authorCompany = answers.authorCompany;

                if (answers.controllerName.includes('Controller') == false) {
                    this.controllerName = answers.controllerName + 'Controller';
                } else {
                    this.controllerName = answers.controllerName;
                }

                this.extKeyForNamespace = this.extKey.replace(/_\w/g, function (matches) {
                    return matches[1].toUpperCase();
                }).ucfirst();
                this.extkeyLowerCase = this.extKey.replace(/_/g, '');
                this.modelName = answers.modelName;
                this.modelNameLowerCase = this.modelName.toLowerCase();
                this.repositoryName = this.modelName + 'Repository';
                this.repositoryNameLcFirst = this.repositoryName.lcfirst();
                this.isoDate = new Date().toISOString();
                this.initGit = answers.initGit;
                this.initGitFlow = answers.initGitFlow;
            }.bind(this));
        }
    },
    configuring: {
        method: function() {
            this.log('configuring - Saving configurations and configure the project (creating .editorconfig files and other metadata files)')
        }
    },
    default: {
        method: function() {
            this.log('default - If the method name doesn\'t match a priority, it will be pushed to this group.')
        }
    },
    writing: function () {
        this.log('Where you write the generator specific files (routes, controllers, etc)')
        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            { extkey: this.extKey }
        );
        this.fs.copyTpl(
            this.templatePath('ext_emconf.php'),
            this.destinationPath('ext_emconf.php'),
            {
                extkey: this.extKey,
                title: this.title,
                description: this.description,
                authorName: this.authorName,
                authorMail: this.authorMail,
                authorCompany: this.authorCompany
            }
        );
        this.fs.copy(
            this.templatePath('ext_icon.gif'),
            this.destinationPath('ext_icon.gif')
        );
        this.fs.copyTpl(
            this.templatePath('ext_localconf.php'),
            this.destinationPath('ext_localconf.php'),
            {
                controllerName: this.controllerName
            }
        );
        this.fs.copyTpl(
            this.templatePath('ext_tables.php'),
            this.destinationPath('ext_tables.php'),
            {
                title: this.title,
                extkeyLowerCase: this.extkeyLowerCase,
                modelName: this.modelName,
                modelNameLowerCase: this.modelNameLowerCase
            }
        );
        this.fs.copyTpl(
            this.templatePath('ext_tables.sql'),
            this.destinationPath('ext_tables.sql'),
            {
                extkeyLowerCase: this.extkeyLowerCase,
                modelNameLowerCase: this.modelNameLowerCase,
                fields: this.fields
            }
        );
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
        this.fs.copyTpl(
            this.templatePath('Classes/Domain/Model/DefaultModel.php'),
            this.destinationPath('Classes/Domain/Model/' + this.modelName + '.php'),
            {
                extKeyForNamespace: this.extKeyForNamespace,
                modelName: this.modelName,
                authorName: this.authorName,
                authorMail: this.authorMail,
                modelProperties: this.modelProperties
            }
        );
        this.fs.copyTpl(
            this.templatePath('Classes/Domain/Repository/DefaultRepository.php'),
            this.destinationPath('Classes/Domain/Repository/' + this.repositoryName + '.php'),
            {
                extKeyForNamespace: this.extKeyForNamespace,
                repositoryName: this.repositoryName,
                authorName: this.authorName,
                authorMail: this.authorMail
            }
        );
        this.fs.copyTpl(
            this.templatePath('Configuration/FlexForms/Flexform_plugin.xml'),
            this.destinationPath('Configuration/FlexForms/Flexform_plugin.xml'),
            {
                extkey: this.extKey
            }
        );
        this.fs.copyTpl(
            this.templatePath('Configuration/TCA/DefaultTcaDefinition.php'),
            this.destinationPath('Configuration/TCA/' + this.modelName + '.php'),
            {
                extkey: this.extKey,
                extkeyLowerCase: this.extkeyLowerCase,
                modelNameLowerCase: this.modelNameLowerCase
            }
        );
        this.fs.copyTpl(
            this.templatePath('Configuration/TypoScript/constants.txt'),
            this.destinationPath('Configuration/TypoScript/constants.txt'),
            {
                extkey: this.extKey,
                extkeyLowerCase: this.extkeyLowerCase
            }
        );
        this.fs.copyTpl(
            this.templatePath('Configuration/TypoScript/setup.txt'),
            this.destinationPath('Configuration/TypoScript/setup.txt'),
            {
                extkeyLowerCase: this.extkeyLowerCase
            }
        );
        this.fs.copyTpl(
            this.templatePath('Resources/Private/Language/locallang.xlf'),
            this.destinationPath('Resources/Private/Language/locallang.xlf'),
            {
                extkey: this.extKey,
                timestamp: this.isoDate
            }
        );
        this.fs.copyTpl(
            this.templatePath('Resources/Private/Language/de.locallang.xlf'),
            this.destinationPath('Resources/Private/Language/de.locallang.xlf'),
            {
                extkey: this.extKey,
                timestamp: this.isoDate
            }
        );
        this.fs.copyTpl(
            this.templatePath('Resources/Private/Layouts/Default.html'),
            this.destinationPath('Resources/Private/Layouts/Default.html'),
            {
                extkeyLowerCase: this.extkeyLowerCase
            }
        );
        this.fs.copyTpl(
            this.templatePath('Resources/Private/Templates/DefaultController/DefaultTemplate.html'),
            this.destinationPath('Resources/Private/Templates/' + this.controllerName.replace('Controller', '') + '/List.html')
        );
        this.fs.copyTpl(
            this.templatePath('Resources/Private/Templates/DefaultController/DefaultTemplate.html'),
            this.destinationPath('Resources/Private/Templates/' + this.controllerName.replace('Controller', '') + '/Detail.html')
        );
        this.fs.copyTpl(
            this.templatePath('Resources/Public/Icons'),
            this.destinationPath('Resources/Public/Icons')
        );

        if (this.initGit) {
            this.fs.copyTpl(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore')
            );
            this.spawnCommandSync('git', ['init']);
            this.spawnCommandSync('git', ['commit', '--allow-empty', '-m \"Initial commit\"']);
        }
        if (this.initGitFlow) {
            this.log('Enable git flow');
            this.spawnCommandSync('git', ['flow', 'init', '-d']);
        }
    },
    conflicts: {
        method: function() {
            this.log('conflicts - Where conflicts are handled (used internally)')
        }
    },
    install: {
        method: function() {
            this.log('install - Where installation are run (npm, bower)')
        }
    },
    end: {
        method: function() {
            this.log('end - Called last, cleanup, say good bye, etc')
        }
    }
});