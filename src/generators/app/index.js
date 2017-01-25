'use strict';

import path from 'path';
import lodash from 'lodash';
import s from 'underscore.string';
import {Base} from 'yeoman-generator';
import {genBase} from '../generator-base';
// import insight from '../insight-init';
import chalk from 'chalk';
import semver from 'semver';
import { runCmd } from '../util';


// extend lodash with underscore.string
lodash.mixin(s.exports());

export class Generator extends Base {
    constructor(...args) {
        super(...args);
    }

    get initializing() {
        return {
            init: function () {
              this.config.set('generatorVersion', this.rootGeneratorVersion());
              this.filters = {};

              // init shared generator properies and methods
              const genBasePromise = genBase(this);
              let promises = [genBasePromise];

              // if(process.env.CI) {
              //   insight.optOut = true;
              // } else if(insight.optOut === undefined) {
              //   promises.push(new Promise((resolve, reject) => {
              //     insight.askPermission(null, (err, optIn) => {
              //       if(err) return reject(err);
              //       else return resolve(optIn);
              //     });
              //   }));
              // }

              // insight.track('generator', this.rootGeneratorVersion());
              this.nodeVersion = semver.clean(process.version);
              this.semver = semver;
              // insight.track('node', this.nodeVersion);
              // insight.track('platform', process.platform);

              const npmVersionPromise = runCmd('npm --version').then(stdout => {
                this.npmVersion = stdout.toString().trim();
                // return insight.track('npm', this.npmVersion);
              });
              promises.push(npmVersionPromise);

              return Promise.all(promises);
            },

            info: function () {
                this.log(this.yoWelcome);
                this.log('Out of the box I create an TYPO3 Extension.\n');
            },

            readConfig: function () {
                this.configFileExists = this.fs.exists(this.destinationPath('genconf.json'));
                if (this.configFileExists) {
                    this.log('Generator configuration file found!\n');
                    let i;
                    let configFile = this.fs.readJSON(this.destinationPath('genconf.json'));
                    // Get the values from the config file

                    // General data
                    this.extKey = this.appname; // take the extkey from the current folder name
                    this.extKeyForNamespace = lodash.capitalize(
                        this.extKey.replace(/_\w/g, function (matches) {
                            return matches[1].toUpperCase();
                        })
                    );
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
                    this.addSettingsService = configFile.meta.addSettingsService;

                    // Models
                    this.modelName = configFile.models[0].name;
                    this.modelNameLowerCase = this.modelName.toLowerCase();
                    let modelProperties = configFile.models[0].properties;
                    this.modelProperties = [];

                    // SQL
                    this.fields = '';
                    this.fieldsTca = '';

                    for (i = 0; i < modelProperties.length; i++) {
                        let propertyName = modelProperties[i].name;
                        let type = modelProperties[i].type;

                        let property = [];

                        switch (type) {
                            case 'filereference':
                                property['type'] = '\\TYPO3\\CMS\\Extbase\\Domain\\Model\\FileReference';
                                break;
                            default:
                                property['type'] = type;
                        }

                        property['property'] = propertyName;
                        property['propertyUcFirst'] = lodash.capitalize(propertyName);
                        this.modelProperties.push(property);


                        this.fields += '  ' + lodash.underscored(propertyName);
                        this.fieldsTca += ', ' + lodash.underscored(propertyName);

                        switch (type) {
                            case 'int':
                            case 'filereference':
                                this.fields += " int(11) DEFAULT '0' NOT NULL,\n";
                                break;
                            case 'string':
                                this.fields += " varchar(255) DEFAULT '' NOT NULL,\n";
                                break;
                            case 'text':
                                this.fields += " text DEFAULT '' NOT NULL,\n";
                                break;
                        }
                    }

                    // Controllers
                    this.controllerName = configFile.controllers[0].name;
                    if (this.controllerName.includes('Controller') == false) {
                        this.controllerName = this.controllerName + 'Controller';
                    }

                    let controllerActions = configFile.controllers[0].actions;

                    this.controllerActions = [];
                    for (i = 0; i < controllerActions.length; i++) {
                        let actionName = controllerActions[i].name;
                        if (actionName.includes('Action') == false) {
                            actionName += 'Action';
                        }
                        let action = [];
                        action['name'] = actionName;
                        action['nameUcFirst'] = lodash.capitalize(actionName);
                        this.controllerActions.push(action);
                    }

                    // Services
                    this.services = [];
                    configFile.services.forEach(function (service) {
                        this.services.push(service)
                    }, this);

                    // Repositories
                    this.repositoryName = this.modelName + 'Repository';
                    this.repositoryNameLcFirst = lodash.decapitalize(this.repositoryName);


                    this.repositories = [];
                    configFile.repositories.forEach(function (repository) {
                        this.repositories.push(repository)
                    }, this);

                    this.log('Parsing of configuration done.');
                }
            }

        }
    }

