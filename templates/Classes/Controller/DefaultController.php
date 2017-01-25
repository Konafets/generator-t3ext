<?php namespace Skyfillers\<%= extKeyForNamespace %>\Controller;
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

use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

/**
 * Class <%= controllerName %>
 *
 * @package Skyfillers\<%= extKeyForNamespace %>\Controller
 * @author  <%= authorName %> <<%= authorMail %>>
 */
class <%= controllerName %> extends ActionController
{

    /** @var \Skyfillers\<%= extKeyForNamespace %>\Domain\Repository\<%= repositoryName %> */
    protected $<%= repositoryNameLcFirst %>;

    /**
     * @param \Skyfillers\<%= extKeyForNamespace %>\Domain\Repository\<%= repositoryName %> $<%= repositoryNameLcFirst %>
     * @return void
     */
    public function inject<%= repositoryName %>(\Skyfillers\<%= extKeyForNamespace %>\Domain\Repository\<%= repositoryName %> $<%= repositoryNameLcFirst %>)
    {
        $this-><%= repositoryNameLcFirst %> = $<%= repositoryNameLcFirst %>;
    }
<% controllerActions.forEach(function (action) {%>
       <%-include('action.ejs', {actionName: action.name, actionNameUcFirst: action.nameUcFirst}) %>
<% }); %>
}