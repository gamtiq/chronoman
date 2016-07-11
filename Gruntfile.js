module.exports = function(grunt) {
    
    // Configuration
    grunt.initConfig({
        
        jshint: {
            gruntfile: {
                src: "Gruntfile.js"
            },
            src: {
                src: ["*.js"]
            },
            test: {
                src: ["test/*.js"]
            },
            
            options: {
                // Enforcing
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: true,
                undef: true,
                unused: true,
                
                // Relaxing
                boss: true,
                
                // Environment
                esversion: 6,
                node: true
            }
        },
        
        jsdoc: {
            dist: {
                src: ["chronoman.js"],
                options: {
                    destination: "doc"
                }
            }
        },
        
        babel: {
            dist: {
                src: "chronoman.js",
                dest: "dist/chronoman.common.js"
            }
        },
        
        uglify: {
            minify: {
                src: "dist/chronoman.js",
                dest: "dist/chronoman.min.js"
            }
        },
        
        umd: {
            dist: {
                template: "unit",
                src: "dist/chronoman.common.js",
                dest: "dist/chronoman.js",
                objectToExport: "Timer",
                globalAlias: "Chronoman",
                indent: "    "
            }
        },
        
        mochacli: {
            all: {}
        }
        
    });
    
    // Plugins
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-mocha-cli");
    grunt.loadNpmTasks("grunt-umd");
    
    // Tasks
    grunt.registerTask("build", ["babel", "umd", "uglify"]);
    grunt.registerTask("doc", ["jsdoc"]);
    grunt.registerTask("test", ["mochacli"]);
    grunt.registerTask("default", ["jshint", "test"]);
    grunt.registerTask("all", ["default", "build", "doc"]);
};
