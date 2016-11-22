<?php
/***************************************************************
 * Extension Manager/Repository config file for ext "<%= extkey %>".
 *
 * Manual updates:
 * Only the data in the array - everything else is removed by next
 * writing. "version" and "dependencies" must not be touched!
 ***************************************************************/
$EM_CONF[$_EXTKEY] = [
  'title' => '<%= title %>',
  'description' => '<%= description %>',
  'category' => 'plugin',
  'version' => '0.0.1',
  'state' => 'alpha',
  'uploadfolder' => true,
  'createDirs' => '',
  'clearcacheonload' => true,
  'author' => '<%= authorName %>',
  'author_email' => '<%= authorMail %>',
  'author_company' => '<%= authorCompany %>',
  'constraints' =>
      [
        'depends' =>
        [
          'typo3' => '7.6.0-7.6.999',
          'php' => '5.4.0-7.0.999',
        ],
        'conflicts' => [],
        'suggests' => [],
      ],
];