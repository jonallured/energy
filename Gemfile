source 'https://rubygems.org'

gem 'fastlane'

gem 'cocoapods', '1.11.3'

# So we know if we need to run `pod install`
gem 'cocoapods-check'
gem 'down'
gem 'dotenv'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)