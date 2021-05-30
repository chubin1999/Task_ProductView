<?php
namespace AHT\ProductView\Plugin;

class PluginConfig
{
    /*public function aroundGetName($interceptedInput)
    {
   	 return "Name of product";
    }
*/
    protected function afterGetRendererTemplate(\Magento\Swatches\Block\Product\Renderer\Configurable $subject, $result)
    {
        return 'AHT_ProductView::product/view/renderer.phtml';
        /*return $this->isProductHasSwatchAttribute() ?
            self::SWATCH_RENDERER_TEMPLATE : self::CONFIGURABLE_RENDERER_TEMPLATE;*/
    }
}