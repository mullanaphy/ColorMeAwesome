/*
 * ColorMeAwesome 1.0.0
 *
 * Copyright (c) 2013 John Mullanaphy. <http://jo.mu/>
 * Color Me Awesome may be freely distributed under the Open Software License (OSL 3.0).
 */
(function(root) {

    /**
     * Use the build in Array.isArray if it exists, otherwise we'll check for [object Array]. Note, we're using this
     * polyfill internally so no need to attach it to root since that isn't my right.
     *
     * @type {Function}
     * @param item
     * @ignore
     */
    var isArray = Array.isArray || function(item) {
        return '[object Array]' === Object.prototype.toString.call(item);
    };

    /**
     * Internal function for converting our #hex into a nice friendly rgb object.
     *
     * @param {String} color
     * @returns {{r: Number, g: Number, b: Number}}
     * @ignore
     */
    var parseColor = function(color) {
        if (color.length === 4) {
            color = '#' + color.substring(1, 2) + color.substring(1, 2) + color.substring(2, 3) + color.substring(2, 3) + color.substring(3) + color.substring(3);
        }
        return {
            r: parseInt(color.substring(1, 3), 16),
            g: parseInt(color.substring(3, 5), 16),
            b: parseInt(color.substring(5, 7), 16)
        };
    };

    /**
     * You can ignore this function for the most part. It just handles our lazy loading of colors.
     *
     * @param {ColorMeAwesome} c
     * @ignore
     */
    var generate = function(c) {
        if (c.generated === false) {
            c.generated = [c.colors[0]];
            var colors = [];
            var colorsLength = c.colors.length;
            for (var i = 0; i < colorsLength; ++i) {
                colors.push(parseColor(c.colors[i]));
            }
            generate[c.weighted ? 'weighted' : 'balanced'](c, colors);
        }
    };

    /**
     * Generate the zones between 2 numbers.
     *
     * @param {ColorMeAwesome} c
     * @param {{r: Number, g: Number, b: Number}} min
     * @param {{r: Number, g: Number, b: Number}} max
     * @param {Number} iterationSteps
     * @ignore
     */
    generate.zone = function(c, min, max, iterationSteps) {
        var steps = {
            r: (max.r - min.r) / iterationSteps,
            g: (max.g - min.g) / iterationSteps,
            b: (max.b - min.b) / iterationSteps
        };
        for (var i = 1; i <= iterationSteps; ++i) {
            var colors = [
                (Math.floor(min.r + (steps.r * i)).toString(16)),
                (Math.floor(min.g + (steps.g * i)).toString(16)),
                (Math.floor(min.b + (steps.b * i)).toString(16))
            ];
            for (var j = 0; j <= 2; ++j) {
                if (colors[j].length === 1) {
                    colors[j] = '0' + colors[j];
                }
            }
            c.generated.push('#' + colors.join(''));
        }
    };

    /**
     * Generate our generic balanced gradients.
     *
     * @param {ColorMeAwesome} c
     * @param {Array} colors
     * @ignore
     */
    generate.balanced = function(c, colors) {
        var colorsLength = colors.length;
        var colorZones = colorsLength - 1;
        var totalSteps = c.steps - colorsLength;
        var stepsPerZone = Math.floor(totalSteps / colorZones) + 1;
        var lastZone = totalSteps % colorZones;
        for (var i = 0; i < colorZones; ++i) {
            generate.zone(c, colors[i], colors[i + 1], stepsPerZone + (i === colorZones - 1 ? lastZone : 0));
        }
    };

    /**
     * Generate our graded gradients.
     *
     * @param {ColorMeAwesome} c
     * @param {Array} colors
     * @ignore
     */
    generate.weighted = function(c, colors) {
        var colorZones = c.steps.length;
        for (var i = 0; i < colorZones; ++i) {
            generate.zone(c, colors[i], colors[i + 1], c.steps[i]);
        }
    };

    /**
     * Call ColorMeAwesome, passing along an array of colors to use and the amounts of steps to take between them.
     *
     * Steps can also be a weighted array to have different levels of color changes between your colors. Note, if it is
     * an array, it should be steps.length = colors.length - 1.
     *
     * @param {Array} colors An array of colors to use #hex
     * @param {Number|Array} steps Number of steps to take or weighted ranges
     * @constructor
     */
    var ColorMeAwesome = function(colors, steps) {
        this.reset();
        this.setColors(colors);
        this.setSteps(steps);
    };

    /**
     * Reset our values to the default ColorMeAwesome.
     *
     * @returns {*}
     */
    ColorMeAwesome.prototype.reset = function() {
        this.empty();
        this.colors = ['#ffffff', '#000000'];
        this.steps = 10;
        this.numberOfSteps = 10;
        this.weighted = false;
        return this;
    };

    /**
     * Reset our values to the default ColorMeAwesome.
     *
     * @returns {*}
     */
    ColorMeAwesome.prototype.empty = function() {
        this.generated = false;
        return this;
    };

    /**
     * Set our steps to take. Each step is a stop point between our min and max colors.
     *
     * @param {Number|Array} steps
     * @returns {*}
     */
    ColorMeAwesome.prototype.setSteps = function(steps) {
        this.empty();
        this.weighted = isArray(steps);
        if (this.weighted) {
            this.steps = steps;
            this.numberOfSteps = 1;
            for (var i = 0, count = this.steps.length; i < count; ++i) {
                this.numberOfSteps += this.steps[i];
            }
        } else {
            this.steps = steps || 10;
            this.numberOfSteps = this.steps;
        }
        return this;
    };

    /**
     * Get our steps.
     *
     * @returns {Number|Array}
     */
    ColorMeAwesome.prototype.getSteps = function() {
        return this.steps;
    };

    /**
     * Set our colors to use.
     *
     * @param {Array} colors An array of colors
     * @returns {*}
     */
    ColorMeAwesome.prototype.setColors = function(colors) {
        this.empty();
        this.colors = colors;
        return this;
    };

    /**
     * Get all of our generated colors.
     *
     * @returns {Array}
     */
    ColorMeAwesome.prototype.getColors = function() {
        return this.colors;
    };

    /**
     * Get all of our generated colors.
     *
     * @returns {Array}
     */
    ColorMeAwesome.prototype.getGeneratedColors = function() {
        generate(this);
        return this.generated;
    };

    /**
     * Get a color at a given step.
     *
     * @param step
     * @returns {*}
     */
    ColorMeAwesome.prototype.getColorByStep = function(step) {
        generate(this);
        if (step < 0 || !step) {
            return this.generated[0];
        } else if (step > this.numberOfSteps) {
            return this.generated[this.numberOfSteps];
        } else {
            return this.generated[step];
        }
    };

    /**
     * Get a color based on percentage.
     *
     * @param percent
     * @returns {*}
     */
    ColorMeAwesome.prototype.getColorByPercent = function(percent) {
        return this.getColorByStep(Math.floor((percent / 100) * (this.numberOfSteps - 1)));
    };

    /**
     * Return a our total number of steps we're going to be taking.
     *
     * @returns {Number}
     */
    ColorMeAwesome.prototype.getNumberOfSteps = function() {
        return this.numberOfSteps;
    };

    /**
     * Return a boolean to know if this is a weighted gradient or not.
     *
     * @returns {Boolean}
     */
    ColorMeAwesome.prototype.isWeighted = function() {
        return this.weighted;
    };

    /*
     * First we're going to see if AMD is available, if not, then let's try CommonJS. Finally if never are present then
     * let's just add it to the global namespace whether that's root or window.
     */
    if (typeof define === 'function' && define.amd) {
        define('colormeawesome', function() {
            return ColorMeAwesome;
        });
    } else if (typeof exports !== 'undefined') {
        exports.ColorMeAwesome = ColorMeAwesome;
    } else {
        root.ColorMeAwesome = ColorMeAwesome;
    }
})(this);