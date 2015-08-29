module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['path/to/dir/one', 'path/to/dir/two'],
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css',
                    ext: '.min.css'
                }]
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            uses_defaults: ['js/*.js']
        },
        less: {
            development: {
                options: {
                    compress: true,
                    paths: ['assets/css']
                },
                files: {
                    'css/app.min.css': 'css/app.less'
                }
            },
            production: {
                options: {
                    cleancss: true,
                    paths: ['assets/css']
                },
                files: {
                    'css/app.min.css': 'css/app.less'
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
                files: {
                    'js/app.min.js': ['js/app.js']
                }
            }
        },
        watch: {
            css: {
                files: ['css/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            scripts: {
                files: ['js/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['clean', 'less', 'jshint', 'uglify', 'watch']);

};