#!/usr/bin/env bash

# Download latest Magento 2
wget $(curl -s https://api.github.com/repos/magento/magento2/releases/latest | grep zipball_url | cut -d '"' -f 4) -O magento_latest.zip

# Unzip Magento & copy to /app
unzip magento_latest.zip -d /tmp/magento-extract
cp --verbose -R /tmp/magento-extract/magento*/. /app

# Add Magento Composer repository to composer.json - for use with sample data installation
composer config repositories.magento composer https://repo.magento.com/

# Init auth.json
rm magento_latest.zip && cp auth.json.sample auth.json

# Provide next step instructions
echo ""
echo ""
echo "    Magento has been downloaded! Now..."
echo "      1. Add your Magento credentials to auth.json"
echo "         Magento: https://marketplace.magento.com/customer/accessKeys/"
echo "         GitHub: https://github.com/settings/tokens"
echo "      2. \`lando start && lando composer install && lando magento:setup:quick #Optional --use-sample-data\`"
echo
echo "That's it! You will then be able to access your Magento store at https://magento2.lndo.site/"
echo ""
echo "Run \`lando\` to see available shortcuts such as \`lando magento\` and \`lando composer\`!"
echo ""
