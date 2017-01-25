<?php namespace Skyfillers\<%= extKeyForNamespace %>\Service;

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

use TYPO3\CMS\Core\SingletonInterface;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;
use TYPO3\CMS\Extbase\Reflection\ObjectAccess;

/**
 * Provide a way to get the configuration just everywhere
 *
 * Example
 * $pluginSettingsService =
 * $this->objectManager->get('Tx_News_Service_SettingsService');
 * t3lib_div::print_array($pluginSettingsService->getSettings());
 *
 * If objectManager is not available:
 * http://forge.typo3.org/projects/typo3v4-mvc/wiki/
 * Dependency_Injection_%28DI%29#Creating-Prototype-Objects-through-the-Object-Manager
 *
 * @author Stefano Kowalke <s.kowalke@skyfillers.com>, Skyfillers GmbH
 * @author Sebastian Schreiber <me@schreibersebastian.de>
 * @author Georg Ringer <typo3@ringerge.org>
 */
class SettingsService implements SingletonInterface
{

    /**
     * @var mixed
     */
    protected $configuration;

    /**
     * @var \TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface
     */
    protected $configurationManager;


    /**
     * @param \TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface $configurationManager
     * @return void
     */
    public function injectConfigurationManager(
        \TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface $configurationManager
    ) {
        $this->configurationManager = $configurationManager;
    }


    /**
     * Returns the TS configuration
     *
     * @return array|mixed
     */
    public function getConfiguration()
    {
        if ($this->configuration === null) {
            $this->configuration = $this->configurationManager->getConfiguration(
                ConfigurationManagerInterface::CONFIGURATION_TYPE_FRAMEWORK
            );
        }

        return $this->configuration;
    }


    /**
     * Returns the settings at path $path, which is separated by ".",
     * e.g. "pages.uid".
     * "pages.uid" would return $this->settings['pages']['uid'].
     *
     * If the path is invalid or no entry is found, false is returned.
     *
     * @param string $path
     * @return mixed
     */
    public function getByPath($path)
    {
        $configuration = $this->getConfiguration();

        $setting = ObjectAccess::getPropertyPath($configuration, $path);
        if ($setting === null) {
            $setting = ObjectAccess::getPropertyPath($configuration['settings'], $path);
        }

        return $setting;
    }
}