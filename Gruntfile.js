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
        }
        
    });
    
    // Plugins
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsdoc");
    
    // Tasks
    grunt.registerTask("doc", ["jsdoc"]);
    grunt.registerTask("default", ["jshint"]);
};
