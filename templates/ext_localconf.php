<?php

if ( ! defined('TYPO3_MODE')) {
    die ('Access denied.');
}
\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
    'Skyfillers.' . $_EXTKEY,
    'Pi1',
    [
        '<%= controllerName %>' => 'list,detail',
    ], // non-cacheable actions
    [
        '<%= controllerName %>' => 'list,detail',
    ]
);