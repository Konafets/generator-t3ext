<?php namespace Skyfillers\<%= extKeyForNamespace %>\Controller;

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