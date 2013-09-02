module.exports = function(grunt) {
    
    // Configuration
    grunt.initConfig({
        
        jshint: {
            files: ["*.js"],
            
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
        
        uglify: {
            minify: {
                src: "dist/chronoman.js",
                dest: "dist/chronoman.min.js"
            }
        },
        
        umd: {
            dist: {
                template: "unit",
                src: "chronoman.js",
                dest: "dist/chronoman.js",
                objectToExport: "Timer",
                globalAlias: "Chronoman"
            }
        }
        
    });
    
    // Plugins
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-umd");
    
    // Tasks
    grunt.registerTask("build", ["umd", "uglify"]);
    grunt.registerTask("doc", ["jsdoc"]);
    grunt.registerTask("default", ["jshint"]);
    grunt.registerTask("all", ["jshint", "build", "doc"]);
};
