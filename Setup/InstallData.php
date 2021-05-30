<?php
namespace AHT\ProductView\Setup;

use Magento\Eav\Setup\EavSetup;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

class InstallData implements InstallDataInterface
{
    private $eavSetupFactory;

    public function __construct(EavSetupFactory $eavSetupFactory)
    {
        $this->eavSetupFactory = $eavSetupFactory;
    }

    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);
        $eavSetup->removeAttribute(\Magento\Catalog\Model\Category::ENTITY, 'editor_data');
        $eavSetup->addAttribute(
            \Magento\Catalog\Model\Product::ENTITY,
            'editor_data',
            [
                'group' => 'General',
                'label' => 'Content Size Chart',
                'type' => 'text',
                'input' => 'textarea',
                'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                'required' => false,
                'sort_order' => 25,
                'searchable' => true,
                'comparable' => true,
                'wysiwyg_enabled' => true,
                'is_html_allowed_on_front' => true,
                'visible_in_advanced_search' => true

            ]
        );
    }
}