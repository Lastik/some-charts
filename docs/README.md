# Some Charts documentation

**Some Charts documentation with playgrounds**


## Showcase



## Features


## Usage

It is possible to use Some Charts through different ways:

### Online - No installation as remote theme



### Online - No installation copy or clone


### Local install

LibDoc requires only [Jekyll](https://jekyllrb.com/) to compile your work.

1. Install Jekyll on your machine following the steps described [here](https://jekyllrb.com/docs/)
2. Get the latest version of LibDoc 
    * [Download blank](https://github.com/olivier3lanc/Jekyll-LibDoc/archive/refs/heads/master.zip) or [Download with demo content](https://github.com/olivier3lanc/Jekyll-LibDoc/archive/refs/heads/develop.zip)
    * You can also clone repository from your terminal `git clone git@github.com:olivier3lanc/Jekyll-LibDoc.git`
3. Into the folder where LibDoc was copied, adjust your settings of your YAML file, Most important are
    * `url` <br>The host of your local set up, this can be for example *http://localhost* or *http://192.168.1.2* or domaine name
    * `baseurl` <br>The path to your local copy of LibDoc. For example */Jekyll-LibDoc/_site*
    * `title` <br>Title of the documentation
    * `description` <br>Description of your documentation project
4. Compile your project using:
    * `jekyll build`<br> Builds the project using *_config.yml*
    * `jekyll build -c _personal-config.yml` <br> Builds the project using *_personal-config.yml*
    * `jekyll build -c _personal-config.yml --watch` <br> Builds the project using *_personal-config.yml* and automatically compiles on detected changes.
    * Learn more about command line usage on [official Jekyll documentation](https://jekyllrb.com/docs/usage/)

### Local with remote theme

[View example repository](https://github.com/olivier3lanc/LibDoc-remote-demo/tree/local)

It is possible to only write your content without complete LibDoc installation, just use LibDoc as remote theme. You only need to use locally [Jekyll remote theme plugin](https://github.com/benbalter/jekyll-remote-theme)

1. Install Jekyll on your machine following the steps described [here](https://jekyllrb.com/docs/)
2. Add a Gemfile with the following line

  ```ruby
  gem "jekyll-remote-theme"
  ```
  and run `bundle install` to install the plugin

3. Add the following to your LibDoc's local config file `_config-local.yml`

  ```yml
  remote_theme: olivier3lanc/Jekyll-LibDoc
  plugins:
    - jekyll-remote-theme
  ```

4. Run `jekyll build` or with any custom config file `jekyll build -c _your-own-config.yml`

Feel free to use the [example repository](https://github.com/olivier3lanc/LibDoc-remote-demo/tree/local) as starter template.

## Contributing

Feel free to contribute to LibDoc development, fork this project, make changes on develop branch and send pull requests or simply report issues.
