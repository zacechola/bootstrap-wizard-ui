module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                funcscope: true,
                globals: {
                    jQuery: true,
                }
            },
            all: ['Gruntfile.js', 'src/*.js'],
        },
        
        uglify: {
            build: {
                src: 'src/wizard.js',
                dest: 'dist/wizard.min.js',
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'uglify']);

};
