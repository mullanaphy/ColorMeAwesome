/*
 * ColorMeAwesome 1.0.0
 *
 * Copyright (c) 2013 John Mullanaphy. <http://jo.mu/>
 * Color Me Awesome may be freely distributed under the Open Software License (OSL 3.0).
 */

this.ColorMeAwesomeTests = {
    'Test constructor': function(test) {
        var useColors = ['#ff0000', '#0000ff'];
        var useSteps = [20, 40];
        var colors = new ColorMeAwesome(useColors, useSteps);
        test.ok(colors.getColors() === useColors, 'Got back our initiated colors');
        test.ok(colors.getSteps() === useSteps, 'Got back our initiated steps');
    },
    'Test defaults': function(test) {
        var colors = new ColorMeAwesome();
        test.ok(colors.getColors() == ['#ffffff', '#000000'], 'Got back the default colors');
        test.ok(colors.getSteps() === 10, 'Got back the default steps');
        test.ok(!colors.isWeighted(), 'Got back our weighted flag');
    },
    'Test set/getColor': function(test) {
        var colors = new ColorMeAwesome();
        var useColors = ['#ff0000', '#0000ff'];
        test.ok(colors.setColors(useColors) === colors, 'Set and got back our object for chaining');
        test.ok(colors.getColors() === useColors, 'Got back our original colors');
    },
    'Test set/getSteps with number': function(test) {
        var colors = new ColorMeAwesome();
        test.ok(colors.setSteps(20) === colors, 'Set and got back our object for chaining');
        test.ok(colors.getSteps() === 20, 'Got back our original steps');
    },
    'Test set/getSteps with array': function(test) {
        var colors = new ColorMeAwesome(['#ffffff', '#cccccc', '#000000']);
        var useSteps = [20, 40];
        test.ok(colors.setSteps(useSteps) === colors, 'Set and got back our object for chaining');
        test.ok(colors.getSteps() === useSteps, 'Got back our original steps');
    },
    'Test isWeighted': function(test) {
        var colors = new ColorMeAwesome(['#ffffff', '#cccccc', '#000000'], 40);
        test.ok(!colors.isWeighted(), 'We are not weighted');
        colors.setSteps([10, 30]);
        test.ok(colors.isWeighted(), 'We are weighted');
    },
    'Test getNumberOfSteps': function(test) {
        var colors = new ColorMeAwesome(['#ffffff', '#000000'], 20);
        test.ok(colors.getNumberOfSteps() === 20, 'Got correct number of steps');
    },
    'Test getNumberOfSteps weighted': function(test) {
        var colors = new ColorMeAwesome(['#ffffff', '#000000'], [20, 40, 60]);
        test.ok(colors.getNumberOfSteps() === 120, 'Got correct number of steps weighted');
    },
    'Test getColorByStep': function(test) {
        var colors = new ColorMeAwesome(['#ffffff', '#000000'], 40);
        test.ok(colors.getColorByStep(0) === '#ffffff', 'Got min color by step');
        test.ok(colors.getColorByStep(40) === '#000000', 'Got max color by step');
        test.ok(colors.getColorByStep(-1) === '#ffffff', 'Got min color by out of bounds step');
        test.ok(colors.getColorByStep(41) === '#000000', 'Got max color by out of bounds step');
        test.ok(colors.getColorByStep(1) === '#f8f8f8', 'Got second color by step');
    },
    'Test getColorByStep weighted': function(test) {
        var colors = new ColorMeAwesome(['#ffffff', '#000000'], [20, 40, 60]);
        test.ok(colors.getColorByPercent(25) === '#c4c4c4', 'Got second color by percent');
    },
    'Test getColorByPercent': function(test) {
        var colors = new ColorMeAwesome(['#ffffff', '#000000'], 40);
        test.ok(colors.getColorByPercent(0) === '#ffffff', 'Got min color by percent');
        test.ok(colors.getColorByPercent(100) === '#000000', 'Got max color by percent');
        test.ok(colors.getColorByPercent(-1) === '#ffffff', 'Got min color by out of bounds percent');
        test.ok(colors.getColorByPercent(101) === '#000000', 'Got max color by out of bounds percent');
        test.ok(colors.getColorByPercent(25) === '#c4c4c4', 'Got 25% color');
    },
    'Test getColorByPercent weighted': function(test) {
        var colors = new ColorMeAwesome(['#0000ff', '#ffff00', '#ff0000', '#00ff00'], [20, 40, 60]);
        test.ok(colors.getColorByPercent(25) === '#ffc500', 'Got 25% color weighted');
    }
};