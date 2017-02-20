var id = 0;
var editor = new Array();// Array to store all the Codemirror instances
var remote = require('remote');
const {shell} = require('electron');
var Menu = remote.require('menu'); // Load the menu component
var dialog = remote.require('dialog'); // Load the dialogs component of the OS
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
var path = require('path');
var app = require('electron').remote;
const { clipboard } = require('electron');
var dialog = app.dialog;
var fileWatcher = require("chokidar");// Watch files events
var loremIpsum = require("lorem-ipsum");// Lorem ipsum module
var chokidar = require("chokidar");
var beautify_js = require('js-beautify').js;
var beautify_css = require('js-beautify').css;
var beautify_html = require('js-beautify').html;
var minify = require('html-minifier').minify;
var CleanCSS = require('clean-css');
var UglifyJS = require("uglify-js");
var module = angular.module('neutron', []);

function arraymove(arr, fromIndex, toIndex) {
    if (toIndex >= arr.length) return;
    if (toIndex < 0) return;
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

module.directive('sortable', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var startIndex = -1;
            var coll;
            scope.$watch(attrs.sortable, function(value) {
                coll = value;
            });
            $(element).sortable({
                containment: '.chrome-tabs-shell',
                scroll: false,
                helper: 'clone',
                cancel: "#addTabButton",
                axis: 'x',
                tolerance: 'pointer',
                revert: 'false',
                start: function(event, ui) {
                    $('#addTabButton').hide();
                    startIndex = ($(ui.item).index());
                },
                stop: function(event, ui) {
                    var newIndex = ($(ui.item).index());
                    $('#addTabButton').show();
                    $timeout(function() {
                        arraymove(coll, startIndex, newIndex);
                    }, 0);

                }
            });
        }
    }
});

module.directive('onFinishRender', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});