    get prompting() {
        return {
            clientPrompts: function () {
                if (this.configFileExists == false) {
                    this.log('No Generator configuration file found! I will guide you through some questions which I need to know to scaffold your extension.\n');

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
                    }]).then(function (answers) {
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

                        this.extKeyForNamespace = lodash.capitalize(this.extKey.replace(/_\w/g, function (matches) {
                            return matches[1].toUpperCase();
                        }));
                        this.extkeyLowerCase = this.extKey.replace(/_/g, '');
                        this.modelName = answers.modelName;
                        this.modelNameLowerCase = this.modelName.toLowerCase();
                        this.repositoryName = this.modelName + 'Repository';
                        this.repositoryNameLcFirst = lodash.decapitalize(this.repositoryName);
                        this.isoDate = new Date().toISOString();
                        this.initGit = answers.initGit;
                        this.initGitFlow = answers.initGitFlow;
                    });
                }
            }
        }
    }

    get configuring() {
        return {
            log: function () {
                this.log('configuring - Saving configurations and configure the project (creating .editorconfig files and other metadata files)')
            }
        }
    }

    get default() {
        return {
            log: function () {
                this.log('default - If the method name doesn\'t match a priority, it will be pushed to this group.')
            }
        };

    }

    get writing() {
        return {
            generateProject: function () {
                const genDir = path.join(__dirname, '../../');

                this.log('Where you write the generator specific files (routes, controllers, etc)');
                this.fs.copyTpl(
                    this.templatePath('README.md'),
                    this.destinationPath('README.md'),
                    {extkey: this.extKey}
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
                        controllerName: this.controllerName.replace('Controller', '')
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

            generateController: function () {
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
                    this.templatePath('Resources/Private/Templates/DefaultController/DefaultTemplate.html'),
                    this.destinationPath('Resources/Private/Templates/' + this.controllerName.replace('Controller', '') + '/List.html')
                );
                this.fs.copyTpl(
                    this.templatePath('Resources/Private/Templates/DefaultController/DefaultTemplate.html'),
                    this.destinationPath('Resources/Private/Templates/' + this.controllerName.replace('Controller', '') + '/Detail.html')
                );
            },

            generateModel: function () {
                // this.composeWith('t3-ext:model', {name: this.modelName});
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
            },

            generateRepository: function () {
                this.composeWith('t3ext:repository', {args: [this.repositoryName, this.authorName, this.authorMail]});

                this.repositories.forEach(function (repository) {
                    this.composeWith('t3ext:repository', {args: [repository.name, this.authorName, this.authorMail]});
                }, this);
            },

            generateTca: function () {
                this.fs.copyTpl(
                    this.templatePath('Configuration/TCA/DefaultTcaDefinition.php'),
                    this.destinationPath('Configuration/TCA/' + this.modelName + '.php'),
                    {
                        extkey: this.extKey,
                        extkeyLowerCase: this.extkeyLowerCase,
                        modelNameLowerCase: this.modelNameLowerCase,
                        tcaFields: this.fieldsTca
                    }
                );
            },

            generateTypoScript: function () {
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
            },

            generateLayout: function () {
                this.fs.copyTpl(
                    this.templatePath('Resources/Private/Layouts/Default.html'),
                    this.destinationPath('Resources/Private/Layouts/Default.html'),
                    {
                        extkeyLowerCase: this.extkeyLowerCase
                    }
                );
            },

            generateLocallang: function () {
                this.composeWith('t3ext:locallang', {extkey: this.extkey, timestamp: this.isoDate});
            },

            generateServices: function () {
                this.services.forEach(function (service) {
                    this.fs.copyTpl(
                        this.templatePath('Classes/Service/DefaultService.php'),
                        this.destinationPath('Classes/Service/' + service.name + '.php'),
                        {
                            extKeyForNamespace: this.extKeyForNamespace,
                            authorName: this.authorName,
                            authorMail: this.authorMail,
                            serviceName: service.name,
                            serviceMethods: service.methods
                        }
                    );
                }, this);

                if (this.addSettingsService) {
                    this.fs.copyTpl(
                        this.templatePath('Classes/Service/SettingsService.php'),
                        this.destinationPath('Classes/Service/SettingsService.php'),
                        {
                            extKeyForNamespace: this.extKeyForNamespace
                        }
                    );
                }
            },

            generateFlexForms: function () {
                this.fs.copyTpl(
                    this.templatePath('Configuration/FlexForms/Flexform_plugin.xml'),
                    this.destinationPath('Configuration/FlexForms/Flexform_plugin.xml'),
                    {
                        extkey: this.extKey
                    }
                );
            }
        };
    }

    get conflicts() {
        return {
            log: function() {
                this.log('conflicts - Where conflicts are handled (used internally)')
            }
        }
    }

    get install() {
        return {
            log: function() {
                this.log('install - Where installation are run (npm, bower)')
            }
        }
    }

    get end() {
        return {
            log: function() {
                this.log('end - Called last, cleanup, say good bye, etc')
            }
        }
    }

}

module.exports = Generator;