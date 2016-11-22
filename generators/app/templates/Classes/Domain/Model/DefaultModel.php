<?php namespace Skyfillers\<%= extKeyForNamespace %>\Domain\Model;
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
use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
/**
 * Class <%= modelName %>
 *
 * @package Skyfillers\<%= extKeyForNamespace %>\Domain\Model
 * @author  <%= authorName %> <<%= authorMail %>>
 */
class <%= modelName %> extends AbstractEntity
{
    /** @var string $title */
    protected $title;

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param $title
     * @return void
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }
}