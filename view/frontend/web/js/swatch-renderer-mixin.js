define([
    'jquery',
    'Magento_Catalog/js/price-utils',
    'dropdownDialog'
], function ($, priceUtils, dropdownDialog) {
    'use strict';
    return function (widget) {
        console.log('Hello from SwatchExtend');

        $.widget('mage.SwatchRenderer', widget, {

        /**
         * Formats the price with currency format
         *
         * @param {number} price
         * @return {string}
         */
        getFormattedPrice: function (price) {
            var priceFormat = {
                decimalSymbol: '.',
                groupLength: 3,
                groupSymbol: ",",
                integerRequired: false,
                pattern: "$%s",
                precision: 2,
                requiredPrecision: 2
            };
            return priceUtils.formatPrice(price, priceFormat);
        },

        /**
         * Render controls
         *
         * @private
         */
        _RenderControls: function () {
            var $widget = this,
                container = this.element,
                classes = this.options.classes,
                chooseText = this.options.jsonConfig.chooseText,
                showTooltip = this.options.showTooltip;
            $widget.optionsMap = {};

            $.each(this.options.jsonConfig.attributes, function (key, value) {
                var item = this;
                    $widget.optionsMap[item.id] = {};

                    // Aggregate options array to hash (key => value)
                    $.each(item.options, function () {
                        if (this.products.length > 0) {
                            $widget.optionsMap[item.id][this.id] = {
                                price: parseInt(
                                    $widget.options.jsonConfig.optionPrices[this.products[0]].finalPrice.amount,
                                    10
                                ),
                                products: this.products
                            };
                        }
                    });
                    var controlLabelId = 'option-label-' + item.code + '-' + item.id,
                    options = $widget._RenderSwatchOptions(item, controlLabelId, $widget),
                    select = $widget._RenderSwatchSelect(item, chooseText),
                    input = $widget._RenderFormInput(item),
                    listLabel = '',
                    label = '';

                // Show only swatch controls
                if ($widget.options.onlySwatches && !$widget.options.jsonSwatchConfig.hasOwnProperty(item.id)) {
                    return;
                }

                if ($widget.options.enableControlLabel) {
                    label +=
                        '<span id="' + controlLabelId + '" class="' + classes.attributeLabelClass + '">' +
                        $('<i></i>').text(item.label).html() +
                        '</span>' +
                        '<span class="' + classes.attributeSelectedOptionLabelClass + '"></span>';                    
                }

                if ($widget.inProductList) {
                    $widget.productForm.append(input);
                    input = '';
                    listLabel = 'aria-label="' + $('<i></i>').text(item.label).html() + '"';
                } else {
                    listLabel = 'aria-labelledby="' + controlLabelId + '"';
                }

                // Create new control
                if($widget.options.jsonConfig.attributes[key].code == 'size' && $widget.options.jsonConfig.getattribute != null) {
                    container.append(
                        '<div class="' + classes.attributeClass + ' ' + item.code + '" ' +
                            'attribute-code="' + item.code + '" ' +
                            'attribute-id="' + item.id + '">' +
                        //Show attribute chart
                        $widget.options.jsonConfig.attributes[key].label + '<div data-block="dropdown" class="minicart-wrapper">' +
                        '<span class="action" data-trigger="trigger" style="cursor: pointer;">'+'Content Size Chart'+ '</span>'+'</div>'
                        +'<div class="block block-minicart" data-role="dropdownDialog">'
                        +'<div class ="minicart-content-wrapper">'+ $widget.options.jsonConfig.getattribute +'</div>'+'</div>' +
                                '<div aria-activedescendant="" ' +
                                     'tabindex="0" ' +
                                     'aria-invalid="false" ' +
                                     'aria-required="true" ' +
                                     'role="listbox" ' + listLabel +
                                     'class="' + classes.attributeOptionsWrapper + ' clearfix">' +
                                    options + select +
                                '</div>' + input +
                            '</div>'
                        );
                    }
                else {
                    container.append(
                        '<div class="' + classes.attributeClass + ' ' + item.code + '" ' +
                            'attribute-code="' + item.code + '" ' +
                            'attribute-id="' + item.id + '">' +
                                 
                            $widget.options.jsonConfig.attributes[key].label +
                            '<div aria-activedescendant="" ' +
                                     'tabindex="0" ' +
                                     'aria-invalid="false" ' +
                                     'aria-required="true" ' +
                                     'role="listbox" ' + listLabel +
                                     'class="' + classes.attributeOptionsWrapper + ' clearfix">' +
                                    options + select +
                            '</div>' + input +
                        '</div>'
                    );
                }
                $('.block-minicart').dropdownDialog({
                    appendTo: "[data-block=dropdown]",
                    triggerTarget: "[data-trigger=trigger]",
                    closeOnMouseLeave: false,
                    closeOnEscape: true,
                    timeout: 2000,
                    triggerClass: 'active',
                    parentClass: 'active',
                    buttons: []
                });
                // End create new control

            $widget.optionsMap[item.id] = {};



                // Aggregate options array to hash (key => value)
                $.each(item.options, function () {
                    if (this.products.length > 0) {
                        $widget.optionsMap[item.id][this.id] = {
                            price: parseInt(
                                $widget.options.jsonConfig.optionPrices[this.products[0]].finalPrice.amount,
                                10
                            ),
                            products: this.products
                        };
                    }
                });
            });


            if (showTooltip === 1) {
                // Connect Tooltip
                container
                    .find('[option-type="1"], [option-type="2"], [option-type="0"], [option-type="3"]')
                    .SwatchRendererTooltip();
            }

            // Hide all elements below more button
            $('.' + classes.moreButton).nextAll().hide();

            // Handle events like click or change
            $widget._EventListener();

            // Rewind options
            $widget._Rewind(container);

            //Emulate click on all swatches from Request
            $widget._EmulateSelected($.parseQuery());
            $widget._EmulateSelected($widget._getSelectedAttributes());
        },

         /**
         * Render swatch options by part of config
         *
         * @param {Object} config
         * @param {String} controlId
         * @returns {String}
         * @private
         */
        _RenderSwatchOptions: function (config, controlId, $widget) {
            var optionConfig = this.options.jsonSwatchConfig[config.id],
                optionClass = this.options.classes.optionClass,
                sizeConfig = this.options.jsonSwatchImageSizeConfig,
                moreLimit = parseInt(this.options.numberToShow, 10),
                moreClass = this.options.classes.moreButton,
                moreText = this.options.moreButtonText,
                countAttributes = 0,
                html = '';

            if (!this.options.jsonSwatchConfig.hasOwnProperty(config.id)) {
                return '';
            }

            $.each(config.options, function (index) {
                var id,
                    type,
                    value,
                    thumb,
                    label,
                    width,
                    height,
                    attr,
                    swatchImageWidth,
                    swatchImageHeight;

                if (!optionConfig.hasOwnProperty(this.id)) {
                    return '';
                }

                // Add more button
                if (moreLimit === countAttributes++) {
                    html += '<a href="#" class="' + moreClass + '"><span>' + moreText + '</span></a>';
                }

                id = this.id;
                type = parseInt(optionConfig[id].type, 10);
                value = optionConfig[id].hasOwnProperty('value') ?
                    $('<i></i>').text(optionConfig[id].value).html() : '';
                thumb = optionConfig[id].hasOwnProperty('thumb') ? optionConfig[id].thumb : '';
                width = _.has(sizeConfig, 'swatchThumb') ? sizeConfig.swatchThumb.width : 110;
                height = _.has(sizeConfig, 'swatchThumb') ? sizeConfig.swatchThumb.height : 90;
                label = this.label ? $('<i></i>').text(this.label).html() : '';
                attr =
                    ' id="' + controlId + '-item-' + id + '"' +
                    ' index="' + index + '"' +
                    ' aria-checked="false"' +
                    ' aria-describedby="' + controlId + '"' +
                    ' tabindex="0"' +
                    ' option-type="' + type + '"' +
                    ' option-id="' + id + '"' +
                    ' option-label="' + label + '"' +
                    ' aria-label="' + label + '"' +
                    ' option-tooltip-thumb="' + thumb + '"' +
                    ' option-tooltip-value="' + value + '"' +
                    ' role="option"' +
                    ' thumb-width="' + width + '"' +
                    ' thumb-height="' + height + '"';

                swatchImageWidth = _.has(sizeConfig, 'swatchImage') ? sizeConfig.swatchImage.width : 30;
                swatchImageHeight = _.has(sizeConfig, 'swatchImage') ? sizeConfig.swatchImage.height : 20;

                if (!this.hasOwnProperty('products') || this.products.length <= 0) {
                    attr += ' option-empty="true"';
                }

                if (type === 0) {
                    // Text
                    html += '<div class="' + optionClass + ' text" ' + attr + '>' + (value ? value : label) +
                        '</div>';
                   } else if (type === 1) {
                    // Color
                    html += '<div class="swatch-option-container"' + ' style="float:left;">' +
                            '<div class="' + optionClass + ' color" ' + attr +
                            ' style="background: ' + value +
                            ' no-repeat center; background-size: initial; float:none;">' + '' +
                            '</div>' +
                            '<div class ="swatch-option-price">'+ '$'+ $widget.optionsMap[config.id][id]['price'] +'.00'+ '</div>' +
                            '</div>';
                    /*html += '<div class ="swatch-option-price">'+ $widget.optionsMap[config.id][id]['price'] + '</div>';*/
                } else if (type === 2) {
                    // Image
                    html += '<div class="' + optionClass + ' image" ' + attr +
                        ' style="background: url(' + value + ') no-repeat center; background-size: initial;width:' +
                        swatchImageWidth + 'px; height:' + swatchImageHeight + 'px">' + '' +
                        '</div>';
                } else if (type === 3) {
                    // Clear
                    html += '<div class="' + optionClass + '" ' + attr + '></div>';
                } else {
                    // Default
                    html += '<div class="' + optionClass + '" ' + attr + '>' + label + '</div>';
                }
            });
            return html;
        },

        });

        return $.mage.SwatchRenderer;
    }

    return {
        /**
         * Formats the price with currency format
         *
         * @param {number} price
         * @return {string}
         */
        getFormattedPrice: function (price) {
            console.log('Hello test function');
            var priceFormat = {
                decimalSymbol: '.',
                groupLength: 3,
                groupSymbol: ",",
                integerRequired: false,
                pattern: "$%s",
                precision: 2,
                requiredPrecision: 2
            };
            return priceUtils.formatPrice(price, priceFormat);
        }
    }
});