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


    /**
     * The list action
     *
     * @return void
     */
    public function listAction()
    {
        $this->view->assign('output', 'Hello World from the list action');
    }


    /**
     * Detail action
     *
     * @param $id
     * @return void
     */
    public function detailAction($id)
    {
        $this->view->assign('output', 'Hello World from the detail action');
    }
}