module.controller('NeutronController', ['$scope','$http', function( $scope, $http ) {
    $scope.neutronTabs = [];
  	$scope.stackQuestions = [];
    $scope.progLang = [{ name: "HTML", cod: "fa fa-html5", pos: "10", mode: "text/html" },
                       { name: "CSS", cod: "fa fa-css3", pos: "12", mode: "text/css" },
                       { name: "Javascript", cod: "fa fa-code", pos: "12", mode: "text/javascript" },
                       { name: "Java", cod: "fa fa-coffee", pos: "12", mode: "text/x-java" },
                       { name: "SQL", cod: "fa fa-database", pos: "10", mode: "text/x-mysql" },
                       { name: "PHP", cod: "fa fa-ravelry", pos: "10", mode: "text/php" }];

    $scope.faCodes = [{ code: "<i class='fa fa-code' aria-hidden='true'></i>", class: "fa-code" },
                      { code: "<i class='fa fa-cog' aria-hidden='true'></i>", class: "fa-cog" },
                      { code: "<i class='fa fa-address-book' aria-hidden='true'></i>", class: "fa-address-book" },
                      { code: "<i class='fa fa-address-book-o' aria-hidden='true'></i>", class: "fa-address-book-o" },
                      { code: "<i class='fa fa-address-card' aria-hidden='true'></i>", class: "fa-address-card" },
                      { code: "<i class='fa fa-address-card-o' aria-hidden='true'></i>", class: "fa-address-card-o" },
                      { code: "<i class='fa fa-bandcamp' aria-hidden='true'></i>", class: "fa-bandcamp" },
                      { code: "<i class='fa fa-bath' aria-hidden='true'></i>", class: "fa-bath" },
                      { code: "<i class='fa fa-id-card' aria-hidden='true'></i>", class: "fa-id-card" },
                      { code: "<i class='fa fa-id-card-o' aria-hidden='true'></i>", class: "fa-id-card-o" },
                      { code: "<i class='fa fa-eercast' aria-hidden='true'></i>", class: "fa-eercast" },
                      { code: "<i class='fa fa-envelope-open' aria-hidden='true'></i>", class: "fa-envelope-open" },
                      { code: "<i class='fa fa-envelope-open-o' aria-hidden='true'></i>", class: "fa-envelope-open-o" },
                      { code: "<i class='fa fa-etsy' aria-hidden='true'></i>", class: "fa-etsy" },
                      { code: "<i class='fa fa-free-code-camp' aria-hidden='true'></i>", class: "fa-free-code-camp" },
                      { code: "<i class='fa fa-grav' aria-hidden='true'></i>", class: "fa-grav" },
                      { code: "<i class='fa fa-handshake-o' aria-hidden='true'></i>", class: "fa-handshake-o" },
                      { code: "<i class='fa fa-id-badge' aria-hidden='true'></i>", class: "fa-id-badge" },
                      { code: "<i class='fa fa-imdb' aria-hidden='true'></i>", class: "fa-imdb" },
                      { code: "<i class='fa fa-linode' aria-hidden='true'></i>", class: "fa-linode" },
                      { code: "<i class='fa fa-meetup' aria-hidden='true'></i>", class: "fa-meetup" },
                      { code: "<i class='fa fa-microchip' aria-hidden='true'></i>", class: "fa-microchip" },
                      { code: "<i class='fa fa-podcast' aria-hidden='true'></i>", class: "fa-podcast" },
                      { code: "<i class='fa fa-quora' aria-hidden='true'></i>", class: "fa-quora" },
                      { code: "<i class='fa fa-ravelry' aria-hidden='true'></i>", class: "fa-ravelry" },
                      { code: "<i class='fa fa-shower' aria-hidden='true'></i>", class: "fa-shower" },
                      { code: "<i class='fa fa-snowflake-o' aria-hidden='true'></i>", class: "fa-snowflake-o" },
                      { code: "<i class='fa fa-superpowers' aria-hidden='true'></i>", class: "fa-superpowers" },
                      { code: "<i class='fa fa-telegram' aria-hidden='true'></i>", class: "fa-telegram" },
                      { code: "<i class='fa fa-thermometer-full' aria-hidden='true'></i>", class: "fa-thermometer-full" },
                      { code: "<i class='fa fa-thermometer-empty' aria-hidden='true'></i>", class: "fa-thermometer-empty" },
                      { code: "<i class='fa fa-thermometer-quarter' aria-hidden='true'></i>", class: "fa-thermometer-quarter" },
                      { code: "<i class='fa fa-thermometer-half' aria-hidden='true'></i>", class: "fa-thermometer-half" },
                      { code: "<i class='fa fa-thermometer-three-quarters' aria-hidden='true'></i>", class: "fa-thermometer-three-quarters" },
                      { code: "<i class='fa fa-window-close' aria-hidden='true'></i>", class: "fa-window-close" },
                      { code: "<i class='fa fa-window-close-o' aria-hidden='true'></i>", class: "fa-window-close-o" },
                      { code: "<i class='fa fa-user-circle' aria-hidden='true'></i>", class: "fa-user-circle" },
                      { code: "<i class='fa fa-user-circle-o' aria-hidden='true'></i>", class: "fa-user-circle-o" },
                      { code: "<i class='fa fa-user-o' aria-hidden='true'></i>", class: "fa-user-o" },
                      { code: "<i class='fa fa-address-card' aria-hidden='true'></i>", class: "fa-address-card" },
                      { code: "<i class='fa fa-address-card-o' aria-hidden='true'></i>", class: "fa-address-card-o" },
                      { code: "<i class='fa fa-window-maximize' aria-hidden='true'></i>", class: "fa-window-maximize" },
                      { code: "<i class='fa fa-wpexplorer' aria-hidden='true'></i>", class: "fa-wpexplorer" },
                      { code: "<i class='fa fa-window-restore' aria-hidden='true'></i>", class: "fa-window-restore" },
                      { code: "<i class='fa fa-window-minimize' aria-hidden='true'></i>", class: "fa-window-minimize" },
                      { code: "<i class='fa fa-ambulance' aria-hidden='true'></i>", class: "fa-ambulance" },
                      { code: "<i class='fa fa-h-square' aria-hidden='true'></i>", class: "fa-h-square" },
                      { code: "<i class='fa fa-heart' aria-hidden='true'></i>", class: "fa-heart" },
                      { code: "<i class='fa fa-heart-o' aria-hidden='true'></i>", class: "fa-heart-o" },
                      { code: "<i class='fa fa-hospital-o' aria-hidden='true'></i>", class: "fa-hospital-o" },
                      { code: "<i class='fa fa-medkit' aria-hidden='true'></i>", class: "fa-medkit" },
                      { code: "<i class='fa fa-plus-square' aria-hidden='true'></i>", class: "fa-plus-square" },
                      { code: "<i class='fa fa-stethoscope' aria-hidden='true'></i>", class: "fa-stethoscope" },
                      { code: "<i class='fa fa-user-md' aria-hidden='true'></i>", class: "fa-user-md" },
                      { code: "<i class='fa fa-wheelchair-alt' aria-hidden='true'></i>", class: "fa-wheelchair-alt" },
                      { code: "<i class='fa fa-arrows-alt' aria-hidden='true'></i>", class: "fa-arrows-alt" },
                      { code: "<i class='fa fa-backward' aria-hidden='true'></i>", class: "fa-backward" },
                      { code: "<i class='fa fa-compress' aria-hidden='true'></i>", class: "fa-compress" },
                      { code: "<i class='fa fa-eject' aria-hidden='true'></i>", class: "fa-eject" },
                      { code: "<i class='fa fa-expand' aria-hidden='true'></i>", class: "fa-expand" },
                      { code: "<i class='fa fa-fast-backward' aria-hidden='true'></i>", class: "fa-fast-backward" },
                      { code: "<i class='fa fa-fast-forward' aria-hidden='true'></i>", class: "fa-fast-forward" },
                      { code: "<i class='fa fa-forward' aria-hidden='true'></i>", class: "fa-forward" },
                      { code: "<i class='fa fa-pause' aria-hidden='true'></i>", class: "fa-pause" },
                      { code: "<i class='fa fa-pause-circle' aria-hidden='true'></i>", class: "fa-pause-circle" },
                      { code: "<i class='fa fa-pause-circle-o' aria-hidden='true'></i>", class: "fa-pause-circle-o" },
                      { code: "<i class='fa fa-play' aria-hidden='true'></i>", class: "fa-play" },
                      { code: "<i class='fa fa-play-circle' aria-hidden='true'></i>", class: "fa-play-circle" },
                      { code: "<i class='fa fa-play-circle-o' aria-hidden='true'></i>", class: "fa-play-circle-o" },
                      { code: "<i class='fa fa-random' aria-hidden='true'></i>", class: "fa-random" },
                      { code: "<i class='fa fa-step-backward' aria-hidden='true'></i>", class: "fa-step-backward" },
                      { code: "<i class='fa fa-step-forward' aria-hidden='true'></i>", class: "fa-step-forward" },
                      { code: "<i class='fa fa-stop' aria-hidden='true'></i>", class: "fa-stop" },
                      { code: "<i class='fa fa-stop-circle' aria-hidden='true'></i>", class: "fa-stop-circle" },
                      { code: "<i class='fa fa-stop-circle-o' aria-hidden='true'></i>", class: "fa-stop-circle-o" },
                      { code: "<i class='fa fa-youtube-play' aria-hidden='true'></i>", class: "fa-youtube-play" }];

    var BoilerplateTemplate = '<!DOCTYPE html>\n<html lang="">\n<head> \n<meta charset="utf-8"> \n<meta http-equiv="x-ua-compatible" content="ie=edge"> \n<title>My App</title> \n<meta name="description" content=""> \n<meta name="viewport" content="width=device-width, initial-scale=1"> \n\n<link rel="apple-touch-icon" href="apple-touch-icon.png"> \n<!-- Place favicon.ico in the root directory --> \n<link rel="stylesheet" href="styles/main.css"> \n<script src="scripts/main.js"></script> \n</head> \n<body> \n<!--[if lt IE 8]> \n<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p> \n<![endif]--> \n<!-- Add your site or application content here --> \n<p>Hello world! This is HTML5 Boilerplate.</p>\n</body> \n</html>';
    var newProyectFolder="";
    $('title').html('untitled - Nautilus');
  
    $scope.actualPage = {
        path: "untitled",
        title: "untitled",
        content: '',
        modeOp: 0,
        mode: '',
        id: 0
    };
  
    $scope.conf = {theme: "nautilusDeepSea"};

    $scope.cursorPos = {
      x: "0",
      y: "0"
    };
    $scope.ChangedFile = 'index.html';
    $scope.ChangedFileID = '0';

    var diretoryTreeToObj = function(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err)
                return done(err);

            var pending = list.length;

            if (!pending)
                return done(null, {
                    text: path.basename(dir),
                    type: 'folder',
                    icon: 'fa fa-folder',
                    children: results
                });

            list.forEach(function(file) {
                file = path.resolve(dir, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        diretoryTreeToObj(file, function(err, res) {
                            results.push({
                                text: path.basename(file),
                                icon: 'fa fa-folder',
                                data: {
                                    file: file
                                },
                                children: res
                            });
                            if (!--pending)
                                done(null, results);
                        });
                    } else {
                        results.push({
                            icon: 'fa fa-file-text-o',
                            data: {
                                file: file
                            },
                            text: path.basename(file)
                        });
                        if (!--pending)
                            done(null, results);
                    }
                });
            });
        });
    };

  var checkChanges = function(){
    if (editor[$scope.actualPage.id].getValue() != $scope.actualPage.content) {
                $('#' + $scope.actualPage.id + '-remove').removeClass('fa-times');
                $('#' + $scope.actualPage.id + '-remove').addClass('fa-circle');
                $('#' + $scope.actualPage.id + '-remove').addClass('faa-vertical');
                $('#' + $scope.actualPage.id + '-remove').addClass('animated');
            } else {
                $('#' + $scope.actualPage.id + '-remove').addClass('fa-times');
                $('#' + $scope.actualPage.id + '-remove').removeClass('fa-circle');
                $('#' + $scope.actualPage.id + '-remove').removeClass('faa-vertical');
                $('#' + $scope.actualPage.id + '-remove').removeClass('animated');
            }
  }


    $scope.$on('test', function(ngRepeatFinishedEvent) {
        $scope.InitTheme($scope.conf.theme);
        $scope.cursorPos.x = "1";
        $scope.cursorPos.y = "1";
        $('#pageTool').tooltipster("content", $scope.actualPage.path);
        if (id >= 4) {
            var width = $('.chrome-tabs').width();
            width = width / ($scope.neutronTabs.length + 1);
            $('.chrome-tab').css('width', (100 / (id + 1)) + '%');
        }

        editor[$scope.actualPage.id] = CodeMirror.fromTextArea($('#' + $scope.actualPage.id + '-ta').get(0), {
            lineWrapping: false,
            autoRefresh: true,
            matchTags: { bothTags: true },
            styleActiveLine: true,
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            autoCloseTags: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            highlightSelectionMatches: {
                showToken: /\w/,
                annotateScrollbar: true
            },
            mode: $scope.actualPage.mode,
            theme: $scope.conf.theme
        });

        editor[$scope.actualPage.id].setValue($scope.actualPage.content);
        $('#' + $scope.actualPage.id + '-tabTitle').tooltipster({ animation: 'grow', theme: 'tooltipster-top-punk' });

        editor[$scope.actualPage.id].on('cursorActivity', function() {
            $scope.cursorPos.x = editor[$scope.actualPage.id].getCursor().line + 1;
            $scope.cursorPos.y = editor[$scope.actualPage.id].getCursor().ch;
            $('#cursorTool').tooltipster("content", "Line " + $scope.cursorPos.x + ",  Column " + $scope.cursorPos.y);
            $scope.$apply();
        });

        editor[$scope.actualPage.id].on('keyup', function() {
            checkChanges();
        });

    });
    $scope.ChangeTheme = function(themeOLD='monokai',theme='material'){
        for (i=1; i<$scope.neutronTabs.length+1; i++){
            $('#' + i + '-tab').removeClass('chrome-tab-' + themeOLD);
            $('#' + i + '-tab').addClass('chrome-tab-' + theme);
            editor[i-1].setOption("theme",theme);
        }
        $('.chrome-tabs .chrome-tab').removeClass('chrome-tab-' + themeOLD);
        $('.fa-times-' + themeOLD).removeClass('fa-times-' + themeOLD);
        $('.fa-times-curent-' + themeOLD).removeClass('fa-times-' + themeOLD);
        $('.chrome-tabs .chrome-tab.chrome-tab-current').removeClass('chrome-tab-current-' + themeOLD);
        $('.chrome-tabs .chrome-tab.chrome-tab-current .fa-times').removeClass('fa-times-current-' + themeOLD);
        $('.chrome-tabs-shell').removeClass('chrome-tabs-shell-' + themeOLD);
        $('.chrome-tabs-shell .chrome-shell-bottom-bar').removeClass('chrome-shell-bottom-bar-' + themeOLD);
        $('#addTabButton').removeClass('addTabButton-' + themeOLD);
        $('.tab-content').removeClass('tab-content-' + themeOLD);
        $('.gutter').removeClass('gutter-' + themeOLD);
        $('#fileSystem').removeClass('fileSystem-' + themeOLD);
        $('#footer').removeClass('footer-' + themeOLD);
        $('.jstree-container-ul').removeClass('jstree-container-ul-' + themeOLD);
		$('#OpenProyect').removeClass('OpenProyectDialog-' + themeOLD);
      
		$('.chrome-tabs .chrome-tab').addClass('chrome-tab-' + theme);
        $('.chrome-tab .fa-times').addClass('fa-times-' + theme);
      	$('.chrome-tabs .chrome-tab.chrome-tab-current').addClass('chrome-tab-current-' + theme);
        $('.chrome-tabs .chrome-tab.chrome-tab-current .fa-times').addClass('fa-times-current-' + theme);
      	$('.chrome-tabs-shell').addClass('chrome-tabs-shell-' + theme);
        $('.chrome-tabs-shell .chrome-shell-bottom-bar').addClass('chrome-shell-bottom-bar-' + theme);
        $('#addTabButton').addClass('addTabButton-' + theme);
      	$('.tab-content').addClass('tab-content-' + theme);
        $('.gutter').addClass('gutter-' + theme);
        $('#fileSystem').addClass('fileSystem-' + theme);
        $('#footer').addClass('footer-' + theme);
      	$('.jstree-container-ul').addClass('jstree-container-ul-' + theme);
      	$('#OpenProyect').addClass('OpenProyectDialog-' + theme);
        $scope.conf.theme = theme;
        $('#Loader').modal('toggle');

    }

    $scope.InitTheme = function(theme){
        $('.chrome-tabs .chrome-tab').addClass('chrome-tab-' + theme);
        $('.chrome-tab .fa-times').addClass('fa-times-' + theme);
        $('.chrome-tabs .chrome-tab.chrome-tab-current').addClass('chrome-tab-current-' + theme);
        $('.chrome-tabs .chrome-tab.chrome-tab-current .fa-times').addClass('fa-times-current-' + theme);
        $('.chrome-tabs-shell').addClass('chrome-tabs-shell-' + theme);
        $('.chrome-tabs-shell .chrome-shell-bottom-bar').addClass('chrome-shell-bottom-bar-' + theme);
        $('#addTabButton').addClass('addTabButton-' + theme);
        $('.tab-content').addClass('tab-content-' + theme);
        $('.gutter').addClass('gutter-' + theme);
        $('#fileSystem').addClass('fileSystem-' + theme);
        $('#footer').addClass('footer-' + theme);
        $('.jstree-container-ul').addClass('jstree-container-ul-' + theme);
      	$('#OpenProyect').addClass('OpenProyectDialog-' + theme);
        $scope.conf.theme = theme;
    }

    $scope.updatePreview = function() {
        var previewFrame = document.getElementById('preview');
        var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
        preview.open();
        preview.write(editor[$scope.actualPage.id].getValue());
        preview.close();
        $('#Designer').modal('show');
    }

    $scope.nuevaTab = function(content = '', title = "untitled") {
        if ($scope.neutronTabs.length < 20) {
            id = id + 1;
            var mode = "text/html";
            var modeOp = 0;
            if (title != 'untitled') {
                var ext = title.lastIndexOf('.');
                var newExt = title.substring(ext + 1, ext.length);
                if (newExt == "html") {
                    mode = "text/html";
                    modeOp = 0;
                } else if (newExt == "js") {
                    mode = "text/javascript";
                    modeOp = 2;
                } else if (newExt == "json") {
                    mode = "text/javascript";
                    modeOp = 2;
                } else if (newExt == "css") {
                    mode = "text/css";
                    modeOp = 1;
                } else if (newExt == "java") {
                    mode = "text/x-java";
                    modeOp = 3;
                } else if (newExt == "sql") {
                    mode = "text/x-mysql";
                    modeOp = 4;
                } else {
                    mode = "text/html";
                    modeOp = 0;
                }
            }

            $scope.actualPage.path = title;
            $scope.actualPage.title = title.substring(title.lastIndexOf('\\') + 1, title.length);
            $scope.actualPage.id = $scope.neutronTabs.length;
            $scope.actualPage.mode = mode;
            $scope.actualPage.modeOp = modeOp;
            $scope.actualPage.content = content;
            remote.getCurrentWindow().setTitle($scope.actualPage.path + '  -  Neutron');
            $scope.neutronTabs.push({
                id: $scope.neutronTabs.length,
                title: $scope.actualPage.title,
                path: $scope.actualPage.path,
                mode: mode,
                modeOp: modeOp,
                content: content
            });
            $('#pageTool').tooltipster("content", $scope.actualPage.path);
            $('.chrome-tab-current').removeClass('chrome-tab-current');
            $('.chrome-tab-current-' + $scope.conf.theme).removeClass('chrome-tab-current-' + $scope.conf.theme);
            $('.active').removeClass('active');
            $('in').removeClass('in');
        }
    }

    $scope.removeTab = function(index) {
        id = id - 1;
        console.log(id + ' ' + $scope.neutronTabs.length);
        $scope.neutronTabs.splice(index, 1);
        if ((index + 1) < $scope.neutronTabs.length) {
            $scope.setCurrent(index + 2);
        }

        if (id == 0) {
            alert('puto, cerraste la ultima');
        }
    };

    $scope.copyColor = function(obj) {
        clipboard.writeText(obj.val());
        toastr.success('Color copied to the clipboard!');
    }

    $scope.setCurrent = function(tab_id) {
            $('.chrome-tab-current').removeClass('chrome-tab-current');
            $('.chrome-tab-current-' + $scope.conf.theme).removeClass('chrome-tab-current-' + $scope.conf.theme);
            $('#' + tab_id + '-tab').addClass('chrome-tab-current');
            $('#' + tab_id + '-tab').addClass('chrome-tab-current-' + $scope.conf.theme);
            angular.forEach($scope.neutronTabs, function(tab) {
                if (tab.id == (tab_id)) {
                    $scope.actualPage.path = tab.path;
                    $scope.actualPage.title = tab.title;
                    $scope.actualPage.id = tab_id;
                    $('#pageTool').tooltipster("content", $scope.actualPage.path);
                    remote.getCurrentWindow().setTitle($scope.actualPage.path + '  -  Neutron');
                    $scope.actualPage.content = editor[tab_id].getValue();
                    editor[tab_id].focus();
                }
            });
        }
        //onload="window.$ = window.jQuery = module.exports;"
    $scope.setCurrentLang = function(tab_id, mode) {

        angular.forEach($scope.neutronTabs, function(tab) {
            if (tab.id == tab_id) {
                if (mode == "text/html") {
                    tab.modeOp = 0;
                    tab.mode = "text/html"
                } else if (mode == "text/css") {
                    tab.modeOp = 1;
                    tab.mode = "text/css"
                } else if (mode == "text/javascript") {
                    tab.modeOp = 2;
                    tab.mode = "text/javascript"
                } else if (mode == "text/x-java") {
                    tab.modeOp = 3;
                    tab.mode = "text/x-java"
                } else if (mode == "text/x-mysql") {
                    tab.modeOp = 4;
                    tab.mode = "text/x-mysql"
                }
            }
        });
        editor[tab_id].setOption("mode", mode);
    }

    $scope.generateLorem = function() {
        var type = '';
        if ($('#option1').is(':checked')) {
            type = $("#option1").val();
        }
        if ($('#option2').is(':checked')) {
            type = $("#option2").val();
        }
        if ($('#option3').is(':checked')) {
            type = $("#option3").val();
        }

        var output = loremIpsum({
            count: $('#Lorem-content .modal-body > input').val() // Number of words, sentences, or paragraphs to generate.
                ,
            units: type // Generate words, sentences, or paragraphs.
                ,
            format: 'plain' // Plain text or html
                ,
            random: Math.random // A PRNG function. Uses Math.random by default
        });
        clipboard.writeText(output);
        toastr.success('Lorem copied to the clipboard!');
        $('#Lorem').modal('toggle');
    }

    $scope.removeChanged = function() {
        $scope.removeTab($scope.ChangedFileID - 1);
        toastr.error('File removed succesfully!');
    }

    $scope.saveChanged = function() {
        SaveFile($scope.ChangedFile, editor[$scope.ChangedFileID].getValue());
    }

    $scope.SaveIcon = function(iconCode){
      clipboard.writeText(iconCode);
      toastr.success('Icon copied to the clipboard!');
    }

    $scope.SearchStack = function(stackQuery){
      $('#StackOForm-content .modal-body .item2').hide();
      $('#StackOForm-content .modal-body').css('height','401px');
      $scope.stackQuestions = [];
      var query = stackQuery.replace(/ /g,'%20');
      $http({
        method: 'GET',
        url: 'https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&q=' + query + '&filter=!)Qpah.Zxf4x9NeOk-EoCHC)y&site=stackoverflow'
      }).then(function successCallback(response) {
          console.log(response);
          for (var x in response.data.items){
              title = response.data.items[x].title.replace(/&#39;/g,'');
              title = title.replace(/&#34;/g,"'");
              title = title.replace(/&quot;/g,'"');
              var tags=[];
              for (var y in response.data.items[x].tags){
                tags.push({'name':response.data.items[x].tags[y]});
              }
              $scope.stackQuestions.push({'title':title,'tags':tags,'isAnswered':response.data.items[x].is_answered,'link':response.data.items[x].link,'owner':response.data.items[x].owner.display_name,'ownerPic':response.data.items[x].owner.profile_image,'body':response.data.items[x].body});
          }
        }, function errorCallback(response) {
            console.log('master error');
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }
    $scope.ClickStack = function(link){
      shell.openExternal(link);
    }

    function StartWatcher(path) {

        var watcher = chokidar.watch(path, {
            ignored: /[\/\\]\./,
            persistent: true
        });

        function onWatcherReady() {
            console.info('From here can you check for real changes, the initial scan has been completed.');
        }

        // Declare the listeners of the watcher
        watcher
            .on('add', function(path) {
                console.log('File', path, 'has been added');
            })
            .on('addDir', function(path) {
                console.log('Directory', path, 'has been added');
            })
            .on('change', function(path) {
                console.log('File', path, 'has been changed');
            })
            .on('unlink', function(path) {
                //console.log('File', path, 'has been removed');
                $scope.ChangedFile = path;
                angular.forEach($scope.neutronTabs, function(tab) {
                    if (tab.path == $scope.ChangedFile) {
                        $scope.ChangedFileID = tab.id;
                    }
                });
                $scope.$apply();
                $('#FileChange').modal('show');
            })
            .on('unlinkDir', function(path) {
                console.log('Directory', path, 'has been removed');
            })
            .on('error', function(error) {
                console.log('Error happened', error);
            })
            .on('ready', onWatcherReady)
            .on('raw', function(event, path, details) {
                // This event should be triggered everytime something happens.
                //console.log('Raw event info:', event, path, details);
            });
    }
    $scope.OpenNewProyect = function(){
      $('#Loader').modal('toggle');
      $('#OpenProyect').animate({width:'toggle'},500);
      if (newProyectFolder != ''){
        diretoryTreeToObj(newProyectFolder,
            function(err, res) {
                if ($('#fileSystem').is(":visible")) {
                    $('#fileSystem').jstree('destroy');
                    $('#fileSystem').jstree({'core': { 'data': res }, 'plugins': ["wholerow"] })
                        .on('select_node.jstree', function(e, data) {
                            var path = $('#fileSystem').jstree(true).get_node(data.selected).data.file;
                            var icon = $('#fileSystem').jstree(true).get_node(data.selected).icon;
                            if (icon != 'fa fa-folder') {
                                readFile(path);
                            }
                        });
                } else {
                    $('#fileSystem').jstree('destroy');
                    $('#fileSystem').jstree({'core': { 'data': res }, 'plugins': ["wholerow"] })
                        .on('select_node.jstree', function(e, data) {
                            var path = $('#fileSystem').jstree(true).get_node(data.selected).data.file;
                            var icon = $('#fileSystem').jstree(true).get_node(data.selected).icon;
                            if (icon != 'fa fa-folder') {
                                readFile(path);
                            }
                        });
                    $('#fileSystem').show();
                    instance = Split(['#fileSystem', '#content'], {
                        sizes: [25, 75],
                        gutterSize: 4,
                        cursor: 'col-resize',
                        direction: 'horizontal',
                    });

                }
              $scope.InitTheme($scope.conf.theme);
              $('#Loader').modal('toggle');

            });
      }

    }

    function CreateWebDir(){
      dialog.showOpenDialog({
          title: "Select App Directory",
          properties: ["openDirectory"]
      }, function(folderPaths) {
          // folderPaths is an array that contains all the selected paths
          if (folderPaths === undefined) {
              console.log('undefined');
              return;
          } else {
            var app = ''
            if (!fs.existsSync(path.join(folderPaths[0], '/app'))){app='app'}
            else if (!fs.existsSync(path.join(folderPaths[0], '/app2'))){app='app2'}
            else if (!fs.existsSync(path.join(folderPaths[0], '/app3'))){app='app3'}
            else if (!fs.existsSync(path.join(folderPaths[0], '/app4'))){app='app4'}
            else if (!fs.existsSync(path.join(folderPaths[0], '/app5'))){app='app5'}
            if (app != ''){
              fs.mkdirSync(path.join(folderPaths[0], '/'+ app));
              fs.mkdirSync(path.join(folderPaths[0], '/'+ app +'/styles'));
              fs.mkdirSync(path.join(folderPaths[0], '/'+ app +'/scripts'));
              fs.mkdirSync(path.join(folderPaths[0], '/'+ app +'/img'));
              fs.writeFile(path.join(folderPaths[0], '/'+ app +'/styles/main.css'), '/* Here goes your CSS Magic! /*', function(err) {
                  if (err) {
                      alert("An error ocurred creating the file " + err.message)
                  }
                  fs.writeFile(path.join(folderPaths[0], '/'+ app + '/scripts/main.js'), '// Here goes you JS Magic!', function(err) {
                      if (err) {
                          alert("An error ocurred creating the file " + err.message)
                      }
                      fs.writeFile(path.join(folderPaths[0], '/'+ app + '/index.html'),beautify_html(BoilerplateTemplate), function(err) {
                          if (err) {
                              alert("An error ocurred creating the file " + err.message)
                          }
                          $('#OpenProyect').animate({width:'toggle'},500);
                           newProyectFolder=folderPaths[0] + '/' + app;
                        }
                      );
                    }
                  );
                }
              );
              }
              else{
                toastr.error('The Selected Folder Contains Too Many Projects');
              }

          return folderPaths[0];
    }
  });
  }

    function OpenDir() {
        dialog.showOpenDialog({
            title: "Open Folder",
            properties: ["openDirectory"]
        }, function(folderPaths) {
            // folderPaths is an array that contains all the selected paths
            if (folderPaths === undefined) {
                return;
            } else {
                $('#Loader').modal('toggle');
                diretoryTreeToObj(folderPaths[0],
                    function(err, res) {
                        if ($('#fileSystem').is(":visible")) {
                            $('#fileSystem').jstree('destroy');
                            $('#fileSystem').jstree({'core': { 'data': res }, 'plugins': ["wholerow"] })
                                .on('select_node.jstree', function(e, data) {
                                    var path = $('#fileSystem').jstree(true).get_node(data.selected).data.file;
                                    var icon = $('#fileSystem').jstree(true).get_node(data.selected).icon;
                                    if (icon != 'fa fa-folder') {
                                        readFile(path);
                                    }
                                });
                        } else {
                            $('#fileSystem').jstree('destroy');
                            $('#fileSystem').jstree({'core': { 'data': res }, 'plugins': ["wholerow"] })
                                .on('select_node.jstree', function(e, data) {
                                    var path = $('#fileSystem').jstree(true).get_node(data.selected).data.file;
                                    var icon = $('#fileSystem').jstree(true).get_node(data.selected).icon;
                                    if (icon != 'fa fa-folder') {
                                        readFile(path);
                                    }
                                });
                            $('#fileSystem').show();
                            instance = Split(['#fileSystem', '#content'], {
                                sizes: [25, 75],
                                gutterSize: 4,
                                cursor: 'col-resize',
                                direction: 'horizontal',
                            });

                        }
                      $scope.InitTheme($scope.conf.theme);
                      $('#Loader').modal('toggle');
                    });
                return folderPaths;
            }
        });
    }

    function OpenFile() {
        dialog.showOpenDialog({
            title: "Open File"
        }, function(folderPaths) {
            // folderPaths is an array that contains all the selected paths
            if (folderPaths === undefined) {
                return;
            } else {
                readFile(folderPaths[0]);
            }
        });
    }

    function SaveAsFile(content) {
        dialog.showSaveDialog({
            title: "Save As...",
            defaultPath: $scope.actualPage.path
        }, function(fileName) {
            if (fileName === undefined) {
                return;
            }
            // fileName is a string that contains the path and filename created in the save file dialog.
            fs.writeFile(fileName, content, function(err) {
                if (err) {
                    alert("An error ocurred creating the file " + err.message)
                }
                toastr.success('File saved succesfully!');
                // Removing 'unsaved' tab style
                $('#' + $scope.actualPage.id + '-remove').removeClass('fa-circle');
                if (!$('#' + $scope.actualPage.id + '-remove').hasClass('fa-times')) {
                    $('#' + $scope.actualPage.id + '-remove').addClass('fa-times');
                    $('#' + $scope.actualPage.id + '-remove').removeClass('faa-vertical');
                    $('#' + $scope.actualPage.id + '-remove').removeClass('animated');
                }

                angular.forEach($scope.neutronTabs, function(tab) {
                    if (tab.id == ($scope.actualPage.id)) {
                        // Updating new content to the Tabs object
                        tab.content = editor[$scope.actualPage.id].getValue();
                        $scope.actualPage.content = editor[$scope.actualPage.id].getValue();

                        $scope.actualPage.path = fileName;
                        $scope.actualPage.title = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
                        tab.path = fileName;
                        tab.title = $scope.actualPage.title;
                        remote.getCurrentWindow().setTitle($scope.actualPage.path + '   -   Neutron');
                        StartWatcher(fileName);
                        $scope.$apply();

                    }
                });
                $('#pageTool').tooltipster("content", $scope.actualPage.path);
                $('#' + $scope.actualPage.id + '-tabTitle').tooltipster("content", $scope.actualPage.path);
            });

        });
    }

    function SaveFile(filepath, content) {
        //var filepath = "C:/Previous-filepath/existinfile.txt";// you need to save the filepath when you open the file to update without use the filechooser dialog againg
        //  var content = "This is the new content of the file";

        fs.writeFile(filepath, content, function(err) {
            if (err) {
                alert("An error ocurred updating the file" + err.message);
                console.log(err);
                return;
            }
            toastr.success('File saved succesfully!');
            // Removing 'unsaved' tab style
            $('#' + $scope.actualPage.id + '-remove').removeClass('fa-circle');
            if (!$('#' + $scope.actualPage.id + '-remove').hasClass('fa-times')) {
                $('#' + $scope.actualPage.id + '-remove').addClass('fa-times');
                $('#' + $scope.actualPage.id + '-remove').removeClass('faa-vertical');
                $('#' + $scope.actualPage.id + '-remove').removeClass('animated');
            }
            // Updating new content to the Tabs object
            angular.forEach($scope.neutronTabs, function(tab) {
                if (tab.id == ($scope.actualPage.id)) {
                    tab.content = editor[$scope.actualPage.id].getValue();
                    $scope.actualPage.content = editor[$scope.actualPage.id].getValue();
                }
            });

        });
    }

    function readFile(filepath) {
        $('#Loader').modal('toggle');
        fs.readFile(filepath, 'utf-8', function(err, data) {
            if (err) {
                alert("An error ocurred reading the file :" + err.message);
                return;
            }

            StartWatcher(filepath);
            // Change how to handle the file content

            $scope.nuevaTab(data, filepath);
            $scope.$apply();
              $('#Loader').modal('toggle');
        });
    }


    $(document).ready(function() {

        diretoryTreeToObj('C:/Users/Gabo/Desktop/neuti/Neutron posta/Neutron test 1.0.0',
            function(err, res) {
                $('#fileSystem').jstree({'core': { 'data': res }, 'plugins': ["wholerow"] })
                    .on('select_node.jstree', function(e, data) {
                        var path = $('#fileSystem').jstree(true).get_node(data.selected).data.file;
                        var icon = $('#fileSystem').jstree(true).get_node(data.selected).icon;
                        if (icon != 'fa fa-folder') {
                            readFile(path);
                        }
                    });
                $('#fileSystem').hide();
                $('#content').css('width', '100%');
            }
        );
        $('#findSearch').hide();
        $('#Designer-content').resizable();
        $('#Designer-content').draggable();
        $('#Lorem-content').draggable();
        $('.tooltipstered').tooltipster({
            animation: 'grow',
            theme: 'tooltipster-punk'
        });
        var colorWheel = new ColorWheel('#ColorWheel');
        colorWheel.bindData(5);
        $(document).on('click', '#footer .dropdown-menu', function(e) {
            e.stopPropagation();
        });

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "500",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "slideDown",
            "hideMethod": "fadeOut"
        }

        $('.colorwheel-theme-value').on('click', function() {
            $scope.copyColor($(this));
        });


        //Listening to the fucking key events
        $(window).bind('keydown', function(event) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        if ($scope.actualPage.path != 'untitled') {
                            SaveFile($scope.actualPage.path, editor[$scope.actualPage.id].getValue());
                        } else {
                            SaveAsFile(editor[$scope.actualPage.id].getValue());
                        }
                        break;
                    case 'f':
                        event.preventDefault();
                        $('#findSearch').slideToggle();
                        break;
                    case 'g':
                        event.preventDefault();
                        alert('ctrl-g');
                        break;
                }
            }
        });
		    $scope.InitTheme($scope.conf.theme);
        $scope.nuevaTab();
        $scope.$apply();

        // $('#Lorem').on('shown.bs.modal', function (event) {
        //   $('body.modal-open #content,body.modal-open #fileSystem,body.modal-open #footer, body.modal-open .gutter').css('-webkit-filter','blur(4px)');
        // });
        // $('#Lorem').on('hide.bs.modal', function (event) {
        //   $('body.modal-open #content,body.modal-open #fileSystem,body.modal-open #footer, body.modal-open .gutter').css('-webkit-filter','none');
        // });
        //
        // $('#Loader').on('shown.bs.modal', function (event) {
        //   $('body.modal-open #content,body.modal-open #fileSystem,body.modal-open #footer, body.modal-open .gutter').css('-webkit-filter','blur(4px)');
        // });
        // $('#Loader').on('hide.bs.modal', function (event) {
        //   $('body.modal-open #content,body.modal-open #fileSystem,body.modal-open #footer, body.modal-open .gutter').css('-webkit-filter','none');
        // });
        //
        // $('#FileChange').on('shown.bs.modal', function (event) {
        //   $('body.modal-open #content,body.modal-open #fileSystem,body.modal-open #footer, body.modal-open .gutter').css('-webkit-filter','blur(4px)');
        // });
        //
        // $('#FileChange').on('hide.bs.modal', function (event) {
        //   $('body.modal-open #content,body.modal-open #fileSystem,body.modal-open #footer, body.modal-open .gutter').css('-webkit-filter','none');
        // });
        //
        $('#FontAwesomeForm').on('shown.bs.modal', function (event) {
          $('#FontAwesomeForm-content .modal-header input').focus();
        });


        var appMenu = Menu.buildFromTemplate([
                { label: 'File', submenu: [{ label: 'New Proyect', submenu:[{ label:'New Web Proyect', click: function(){var la = CreateWebDir();}}]},
                  						   { label: 'New Window' },
                                           { label: 'New File', click: function() {
                                                                                   $scope.nuevaTab();
                                                                                   $scope.$apply();
                                                                                   }
                                           },
                                           { label: 'Open Folder...', click: function() {var dir = OpenDir();}},
                                           { label: 'Open File...', click: function() { OpenFile(); }},
                                           { type: "separator" },
                                           { label: 'Save', accelerator: 'CmdOrCtrl+S', click: function() {
                                                                                                           if ($scope.actualPage.path != 'untitled') {
                                                                                                             SaveFile($scope.actualPage.path, editor[$scope.actualPage.id].getValue());
                                                                                                           } else {
                                                                                                             SaveAsFile(editor[$scope.actualPage.id].getValue());
                                                                                                           }
                                                                                                          }
                                           },
                                           { label: 'Save As...', click: function() { SaveAsFile(editor[$scope.actualPage.id].getValue()); }},
                                           { label: 'Save All' }
                                          ]
            	},
          		{ label: 'Edit',submenu: [{	label: 'Undo', accelerator: 'CmdOrCtrl+Z', click: function() {
                                                                                                           editor[$scope.actualPage.id].execCommand('undo');
                                                                                                           checkChanges();
                                                                                                          }
                							},
                                          { label: 'Redo',  accelerator: 'CmdOrCtrl+Y', click: function() {
                                                                                                            editor[$scope.actualPage.id].execCommand('redo');
                                                                                                            checkChanges();
                                                                                                          }
                						   },
                                          { label: 'Undo Selection', accelerator: 'CmdOrCtrl+U', click: function() {
                                                                                                              editor[$scope.actualPage.id].execCommand('undoSelection');
                                                                                                              checkChanges();
                                                                                                          }
                                           },
                                          { label: 'Redo Selection', accelerator: 'CmdOrAlt+U', click: function() {
                                                                                                              editor[$scope.actualPage.id].execCommand('redoSelection');
                                                                                                              checkChanges();
                                                                                                          }
                						   },
                                          { type: 'separator' },
                                          { label: 'Cut', accelerator: 'CmdOrCtrl+X', click: function() {
                                                                                                           remote.getCurrentWindow().cut();
                                                                                                           checkChanges();
                                                                                                          }
                						   },
                                          { label: 'Copy', accelerator: 'CmdOrCtrl+C', click: function() {
                                                                                                remote.getCurrentWindow().copy();
                                                                                                checkChanges();
                                                                                            }
                						   },
                                          { label: 'Paste', accelerator: 'CmdOrCtrl+V', click: function() {
                                                                                                remote.getCurrentWindow().paste();
                                                                                                checkChanges();
                                                                                            }
                						   },
                                          { label: 'Select All', accelerator: 'CmdOrCtrl+A', click: function() {
                                                                                                      editor[$scope.actualPage.id].execCommand('selectAll');
                                                                                                      checkChanges();
                                                                                                  }
                						   },
                                          { type: 'separator' },
                                          { label: 'Lines', submenu: [{ label: 'Indent', accelerator: 'CmdOrCtrl+]', click: function() {
                                                                                                                        editor[$scope.actualPage.id].execCommand('indentMore');
                                                                                                                        checkChanges();
                                                                                                                    }
                    												   },
                                                                      { label: 'Outdent', accelerator: 'CmdOrCtrl+[', click: function() {
                                                                                                                        editor[$scope.actualPage.id].execCommand('indentLess');
                                                                                                                        checkChanges();
                                                                                                                    }
                    													},
                                                                      { label: 'Auto Indent', accelerator: 'Shift+Tab', click: function() {
                                                                                                                            editor[$scope.actualPage.id].execCommand('indentAuto');
                                                                                                                            checkChanges();
                                                                                                                        }
                    												   },
                                                                      { type: 'separator' },
                                                                      { label: 'Go to Start of Document', accelerator: 'CmdOrCtrl+Home', click: function() {
                                                                                                                                                    editor[$scope.actualPage.id].execCommand('goDocStart');
                                                                                                                                                }
                    												   },
                                                                      { label: 'Go to End of Document', accelerator: 'CmdOrCtrl+End', click: function() {
                                                                                                                                              editor[$scope.actualPage.id].execCommand('goDocEnd');
                                                                                                                                          }
                    												   },
                                                                      { label: 'Go to Start of Line', accelerator: 'OptionOrAlt+Left', click: function() {
                                                                                                                                                editor[$scope.actualPage.id].execCommand('goLineStart');
                                                                                                                                            }
                    												   },
                                                                      { label: 'Go to End of Line', accelerator: 'OptionOrAlt+Right', click: function() {
                                                                                                                                                editor[$scope.actualPage.id].execCommand('goLineEnd');
                                                                                                                                            }
                    												   },
                                                                      { label: 'Go Page Up', accelerator: 'Page Up', click: function() {
                                                                                                                                editor[$scope.actualPage.id].execCommand('goPageUp');
                                                                                                                            }
                    												   },
                                                                      { label: 'Go Page Down', accelerator: 'Page Down', click: function() {
                                                                                                                        editor[$scope.actualPage.id].execCommand('goPageDown');
                                                                                                                    }
                                                                      },
                                                                      { label: 'Delete Current Line', accelerator: 'CmdOrCtrl+D', click: function() {
                                                                                                                                              editor[$scope.actualPage.id].execCommand('deleteLine');
                                                                                                                                              checkChanges();
                                                                                                                                          }
                    													}
                                                                     ]
                                          },
                                          {label: 'Minify File', click:function(){
                                                                          var exten = $scope.actualPage.title.substring($scope.actualPage.title.lastIndexOf('.') + 1, $scope.actualPage.title.length);
                                                                          if (exten == 'html') {
                                                                              editor[$scope.actualPage.id].setValue(minify(editor[$scope.actualPage.id].getValue(),{collapseWhitespace:true,
                                                                                                                                                      caseSensitive:true,
                                                                                                                                                      collapseInlineTagWhitespace:true,
                                                                                                                                                      html5:true,
                                                                                                                                                      minifyCSS:true,
                                                                                                                                                      minifyJS:true,
                                                                                                                                                      minifyURLs:true}));
                                                                              checkChanges();
                                                                          }
                                                                          else if (exten == 'css'){
                                                                              editor[$scope.actualPage.id].setValue(new CleanCSS().minify(editor[$scope.actualPage.id].getValue()).styles);
                                                                              checkChanges();
                                                                          }
                                                                          else if(exten == 'js'){
                                                                              var result = UglifyJS.minify(editor[$scope.actualPage.id].getValue(), {fromString: true});
                                                                              editor[$scope.actualPage.id].setValue(result.code);
                                                                              checkChanges();
                                                                          }

                                                                          }
                                          },
                                          {label: 'Beautify File', click: function() {
                                                                         var exten = $scope.actualPage.title.substring($scope.actualPage.title.lastIndexOf('.') + 1, $scope.actualPage.title.length);
                                                                         if (exten == 'html') {
                                                                           editor[$scope.actualPage.id].setValue(beautify_html(editor[$scope.actualPage.id].getValue()));
                                                                           checkChanges();
                                                                         } else if (exten == 'js') {
                                                                           editor[$scope.actualPage.id].setValue(beautify_js(editor[$scope.actualPage.id].getValue()));
                                                                           checkChanges();
                                                                         } else if (exten == 'css') {
                                                                           editor[$scope.actualPage.id].setValue(beautify_css(editor[$scope.actualPage.id].getValue()));
                                                                           checkChanges();
                                                                         }
                                                                      }
                						  }
                                         ]

                },
          		{ label: 'View', submenu: [{ label: 'Toggle Full Screen', click: function() {
                                                                                if (remote.getCurrentWindow().isFullScreen()) {
                                                                                    remote.getCurrentWindow().setFullScreen(false)
                                                                                } else {
                                                                                    remote.getCurrentWindow().setFullScreen(true)
                                                                                }
                                                                            }
                							},
                                           { label: 'Panes' },
                                           { label: 'Developer', submenu: [{ label: 'Toggle Developer Tools', click: function() { remote.getCurrentWindow().toggleDevTools(); }}]},
                                           { label: 'Bottom Bar', submenu: [{ label: 'Toggle Preview button', click: function(){
                                                                                                                                  if($('#preview-button').is(':visible')){
                                                                                                                                    $('#preview-button').hide();
                                                                                                                                  }
                                                                                                                                  else{
                                                                                                                                    $('#preview-button').show();
                                                                                                                                  }
                                           																						}
                                                                            },
                                                                            { label: 'Toggle Palette button' ,click: function(){
                                                                                                                                if($('#palette-button').is(':visible')){
                                                                                                                                  $('#palette-button').hide();
                                                                                                                                  }
                                                                                                                                  else{
                                                                                                                                    $('#palette-button').show();
                                                                                                                                  }
                                                                            													}
                                                                            }
                                                                           ]

                							},
                                           { label: 'Toggle Tree View', click: function() {
                                                                                   if ($('#fileSystem').is(":visible")) {
                                                                                     instance.destroy();
                                                                                     $('#fileSystem').hide();
                                                                                     $('#content').css("width", "100%")
                                                                                   } else {
                                                                                     $('#fileSystem').show();
                                                                                     instance = Split(['#fileSystem', '#content'], {
                                                                                       sizes: [25, 75],
                                                                                       gutterSize: 4,
                                                                                       cursor: 'col-resize',
                                                                                       direction: 'horizontal',
                                                                                     });
                                                                                   }
                                                                                   $scope.InitTheme($scope.conf.theme);
                                                                                 }
                                           },
                                          ]


                },
          		{ label: 'Settings',submenu: [{label:'Minify Settings'},
                                             {label:'Beautify Settings'},
                                             {label:'Themes',submenu:[{label:'Nautilus Green Waters', click: function(){$('#Loader').modal('toggle');$scope.ChangeTheme($scope.conf.theme,'material');}},
                                                                      {label:'Nautilus Deep Sea', click: function(){$('#Loader').modal('toggle');$scope.ChangeTheme($scope.conf.theme,'nautilusDeepSea');}},
                                                                      {label:'Sublime Text', click: function(){$('#Loader').modal('toggle');$scope.ChangeTheme($scope.conf.theme,'monokai');}},
                                                                      {label:'Vintage', click: function(){$('#Loader').modal('toggle');$scope.ChangeTheme($scope.conf.theme,'ambiance');}},
                                                                      {label:'Dracula', click: function(){$('#Loader').modal('toggle');$scope.ChangeTheme($scope.conf.theme,'dracula');}}
                                                                      ]}
                                             ]},
          	   { label: 'Tools', submenu: [{ label: 'Lorem Ipsum Generator', accelerator: 'Ctrl+Shift+L', click: function() { $('#Lorem').modal('show'); }},
                                           { label: 'Font Awesome Browser',click:function(){$('#FontAwesomeForm').modal('toggle');}},
                                           { label: 'Search in StackOverflow', click: function(){$('#StackOForm').modal('toggle')}},
                                           { label: 'Font Creator'},
                                           { label: 'Minify File', click:function(){
                											var exten = $scope.actualPage.title.substring($scope.actualPage.title.lastIndexOf('.') + 1, $scope.actualPage.title.length);
                        									if (exten == 'html') {
                                                                editor[$scope.actualPage.id].setValue(minify(editor[$scope.actualPage.id].getValue(),{collapseWhitespace:true,
                                                                                                                                        caseSensitive:true,
                                                                                                                                        collapseInlineTagWhitespace:true,
                                                                                                                                        html5:true,
                                                                                                                                        minifyCSS:true,
                                                                                                                                        minifyJS:true,
                                                                                                                                        minifyURLs:true}));
                                                                checkChanges();
                                                            }
                  											else if (exten == 'css'){
                                                                editor[$scope.actualPage.id].setValue(new CleanCSS().minify(editor[$scope.actualPage.id].getValue()).styles);
                                                              	checkChanges();
                                                            }
                  											else if(exten == 'js'){
                                                            	var result = UglifyJS.minify(editor[$scope.actualPage.id].getValue(), {fromString: true});
                                                            	editor[$scope.actualPage.id].setValue(result.code);
                                                              	checkChanges();
                                                            }

                											}
                   },
                   {label: 'Beautify File', click: function() {
                                                                 var exten = $scope.actualPage.title.substring($scope.actualPage.title.lastIndexOf('.') + 1, $scope.actualPage.title.length);
                                                                 if (exten == 'html') {
                                                                   editor[$scope.actualPage.id].setValue(beautify_html(editor[$scope.actualPage.id].getValue()));
                                                                   checkChanges();
                                                                 } else if (exten == 'js') {
                                                                   editor[$scope.actualPage.id].setValue(beautify_js(editor[$scope.actualPage.id].getValue()));
                                                                   checkChanges();
                                                                 } else if (exten == 'css') {
                                                                   editor[$scope.actualPage.id].setValue(beautify_css(editor[$scope.actualPage.id].getValue()));
                                                                   checkChanges();
                                                                 }
                                                              }
                }								]
            }

        ]);
        Menu.setApplicationMenu(appMenu);
    });

}]);

//sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
