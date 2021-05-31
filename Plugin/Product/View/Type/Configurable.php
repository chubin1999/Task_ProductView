<?php
/**
 * Catalog super product configurable part block
 *
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace AHT\ProductView\Plugin\Product\View\Type;

use Magento\Framework\Json\EncoderInterface;
use Magento\Framework\Json\DecoderInterface;
use Magento\Catalog\Model\Product;

class Configurable
{
    protected $jsonEncoder;

    protected $jsonDecoder;

    protected $modelProduct;

    public function __construct(
        EncoderInterface $jsonEncoder,
        DecoderInterface $jsonDecoder,
        Product $modelProduct
    ) {

        $this->jsonDecoder = $jsonDecoder;
        $this->jsonEncoder = $jsonEncoder;
        $this->modelProduct = $modelProduct;
    }

    public function afterGetJsonConfig(
        \Magento\ConfigurableProduct\Block\Product\View\Type\Configurable $subject, $config
    )
    {
        $config = $this->jsonDecoder->decode($config);
        $getAttribute = [];
        $currentProduct = $subject->getProduct();
        $getAttributeConf = $currentProduct->getData('editor_data');

        $config['getattribute'] = $getAttributeConf;

        return $this->jsonEncoder->encode($config);
    }
}