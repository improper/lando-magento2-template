> **Note** Most PHP apps hosted on Platform.sh can be cloned by Lando with a single `lando init` command. If starting with a new project, I highly suggest creating a Magento website from the [Platform.sh Marketplace](https://platform.sh/marketplace/) and then checking out the [Lando/Platform.sh docs](https://docs.platform.sh/development/local/lando.html).

Important notes
---------------

1. This setup expects [Lando](https://docs.devwithlando.io/installation/installing.html) to be installed and ready to go on your machine
1. This setup expects Magento's stock `nginx.conf.sample` to exist in Magento's project root.
   - **NOTE**: If you follow the Quick Setup instructions this file will be automatically downloaded 
1. You may experience performance gains by:
   - Adding Redis, Elasticsearch, etc.. These services can easily be added following Lando's documentation.
   - For Windows & MacOS, Lando has an experimental feature that disables file synchronization between the host and container that can be implemented as shown below. However, you will need to copy these files manually to your host if using an IDE that depends on the directories you exclude.
     ```yaml
     # Add to .lando.yml as a root property
     # Must be implemented prior to `lando start`. Otherwise, modification requires `lando rebuild`
     excludes: # **Warning:** Experimental Lando Feature
        - vendor # Optionally disable syncing of this directory
        - '!vendor/my-company/my-dev-module' # Restore syncing to a subdirectory of an excluded directory
        - node_modules
        - '!node_modules/my-company/my-dev-module'
        # Improve performance of Magento-writable directories
        - pub/media
        - pub/static
     ```
1. Last, the `lando magento:setup:quick` command accepts the `--use-sample-data` option. Keep in mind there are [known issues](https://community.magento.com/t5/Magento-2-x-Technical-Issues/Shipping-doesn-t-work-any-more-after-update-to-2-3-0/td-p/136097) with this in Magento 2.3

Getting Started with Magento 2 & Lando
======================================

Quick Setup
-----------

```
# Clone and access this repository
git clone https://github.com/improper/lando-magento2-template.git
cd lando-magento2-template
```

```
# Review Magento Download Options
cd lando-magento2-template
lando --help magento:download
```

```
# Download Magento. Drop arguments for interactive mode.
cd lando-magento2-template
lando magento:download --mage-edition "Open Source" \
    --mage-version 2.3.5 \
    --mage-access-key-private $MAGE_PRIVATE_KEY \
    --mage-access-key-public $MAGE_PUBLIC_KEY \
    --github-token $MY_GITHUB_TOKEN \
    --notify-magento false \
    --notify-github false
```

```
# Your auth.json has automatically been generated
cd lando-magento2-template
cat auth.json
```

```
# Deploy Mangento with configured database
cd lando-magento2-template
lando start
lando composer install
lando magento:setup:quick --use-sample-data
```

That's it! Your store is ready for development: https://magento2.lndo.site/  

```
# Confirm store is accessible via bash
curl -I -k --fail -s https://magento2.lndo.site/home | grep 200 && echo "Good to go."
```

You should now be able to access your local installation of Magento: https://magento2.lndo.site/ (or whatever proxy value you have set in your lando.base.yaml file)

If you have followed the quick setup without providing any other parameters be aware your Magento database will have no base_url or base_url_secure values yet.  This can and in most cases will cause a redirect loop when acessing the Magento admin page.

All lndo.site sub-domains https://magento2.lndo.site/ are real URL's, therefor won't be available offline.

Alternatively localhost.xxxx URL's are available offline but change with every Lando rebuild.  See `lando info` for your URIs that point to this sandbox. And, always, you can modify the URI with:

`lando magento setup:store-config:set --base-url=$PROVIDE_URL --base-url-secure=$PROVIDE_URL`

Customizing Lando
-----------------

This repository ships with a `.lando.base.yaml` which provides your Magento services as well as a `.lando.yml` which provides additions and overrides to the `.lando.base.yml`.

You may be happy merging `.lando.base.yaml` into `.lando.yml`. To help you make that decision, checkout the [Landofile documentaion](https://docs.devwithlando.io/config/lando.html) for best practices.

Bonus Info
----------

We have some bonus tooling included. Review it with `lando`.

```
# Review additional Magento tooling
cd lando-magento2-template
lando --help magento:setup:destroy
lando --help magento:setup:quick
```

`lando magento:setup:quick` is an alias for `lando magento setup:install` and is pre-configured to set up the Lando DB connection.

Where is my admin?
------------------

If you did not pass specify arguments for `lando magento:setup:quick`, you will probably want to know your admin URI and to create an admin user.
 - Fetch Admin URI: `lando magento info:adminuri`
 - Create admin user: `lando magento admin:user:create`

Cleanup
-------

```
# Jump into repo directory
cd lando-magento2-template
# Destroy  everything
lando destroy -y
cd .. && rm -r lando-magento2-template
```
