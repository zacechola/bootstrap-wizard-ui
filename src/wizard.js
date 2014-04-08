// Author: Zac Echola <zac.echola@so.mnscu.edu>

;(function ($, window, document, undefined) {
    'use strict';

    // Create the defaults
    var pluginName = "wizardBuilder",
        defaults = {
            // Bootstrap nav specific:
            modifierClass: "pills", // pills, tabs
            justified: true,  // false, true
            /* currently unimplemented
            dropdowns: false, // false, true
            stacked: false,  // false, true
            */
            
            // Bootstrap button specific:
            buttonSize: "", // "", lg, sm, xs
            nextOption: "primary", // primary, default, success, info, warning, danger, link
            previousOption: "default", // primary, default, success, info, warning, danger, link
            // chevronGlyphicons: false, // currently unimplemented

            // These are opinions, feel free to have your own
            headerElement: "h2",
            chunkClassName: ".chunk",

            // TODO: Allow for dropdown menus, but how to display in wizard?

        };

    // Plugin constructor
    function Plugin (element, options) {
        this.element = element;
        this.options = $.extend( {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function () {

            // Build the UI elements
            this.createNav(this.element);
            this.createButtons(this.element);

            // Manage the app state
            this.state(this.element, this.options);

        },

        createNav: function (el) {
            var headerText = [], list;

            $(this.options.headerElement).each(function() {
                headerText.push($(this).text());
            });
            
            list = $('<ul>');
            list.addClass('wizard-nav nav nav-' + this.options.modifierClass);
            list.attr('role', 'tablist');

            $.each(headerText, function(i) {
                var li, a;
                li = $('<li>')
                    .attr('role', 'presentation')
                    .appendTo(list);
                a = $('<a>')
                    .attr('href', '#')
                    .attr('role', 'tab')
                    .text(headerText[i])
                    .appendTo(li);
            });
            
            $(el).prepend(list);

            // Add optional classes
            if (this.options.justified) {
                list.addClass('nav-justified');
            }

        },

        createButtons: function (el) {
            var btnSize = this.options.buttonSize,
                nextOption = this.options.nextOption,
                previousOption = this.options.previousOption,
                buttonGroup, prevButton, nextButton;


            buttonGroup = $('<div>')
                .addClass('wizard-btn-group btn-group');

            prevButton = $('<button>')
                .attr('type', 'button')
                .attr('role', 'button')
                .addClass('prev-btn btn btn-' + previousOption)
                .html('&larr; Previous')
                .appendTo(buttonGroup);

            nextButton = $('<button>')
                .attr('type', 'button')
                .attr('role', 'button')
                .addClass('next-btn btn btn-' + nextOption)
                .html('Next &rarr;')
                .appendTo(buttonGroup);

            $(el).append(buttonGroup);

            // Add size class if necessary
            if (btnSize !== "") {
                $('button').addClass('btn-' + btnSize);
            }

        },

        state: function (el, options) {
            // Initial state on ready
            if ($(el).find('.wizard-nav .active') !== []) {
                $(el).find('.wizard-nav li').first().addClass('active');
                $(this.options.chunkClassName + ':gt(0)').each(function() {
                    $(this).addClass('hide');
                    $(this).attr('aria-hidden', 'true');
                });
                $(el).find('.prev-btn').addClass('disabled');
            }

            var CurrentState = {
                activeNav: $(el).find('.wizard-nav li.active'),
                nextNav:  $(el).find('.wizard-nav .active').next(),
                prevNav:  $(el).find('.wizard-nav .active').prev(),
                activeChunk:   $(el).find(this.options.chunkClassName).not('.hide'),
                nextChunk:  $(el).find(this.options.chunkClassName).not('.hide').next(this.options.chunkClassName),
                prevChunk:   $(el).find(this.options.chunkClassName).not('.hide').prev(this.options.chunkClassName),
            },


            navButtonEnableDisable = function() {
                var $activeNav = $('.wizard-nav .active');

                if ($activeNav.next().length === 0) {
                    $('.next-btn').addClass('disabled');
                } else if ($activeNav.next().length !== 0) {
                    $('.next-btn').removeClass('disabled');
                }

                if ($activeNav.prev().length === 0) {
                    $('.prev-btn').addClass('disabled');
                } else if ($activeNav.prev().length !== 0) {
                    $('.prev-btn').removeClass('disabled');
                }
            },

            navState = function(direction) {
                var $clickedNav = (typeof direction !== 'string') ? direction : null;
                    
                if ($clickedNav) {
                    var map = $(options.chunkClassName + ' ' + options.headerElement + ':contains(' + $clickedNav.text() + ')'),
                    mappedChunk = map.closest(options.chunkClassName);
                }

                $(CurrentState.activeNav).removeClass('active');

                if (direction === 'next') {
                    $(CurrentState.nextNav)
                        .addClass('active')
                        .find('a').focus();
                } else if (direction === 'prev') {
                    $(CurrentState.prevNav)
                        .addClass('active')
                        .find('a').focus();
                } else {
                    $($clickedNav).closest('li')
                        .addClass('active')
                        .find('a').focus();
                }


                CurrentState.activeNav = $('.wizard-nav .active');
                CurrentState.nextNav = CurrentState.activeNav.next();
                CurrentState.prevNav = CurrentState.activeNav.prev();

                $(CurrentState.activeChunk).addClass('hide');
                $(CurrentState.activeChunk).attr('aria-hidden', 'true');

                if (direction === 'next') {
                    $(CurrentState.nextChunk).removeClass('hide');
                    $(CurrentState.nextChunk).attr('aria-hidden', 'false');
                } else if (direction === 'prev') {
                    $(CurrentState.prevChunk).removeClass('hide');
                    $(CurrentState.prevChunk).attr('aria-hidden', 'false');
                } else {
                    $(mappedChunk).removeClass('hide');
                    $(mappedChunk).attr('aria-hidden', 'false');
                }


                CurrentState.activeChunk = $(options.chunkClassName).not('.hide');
                CurrentState.nextChunk = CurrentState.activeChunk.next(options.chunkClassName);
                CurrentState.prevChunk = CurrentState.activeChunk.prev(options.chunkClassName);

                if ($clickedNav) {
                    navButtonEnableDisable();
                }
            },

            // Keyboard 
            checkKey = function(e) {
                var $activeNav = $('.wizard-nav .active');

                e = e || window.event;

                if (e.keyCode == '37' && !$('.prev-btn').hasClass('disabled')) {
                    navState('prev');
                }
                else if (e.keyCode == '39' && !$('.next-btn').hasClass('disabled')) {
                    navState('next');
                }

                navButtonEnableDisable();

            };


            // UI bindings
            document.onkeydown = checkKey;

            $('.wizard-btn-group').on('click', function() {
                navButtonEnableDisable();
            });

            $('.wizard-btn-group .next-btn').on('click', function() {
                navState('next');
            });

            $('.wizard-btn-group .prev-btn').on('click', function() {
                navState('prev');
            });

            $('.wizard-nav a').on('click', function() {
                // TODO: Make this handle multiple headerElements with the same name.
                navState($(this));
            });
        },
    };

    // Wrapper
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin(this, options));
            }
        });
    };

    // Data-API
    $(document).ready(function() {
        $('[data-wizard="wizard"]').each(function() {

            var $sections = $('[data-wizard="section"]'),
                headerName;

            // Add chunk class to each chunk
            $sections.addClass('chunk');

            // Find appropriate headers
            $sections.find(':header').first(function() {
                headerName = $(this).prop('tagName');
            });

            // Bind wizardBuilder
            $(this).wizardBuilder({ 
                headerElement: headerName
            });
        });
    });

})(jQuery, window, document);
