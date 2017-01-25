![Image of Yaktocat](t3extgen.png)

# T3ExtGen
A [Yeoman](http://yeoman.io/) generator which scaffolds a TYPO3 extension.

**Warning**: This generator is in a very early stage. A lot of things might not work yet and the API as well the format of the configuration file might change. 

## Features

* Creates a basic extension
    * Controllers
    * Models
    * TypoScript

* Initializes an empty GIT repository
* Initializes GIT Flow
* Add a SettingsService (the one from EXT:news)
* Read configuration from a JSON config file or prompt for questions

### Not working yet
* FlexForm
* SQL
* TCA

## Idea

To create a TYPO3 extension you have a variety of options:  

* Write all by hand 
* Copy 'n' paste from your old extensions
* Checkout an extension project template from GIT and search 'n' replace the extkey
* Use EXT:extensionbuilder

I used all and mixed them till I came to the point where I was bored to copy files from another extensions into the current one.
The thought crossed my mind, that if you have the TCA defined, nearly everything else can be generated from it. 

The configuration file is the outcome of that idea. Defining your model in a TCA-like structure, together with Controllers, Repositories and meta data should be enough to create your extension scaffold.  

## How to use

Install Yeoman and the generator

`$ npm install -g yo generator-t3ext`

To create a new extension you need to change to your TYPO3 installation folder where you like to create the extension.

`$ cd /var/www/example.com/typo3conf/ext && mkdir my_awesome_extension && cd my_awesome_extension`

Inside the directory issue this command:

`$ yo t3ext`

The generator will take the folder name as extension key and is going to ask you a couple of questions which he needs to scaffold the extension. As an alternative you can also provide a JSON configuration file, which gets parsed by the generator. The file have to look like the one below (a specification will follow): 

```javascript
{
  "meta": {
    "title": "My awesome extension",
    "description": "A little description of what the extension does",
    "authors": [
      {
        "name": "Stefano Kowalke",
        "email": "info@arroba-it.de",
        "company": "Arroba IT"
      }
    ],
    "initGit": true,
    "initGitFlow": true,
    "addSettingsService": false
  },
  "models": [{
      "name": "MyModel",
      "properties": [
         {
            "name": "id",
            "type": "int"
         },
         {
            "name": "number",
            "type": "string"
         },
         {
            "name": "title",
            "type": "string"
         },
         {
            "name": "startDate",
            "type": "string"
         },
         {
            "name": "endDate",
            "type": "string"
         },
         {
            "name": "departmentId",
            "type": "string"
         },
         {
            "name": "description",
            "type": "string"
         },
         {
            "name": "additionalInformation",
            "type": "string"
         }
       ]
    }
  ],
    "services": [
      {
        "name": "FileService",
        "methods": [
          {
            "name": "read"
          },
          {
            "name": "getUploadedFileDate"
          }
        ]
      }
    ],
    "repositories": [
      {
        "name": "MyRepository"
      }
    ],
    "controllers": [
     {
        "name": "MyController",
        "actions": [
          {
            "name": "list"
          },
          {
            "name": "detail"
          }
        ]
     }
    ]
}

```