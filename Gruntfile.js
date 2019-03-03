module.exports = function(grunt) {
    
    var matchdep = require("matchdep");
    
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
                src: ["chronoman.js", "README.md"],
                options: {
                    destination: "doc",
                    template: "node_modules/ink-docstrap/template",
                    configure: "jsdoc-conf.json"
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
                globalAlias: "Chronoman"
            }
        },
        
        mochacli: {
            all: {}
        },
        
        bump: {
            options: {
                files: ["package.json", "bower.json", "component.json"],
                commitMessage: "Release version %VERSION%",
                commitFiles: ["-a"],
                tagName: "%VERSION%",
                tagMessage: "Version %VERSION%",
                pushTo: "origin"
            }
        }
        
    });
    
    // Plugins
    matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    
    // Tasks
    grunt.registerTask("build", ["babel", "umd", "uglify"]);
    grunt.registerTask("doc", ["jsdoc"]);
    grunt.registerTask("test", ["mochacli"]);
    grunt.registerTask("default", ["jshint", "test"]);
    grunt.registerTask("all", ["default", "build", "doc"]);
    
    grunt.registerTask("release", ["bump"]);
    grunt.registerTask("release-minor", ["bump:minor"]);
    grunt.registerTask("release-major", ["bump:major"]);
    
    // For Travis CI service
    grunt.registerTask("travis", ["all"]);
};
