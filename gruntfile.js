module.exports = function(grunt) {

  grunt.registerTask('watch', [ 'watch' ]);

  grunt.initConfig({

    // Make JS tiny
    uglify: {
      options: {
        mangle: false
      },
      js: {
        files: {
          'assets/js/scripts-header.min.js': ['assets/js/scripts-header.js'],
          'assets/js/scripts-footer.min.js': ['assets/js/scripts-footer.js']
        }
      }
    },

    // Minify img
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'assets/img',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'assets/img'
        }]
      }
    },

    
    // Compile SCSS
		sass: {
			dist: {     
        options: { 
          style: 'compressed',
          loadPath: require('node-bourbon').includePaths
        },   
				files: {
					'assets/css/style.css' : 'assets/scss/style.scss'
				}
			}
		},
    
    // Combine MQ's, but lose critical css
    combine_mq: {
      target: {
        files: {
          'assets/css/style.css': ['assets/css/style.css']
        },
        options: {
          beautify: false
        }
      }
    },

    // Autoprefix
    postcss: {
        options: {
            map: false,
            processors: [
                require('autoprefixer-core')({
                    browsers: ['> 20%', 'last 10 versions', 'Firefox > 20']
                })
            ],
            remove: false
        },
        dist: {
            src: 'assets/css/*.css'
        }
    },

    // Watch for any changes
    watch: {
      js: {
        files: ['assets/js/*.js'],
        tasks: ['uglify:js']
      },
      css: {
        // Watch sass changes, then process new img and merge mqs
        files: ['assets/scss/*.scss', 'assets/scss/**/*.scss'],
        tasks: [
          'sass', 
          'postcss:dist', 
          'combine_mq:target'
        ]
      },
      options: {
      }
    }
  });
 
  // Register everything used
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Run everything with 'grunt', these need to be in
  // a specific order so they don't fail.
  grunt.registerTask('default', [
    'uglify', 
    'sass', // Run sass
    'postcss:dist', // Post Process with Auto-Prefix
    'combine_mq', // Combine MQ's
    'newer:imagemin:dynamic', // Compress all img
    'watch' // Keep watching for any changes
  ]);
};
