/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

angular.module('core')
    .constant('APP_COLORS', {
        'primary': '#5d9cec',
        'success': '#27c24c',
        'info': '#23b7e5',
        'warning': '#ff902b',
        'danger': '#f05050',
        'inverse': '#131e26',
        'green': '#37bc9b',
        'pink': '#f532e5',
        'purple': '#7266ba',
        'dark': '#3a3f51',
        'yellow': '#fad732',
        'gray-darker': '#232735',
        'gray-dark': '#3a3f51',
        'gray': '#dde6e9',
        'gray-light': '#e4eaec',
        'gray-lighter': '#edf1f2'
    })
    .constant('APP_MEDIAQUERY', {
        'desktopLG': 1200,
        'desktop': 992,
        'tablet': 768,
        'mobile': 480
    })
    .constant('APP_REQUIRES', {
        // jQuery based and standalone scripts
        scripts: {
            'modernizr': ['/lib/modernizr/modernizr.js'],
            'icons': ['/lib/skycons/skycons.js',
                '/lib/fontawesome/css/font-awesome.min.css',
                '/lib/simple-line-icons/css/simple-line-icons.css',
                '/lib/weather-icons/css/weather-icons.min.css'
            ], //glyphicon
            'whirl': ['/lib/whirl/dist/whirl.css'],
            'classyloader': ['/lib/jquery-classyloader/js/jquery.classyloader.min.js'],
            'animo': ['/lib/animo.js/animo.js'],
            'fastclick': ['/lib/fastclick/lib/fastclick.js'],
            'animate': ['/lib/animate.css/animate.min.css'],
            'sparklines': ['/lib/sparklines/jquery.sparkline.min.js'],
            'slider': ['/lib/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                '/lib/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css'
            ],
            'wysiwyg': ['/lib/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                '/lib/bootstrap-wysiwyg/external/jquery.hotkeys.js'
            ],
            'slimscroll': ['/lib/slimScroll/jquery.slimscroll.min.js'],
            'screenfull': ['/lib/screenfull/dist/screenfull.min.js'],
            'vector-map': ['/lib/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                '/lib/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                '/lib/ika.jvectormap/jquery-jvectormap-us-mill-en.js',
                '/lib/ika.jvectormap/jquery-jvectormap-1.2.2.css'
            ],
            'loadGoogleMapsJS': ['/lib/gmap/load-google-maps.js'],
            'google-map': ['/lib/jQuery-gMap/jquery.gmap.min.js'],
            'flot-chart': ['/lib/Flot/jquery.flot.js'],
            'flot-chart-plugins': ['/lib/flot.tooltip/js/jquery.flot.tooltip.min.js',
                '/lib/Flot/jquery.flot.resize.js',
                '/lib/Flot/jquery.flot.pie.js',
                '/lib/Flot/jquery.flot.time.js',
                '/lib/Flot/jquery.flot.categories.js',
                '/lib/flot-spline/js/jquery.flot.spline.min.js'
            ],
            // jquery core and widgets
            'jquery-ui': ['/lib/jquery-ui/ui/core.js',
                '/lib/jquery-ui/ui/widget.js'
            ],
            // loads only jquery required modules and touch support
            'jquery-ui-widgets': ['/lib/jquery-ui/ui/core.js',
                '/lib/jquery-ui/ui/widget.js',
                '/lib/jquery-ui/ui/mouse.js',
                '/lib/jquery-ui/ui/draggable.js',
                '/lib/jquery-ui/ui/droppable.js',
                '/lib/jquery-ui/ui/sortable.js',
                '/lib/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'
            ],
            'moment': ['/lib/moment/min/moment-with-locales.min.js'],
            'inputmask': ['/lib/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
            'flatdoc': ['/lib/flatdoc/flatdoc.js'],
            'codemirror': ['/lib/codemirror/lib/codemirror.js',
                '/lib/codemirror/lib/codemirror.css'
            ],
            'codemirror-plugins': ['/lib/codemirror/addon/mode/overlay.js',
                '/lib/codemirror/mode/markdown/markdown.js',
                '/lib/codemirror/mode/xml/xml.js',
                '/lib/codemirror/mode/gfm/gfm.js',
                '/lib/marked/lib/marked.js'
            ],
            // modes for common web files
            'codemirror-modes-web': ['/lib/codemirror/mode/javascript/javascript.js',
                '/lib/codemirror/mode/xml/xml.js',
                '/lib/codemirror/mode/htmlmixed/htmlmixed.js',
                '/lib/codemirror/mode/css/css.js'
            ],
            'taginput': ['/lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                '/lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'
            ],
            'filestyle': ['/lib/bootstrap-filestyle/src/bootstrap-filestyle.js'],
            'parsley': ['/lib/parsleyjs/dist/parsley.min.js'],
            'datatables': ['/lib/datatables/media/js/jquery.dataTables.js',
                '/lib/datatable-bootstrap/css/dataTables.bootstrap.css'
            ],
            'datatables-pugins': ['/lib/datatable-bootstrap/js/dataTables.bootstrap.js',
                '/lib/datatable-bootstrap/js/dataTables.bootstrapPagination.js',
                '/lib/datatables-colvis/js/dataTables.colVis.js',
                '/lib/datatables-colvis/css/dataTables.colVis.css',
                '/lib/datatables-responsive/js/dataTables.responsive.js',
                '/lib/datatables-responsive/css/dataTables.responsive.css',
                '/lib/datatables-tabletools/js/dataTables.tableTools.js',
                '/lib/datatables-tabletools/css/dataTables.tableTools.css',
                '/lib/datatables/media/js/jquery.dataTables.refresh.js',
                '/lib/yadcf/jquery.dataTables.yadcf.js',
                '/lib/yadcf/jquery.dataTables.yadcf.css'
            ],
            'fullcalendar': ['/lib/fullcalendar/dist/fullcalendar.min.js',
                '/lib/fullcalendar/dist/fullcalendar.css'
            ],
            'gcal': ['/lib/fullcalendar/dist/gcal.js'],
            'nestable': ['/lib/nestable/jquery.nestable.js']
        },
        // Angular based script (use the right module name)
        modules: [
            { name: 'dynamicLayout', files: ['/lib/angular-dynamic-layout/dist/angular-dynamic-layout.min.js'] },
            {
                name: 'toaster',
                files: ['/lib/angularjs-toaster/toaster.js',
                    '/lib/angularjs-toaster/toaster.css'
                ]
            },
            {
                name: 'localytics.directives',
                files: ['/lib/chosen_v1.2.0/chosen.jquery.min.js',
                    '/lib/chosen_v1.2.0/chosen.min.css',
                    '/lib/angular-chosen-localytics/chosen.js'
                ]
            },
            {
                name: 'ngDialog',
                files: ['/lib/ngDialog/js/ngDialog.min.js',
                    '/lib/ngDialog/css/ngDialog.min.css',
                    '/lib/ngDialog/css/ngDialog-theme-default.min.css'
                ]
            },
            { name: 'ngWig', files: ['/lib/ng-wig/dist/ng-wig.js'] },
            {
                name: 'ngTable',
                files: ['/lib/ng-table/ng-table.min.js',
                    '/lib/ng-table/ng-table.min.css'
                ]
            },
            { name: 'ngTableExport', files: ['/lib/ng-table-export/ng-table-export.js'] },
            {
                name: 'angularBootstrapNavTree',
                files: ['/lib/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                    '/lib/angular-bootstrap-nav-tree/dist/abn_tree.css'
                ]
            },
            {
                name: 'htmlSortable',
                files: ['/lib/html.sortable/dist/html.sortable.js',
                    '/lib/html.sortable/dist/html.sortable.angular.js'
                ]
            },
            {
                name: 'xeditable',
                files: ['/lib/angular-xeditable/dist/js/xeditable.js',
                    '/lib/angular-xeditable/dist/css/xeditable.css'
                ]
            },
            { name: 'angularFileUpload', files: ['/lib/angular-file-upload/angular-file-upload.js'] },
            {
                name: 'ngImgCrop',
                files: ['/lib/ng-img-crop/compile/unminified/ng-img-crop.js',
                    '/lib/ng-img-crop/compile/unminified/ng-img-crop.css'
                ]
            },
            {
                name: 'ui.select',
                files: ['/lib/angular-ui-select/dist/select.js',
                    '/lib/angular-ui-select/dist/select.css'
                ]
            },
            { name: 'ui.codemirror', files: ['/lib/angular-ui-codemirror/ui-codemirror.js'] },
            {
                name: 'angular-carousel',
                files: ['/lib/angular-carousel/dist/angular-carousel.css',
                    '/lib/angular-carousel/dist/angular-carousel.js'
                ]
            },
            { name: 'validation.match', files: ['/lib/angular-validation-match/dist/angular-input-match.js'] },
            {
                name: 'ui.bootstrap.datetimepicker',
                files: ['/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
                    '/lib/angular-bootstrap-datetimepicker/src/css/datetimepicker.css'
                ]
            }

        ]

    });