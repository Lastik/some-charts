# Jekyll LibDoc locally as remote theme

This `local`branch is a simple example of a repository that you can **build locally with Jekyll LibDoc as remote theme**.

1. Install Jekyll on your machine following the steps described [here](https://jekyllrb.com/docs/)
2. Add a Gemfile with the following line

  ```ruby
  gem "jekyll-remote-theme"
  ```
  and run `bundle install` to install the plugin
  Note: If you are using a Jekyll version less than 3.5.0, use the `gems` key instead of `plugins`.

3. Add the following to your LibDoc's local config file `_config-local.yml`

  ```yml
  remote_theme: olivier3lanc/Jekyll-LibDoc
  plugins:
    - jekyll-remote-theme
  ```
  
4. Run `jekyll build` or with any custom config file `jekyll build -c _your-own-config.yml`
