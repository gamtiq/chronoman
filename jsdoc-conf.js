var packageData = require("./package.json");

module.exports = {
    "source": {
        "include": ["chronoman.js"]
    },

    "opts": {
        "destination": "docs",
        "readme": "README.md",
        "template": "node_modules/docdash",
        "fileSet": ".nojekyll"
    },

    "plugins": [
        "plugins/markdown",
        "jsdoc-file"
    ],

    "markdown": {
        "parser": "marked"
    },
    
    "docdash": {
        "meta": {
            "title": packageData.name,
            "description": packageData.description
        },
        "menu": {
            "GitHub repo": {
                "href": packageData.homepage,
                "target": "_blank",
                "id": "github_link"
            }
        }
    }
};
