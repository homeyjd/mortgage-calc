module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		meta: {
			srcPath: '../src',
			buildPath: '../public'
		},

		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> */\n',

		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: [ '<%= meta.buildPath %>/js/*.js' ]
				}
			}
		},

		compass: {
			// http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
			options: {
				basePath: '<%= meta.srcPath %>',
				sassDir: 'sass',
				imagesDir: 'img',
				fontsDir: 'fonts',
				cssDir: '<%= meta.buildPath %>/css', // relative to basePath
				relativeAssets: true,
				generatedImagesDir: '<%= meta.buildPath %>/img',
				force: true
			},
			dev: {
				options: {
				}
			},
			prod: {
				options: {
					environment: 'production',
					outputStyle: 'compressed'
				}
			}
		},

		concat: {
			options: {
				// put between each file in the concatenated output
				separator: ';'
			},

			almond: {
				src: [
					'<%= meta.srcPath %>/js/vendor/d3.v3.js'
				],
				dest: '<%= meta.buildPath %>/js/main.js'
			}
		},

		jshint: {
			options: {
				globals: {
					//jquery: true,
					browser: true,
					white: false,
					smarttabs: true
				},
			},
			all: {
				src: [
					'<%= meta.srcPath %>/js/main.js'
					//, '!<%= meta.srcPath %>/js/vendor/**/*.js'
				]
			}
		},

		uglify: {
			options: {
				preserveComments: false,
				report: 'min',
				banner: '<%= banner %>'
			},
			grunt: {
				/*files: [
					{
						expand: true,     // Enable dynamic expansion.
						cwd: '<%= meta.srcPath %>/js/',      // Src matches are relative to this path.
						src: ['main.js'], // Actual pattern(s) to match.
						dest: '<%= meta.buildPath %>/js/',   // Destination path prefix.
						filter: function(name) {
							return !( /\.min\.js/.test(name) );
						},
						ext: '.min.js'   // Dest filepaths will have this extension.
					}
				]*/
				src: ['<%= meta.srcPath %>/js/vendor/d3.v3.js', '<%= meta.srcPath %>/js/main.js'],
				dest: '<%= meta.buildPath %>/js/main.js'
			},
			rjs: {
				options: {
					sourceMap: '<%= meta.buildPath %>/js/requirejs-almond.min.js.map',
					sourceMapRoot: '<%= meta.buildPath %>/js',
					sourceMappingURL: 'requirejs-almond.min.js.map',
					sourceMapPrefix: 1,
					banner: '<%= banner %>//@ sourceMappingURL=requirejs-almond.min.js.map\n'
				},
				src: '<%= meta.buildPath %>/js/requirejs-almond.js',
				dest: '<%= meta.buildPath %>/js/requirejs-almond.min.js'
			}
		},

		requirejs: {
			options: {
				// passed to requirejs
				mainConfigFile: '<%= meta.srcPath %>/js/config.js',
				baseUrl: "<%= meta.srcPath %>/js",

				optimize: 'none', // hybrid, uglify2

				//generateSourceMaps: true,
				perserveLicenseComments: false, // set to false when generating source maps

				// inline i18n resources into the built file
				locale: "en-us",

				//wrap: true, // fixes "require function not found" error

				pragmasOnSave: {
					// ZeeAgency's requirejs-tpl
					// This removes the TPL plugin from the build
					// Uncomment if application still needs dynamic tpl loading
					excludeTpl: true,
					doExclude: true
				},
			},

			all: {
				options: {
					name: "app",
					include: ['app', 'router'],
					out: '<%= meta.buildPath %>/js/grunt-all.js',

					// custom to the grunt-requirejs node mobule
					almond: true,

					// specific to grunt-requirejs
					builder: {
						lodash: {
							modifier: 'backbone',
							alias: 'underscore'
						},
						backbone: {
							//include: ['Router']
						}
					}
				}
			},

			app: {
				options: {
					name: 'app',
					out: '<%= meta.buildPath %>/js/grunt-app.js',
					almond: true
				}
			},

			router: {
				options: {
					name: 'router',
					exclude: ['app'],
					out: '<%= meta.buildPath %>/js/grunt-router.js'
				}
			}
		},

		mocha: {
			index: ['test/browser/index.html'],
			mocha: {
				ignoreLeaks: false,
				grep: 'food',
				reporter: 'spec'
			},
		},

		watch: {
			sass: {
				files: [
					'<%= meta.srcPath %>/sass/**/*.{scss,sass}'
				],
				tasks: 'compass:dev'
			},

			js: {
				files: [
					'<%= meta.srcPath %>/js/**/*.js'
				],
				tasks: ['uglify:grunt']
			},

			jshint: {
				files: [
					'<%= meta.srcPath %>/js/**/*.js'
				],
				tasks: 'jshint'
			}
		}

	});

	//grunt.loadNpmTasks('grunt-mocha');
	//grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compass');
	//grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('dev-watch', 'watch:sass watch:js watch:jshint');
	grunt.registerTask('dev', 'compass:dev jshint');

	// Default task
	grunt.registerTask('default', ['compass:dev', 'uglify:grunt']);//, 'jshint']);
};