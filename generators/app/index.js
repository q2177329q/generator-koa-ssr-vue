'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
      super(args, opts);
      this.appname = "koa-vue-ssr";
  }
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the world-class ' + chalk.red('generator-koa-ssr-vue') + ' generator!'
    ));

    const prompts = [{
        type: 'input',
        name: 'name',
        message: 'Input Your project name',
        default: this.appname // Default to current folder name
    },
    {
       type: 'list',
       name: 'preprocessor',
       message: 'Select the CSS preprocessor',
       choices: ['PostCSS', 'Less', 'Sass', 'Stylus']
   }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.appname = props.name;
    });
  }

  default () {
    // console.log(mkdirp)
    // console.log(this.props.name)
    // mkdirp.mkdirp(this.props.name);
    // this.destinationRoot(this.destinationPath(this.props.name));
  }

  writing() {
    const _path = this.appname;
    let css = '';
    let postcss = '';
    var pkg = this.fs.readJSON(this.templatePath('package.json'), {});
    // var baseConfig = require ('./templates/build/webpack.base.config.js');
    // console.log(baseConfig)
    switch (this.props.preprocessor) {
      case 'PostCSS':
         Object.assign(pkg.devDependencies, {
            "postcss": "^6.0.0",
             "postcss-cssnext": "^3.0.0"
         })
         postcss = `postcss: [require('postcss-cssnext')()]`
         break;
      case 'Less': 
        Object.assign(pkg.devDependencies, {
          "less": "^2.7.2",
          "less-loader": "^4.0.5",
          "vue-style-loader": "^3.0.1"
        })
        css = `{
        test: /\.(less)$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }, {
            loader: "less-loader"
        }]
      },`
        // console.log(pkg)
        break;
      case 'Sass':
        Object.assign(pkg.devDependencies, {
          "sass-loader": "6.0.0",
          "node-sass": "^4.5.0",
          "vue-style-loader": "^3.0.1"
        })

        css = `{
        test: /\.(scss|sass)$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }, {
            loader: "sass-loader"
        }]
      },`
    }
    console.log(pkg)
    this.fs.copy(
      this.templatePath('src'),
      this.destinationPath(_path +  '/src')
    );
    this.fs.copy(
      this.templatePath('test'),
      this.destinationPath(_path +  '/test')
    );
    this.fs.copy(
      this.templatePath('server.js'),
      this.destinationPath(_path +  '/server.js')
    );
    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath(_path +  '/README.md')
    );
    // this.fs.copy(
    //   this.templatePath('package.json'),
    //   this.destinationPath(_path +  '/package.json')
    // );
    this.fs.writeJSON(this.destinationPath(_path +  '/package.json'), pkg);
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath(_path +  '/index.html')
    );
    this.fs.copy(
      this.templatePath('build'),
      this.destinationPath(_path +  '/build')
    );
    this.fs.copyTpl(
      this.templatePath('build/webpack.base.config.js'),
      this.destinationPath(_path +  '/build/webpack.base.config.js'),
      {css: css}
    );
    this.fs.copyTpl(
      this.templatePath('build/vue-loader.config.js'),
      this.destinationPath(_path +  '/build/vue-loader.config.js'),
      {postcss: postcss}
    );
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath(_path +  '/.gitignore')
    );
    this.fs.copy(
      this.templatePath('.eslintrc.js'),
      this.destinationPath(_path +  '/.eslintrc.js')
    );
    this.fs.copy(
      this.templatePath('.eslintignore'),
      this.destinationPath(_path +  '/.eslintignore')
    );
    this.fs.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath(_path +  '/.editorconfig')
    );
    this.fs.copy(
      this.templatePath('.babelrc'),
      this.destinationPath(_path +  '/.babelrc')
    );
  }

  install() {
    // spawnCommandSync(command, args, optopt)
    // this.spawnCommandSync(`cd`, [this.appname], {
    //   cwd: this.destinationRoot()
    // })

    this.destinationRoot(this.destinationPath(this.props.name));
    this.installDependencies({
      npm: true,
      bower: false
    });
  }
};
