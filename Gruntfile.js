'use_strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        push: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json']
      }
    },
    concat: {
      dev: {
        files: {
          'dist/ez-datetime.js': ['src/js/pre.js', 'src/js/*/*.js']
        }
      }
    },
    cssmin: {
      dev: {
        files: {
          'dist/ez-datetime.min.css': ['dist/ez-datetime.css']
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: {
        files: {
          src: ['src/js/**/*.js']
        },
      }
    },
		less: {
			dev: {
				files: {
					'dist/ez-datetime.css': 'src/less/*.less'
				}
			}
		},
		ngtemplates: {
		  dev: {
        src:      'src/templates/*.html',
        dest:     'dist/ez-datetime-tpl.js',
        options: {
          module: 'ez.datetime',
          url: function(url) { return url.replace('src/templates/', ''); },
          htmlmin: {
          collapseBooleanAttributes:      true,
          collapseWhitespace:             true,
          removeComments:                 true,
          removeEmptyAttributes:          true,
          removeRedundantAttributes:      true,
          removeScriptTypeAttributes:     true,
          removeStyleLinkTypeAttributes:  true
          }
        }
		  }
		},
    uglify: {
      options: {
        mangle: true,
        compile: true,
        compress: true
      },
      dist: {
        files: {
          'dist/ez-datetime.min.js': ['dist/ez-datetime.js']
        }
      }
    },
		watch: {
			dev: {
				files: ['Gruntfile.js', 'src/**/*'],
				tasks: ['default']
			}
		}
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('default', ['jshint', 'ngtemplates', 'concat', 'uglify', 'less', 'cssmin']);
};
