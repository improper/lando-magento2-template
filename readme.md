# Important notes

1. This setup expects [Lando](https://docs.devwithlando.io/installation/installing.html) to be installed and ready to go on your machine
1. This setup expects Magento's stock `nginx.conf.sample` to exist in Magento's project root.
   - **NOTE**: If you follow the Quick Setup instructions this file will be automatically downloaded 
1. You may experience performance gains by:
   - Adding Redis, Elasticsearch, etc.. These services can easily be added following Lando's documentation.
   - For Windows & MacOS, Lando has an experimental feature that disables file synchronization between the host and container that can be implemented as shown below. However, you will need to copy these files manually to your host if using an IDE that depends on the directories you exclude.
     ```yaml
     # Add to .lando.yml as a root property
     excludes: # **Warning:** Experimental Lando Feature
        - vendor # Optionally disable syncing of this directory
        - '!vendor/my-company/my-dev-module' # Restore syncing to a subdirectory of an excluded directory
        - node_modules
        - '!node_modules/my-company/my-dev-module'
        # Improve performance of Magento-writable directories
        - pub/media
        - pub/static
        - var/cache # If using file-based cache
        - var/page_cache # If using file-based cache
        - var/session # If using file-based sessions
        - generated # Magento generated code
     ```

# Quick Setup

1. `git clone git@github.com:improper/lando-magento2-template.git && cd lando-magento2-template`
1. Run `lando magento:download`
1. Add your Magento credentials to auth.json
   - Magento: https://marketplace.magento.com/customer/accessKeys/
   - GitHub: https://github.com/settings/tokens
1. Launch your new store and deploy the database:
   ```bash
   lando start
   lando composer install
   lando magento:setup:quick # Optional: ----use-sample-data 
   ```

That's it! Your store is ready for development: https://magento2.lndo.site/  

# Customizing Lando

This repository ships with with a `.lando.base.yaml`. To modify your Lando setup, you have a few options:

 - Remove and replace `.lando.base.yaml`
 - Extend `.lando.base.yaml` with your own `.lando.yml` or `.lando.local.yml`
   - This will allow you to override any of the properties found within `.lando.base.yaml`. You can rename the project, add new tooling, disable existing tooling and add/remove/modify services as needed.
   
For best practices, please refer to Lando's [landofile documentaion](https://docs.devwithlando.io/config/lando.html)

## Bonus Info

Run `lando` to see available shortcuts such as `lando magento` and `lando composer`!

`lando magento:setup:quick` is an alias for `lando magento setup:install` and is pre-configured to setup the Lando DB connection.

 - Defaults to developer mode.
 - See `lando magento:setup:quick --help` for additional configuration options.
 - For the sake of shortcuts, `lando magento:setup:destroy` is also available.

## Where is my admin?

If you did not pass specify arguments for `lando magento:setup:quick`, you will probably want to know your admin URI and to create an admin user.

 - Fetch Admin URI: `lando magento info:adminuri`
 - Create admin user: `lando magento admin:user:create`
