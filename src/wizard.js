// Author: Zac Echola <zac.echola@so.mnscu.edu>

;(function ($, window, document, undefined) {
    'use strict';

    // Create the defaults
    var pluginName = "wizardBuilder",
        defaults = {
            // Bootstrap nav specific:
            modifierClass: "pills", // pills, tabs
            justified: false,  // false, true
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
            try {
               var headerText = [], list;

                $(this.options.headerElement).each(function() {
                    headerText.push($(this).text());
                });
               
                list = $('<ul>');
                list.addClass('wizard-nav nav nav-' + this.options.modifierClass);

                $.each(headerText, function(i) {
                    var li, a;
                    li = $('<li>')
                        .appendTo(list);
                    a = $('<a>')
                        .attr('href', '#')
                        .text(headerText[i])
                        .appendTo(li);
                });
                
                $(el).prepend(list);

                // Add optional classes
                if (this.options.justified) {
                    list.addClass('nav-justified');
                }

            } catch (e) {
                console.log(e);
            }
        },

        createButtons: function (el) {
            try {
                var btnSize = this.options.buttonSize,
                    nextOption = this.options.nextOption,
                    previousOption = this.options.previousOption,
                    buttonGroup, prevButton, nextButton;


                buttonGroup = $('<div>')
                    .addClass('wizard-btn-group btn-group pull-right');

                prevButton = $('<button>')
                    .attr('type', 'button')
                    .addClass('prev-btn btn btn-' + previousOption)
                    .html('&larr; Previous')
                    .appendTo(buttonGroup);

                nextButton = $('<button>')
                    .attr('type', 'button')
                    .addClass('next-btn btn btn-' + nextOption)
                    .html('Next &rarr;')
                    .appendTo(buttonGroup);

                $(el).append(buttonGroup);

                // Add size class if necessary
                if (btnSize !== "") {
                    $('button').addClass('btn-' + btnSize);
                }

            } catch (e) {
                console.log(e);
            }
        },

        state: function (el, options) {

            // Initial state on ready
            if ($('.wizard-nav .active') !== []) {
                $('.wizard-nav li').first().addClass('active');
                $(this.options.chunkClassName + ':gt(0)').each(function() {
                    $(this).addClass('hide');
                });
                $('.prev-btn').addClass('disabled');
            }

            var CurrentState = {
                activeNav: $('.wizard-nav li.active'),
                nextNav:  $('.wizard-nav .active').next(),
                prevNav:  $('.wizard-nav .active').prev(),
                activeChunk:   $(this.options.chunkClassName).not('.hide'),
                nextChunk:  $(this.options.chunkClassName).not('.hide').next(this.options.chunkClassName),
                prevChunk:   $(this.options.chunkClassName).not('.hide').prev(this.options.chunkClassName),
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
            };


            // UI bindings

            $('.wizard-btn-group').on('click', function() {
                navButtonEnableDisable();
            });
            

            // TODO: DRY these three bindings into a single function
            $('.wizard-btn-group .next-btn').on('click', function() {

                $(CurrentState.activeNav).removeClass('active');
                $(CurrentState.nextNav).addClass('active');
                
                CurrentState.activeNav = $('.wizard-nav .active');
                CurrentState.nextNav = CurrentState.activeNav.next();
                CurrentState.prevNav = CurrentState.activeNav.prev();

                $(CurrentState.activeChunk).addClass('hide');
                $(CurrentState.nextChunk).removeClass('hide');

                CurrentState.activeChunk = $(options.chunkClassName).not('.hide');
                CurrentState.nextChunk = CurrentState.activeChunk.next(options.chunkClassName);
                CurrentState.prevChunk = CurrentState.activeChunk.prev(options.chunkClassName);

            });

            $('.wizard-btn-group .prev-btn').on('click', function() {

                $(CurrentState.activeNav).removeClass('active');
                $(CurrentState.prevNav).addClass('active');
                
                CurrentState.activeNav = $('.wizard-nav .active');
                CurrentState.nextNav = CurrentState.activeNav.next();
                CurrentState.prevNav = CurrentState.activeNav.prev();

                $(CurrentState.activeChunk).addClass('hide');
                $(CurrentState.prevChunk).removeClass('hide');

                CurrentState.activeChunk = $(options.chunkClassName).not('.hide');
                CurrentState.nextChunk = CurrentState.activeChunk.next(options.chunkClassName);
                CurrentState.prevChunk = CurrentState.activeChunk.prev(options.chunkClassName);

            });

            $('.wizard-nav a').on('click', function() {

                // TODO: Make this handle multiple headerElements with the same name.
                
                var $clickedNav = $(this),
                    classOption = options.chunkClassName,
                    headerOption = options.headerElement,
                    map = $(classOption + ' ' + headerOption + ':contains(' + $clickedNav.text() + ')'),
                    mappedChunk = map.closest('section');
                
                $(CurrentState.activeNav).removeClass('active');
                $($clickedNav).closest('li').addClass('active');
                
                CurrentState.activeNav = $('.wizard-nav .active');
                CurrentState.nextNav = CurrentState.activeNav.next();
                CurrentState.prevNav = CurrentState.activeNav.prev();

                $(CurrentState.activeChunk).addClass('hide');
                $(mappedChunk).removeClass('hide');

                CurrentState.activeChunk = $(options.chunkClassName).not('.hide');
                CurrentState.nextChunk = CurrentState.activeChunk.next(options.chunkClassName);
                CurrentState.prevChunk = CurrentState.activeChunk.prev(options.chunkClassName);

                navButtonEnableDisable();
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

})(jQuery, window, document);
