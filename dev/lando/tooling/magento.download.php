#!/usr/bin/env php
<?php

class magentoDownloaderCli
{
    private $input = [];
    const REQUIRED_ARGS = [
        'mage-edition',
        'mage-version',
        'mage-access-key-public',
        'mage-access-key-private',
        'github-token',
    ];

    public function __construct(array $argv)
    {
        $this->input = $this->parseArgs($argv);

        $this->validateInput();
    }

    private function parseArgs($argv)
    {
        array_shift($argv);
        $o = array();
        foreach ($argv as $a) {
            if (substr($a, 0, 2) == '--') {
                $eq = strpos($a, '=');
                if ($eq !== false) {
                    $o[substr($a, 2, $eq - 2)] = substr($a, $eq + 1);
                } else {
                    $k = substr($a, 2);
                    if (!isset($o[$k])) {
                        $o[$k] = true;
                    }
                }
            } else if (substr($a, 0, 1) == '-') {
                if (substr($a, 2, 1) == '=') {
                    $o[substr($a, 1, 1)] = substr($a, 3);
                } else {
                    foreach (str_split(substr($a, 1)) as $k) {
                        if (!isset($o[$k])) {
                            $o[$k] = true;
                        }
                    }
                }
            } else {
                $o[] = $a;
            }
        }
        return $o;
    }

    /**
     * @return array
     */
    public function getInput()
    {
        return $this->input;
    }

    private function validateInput()
    {
        try {
            $input = $this->getInput();
            foreach (self::REQUIRED_ARGS as $requiredArg) {
                $trimmedInput = trim($input[$requiredArg]);
                if (!key_exists($requiredArg, $input) || empty($trimmedInput))
                    throw new Exception("MISSING ARGUMENT: {$requiredArg} is required.");

                $this->input[$requiredArg] = trim($trimmedInput);
            }

            if($input['mage-version'] === '2.3' || $input['mage-version'] === '2.3.0')
                throw new Exception('Know setup:install bug in Magento 2.3.0. Please specify 2.3.1 or higher');
        } catch (Exception $error) {
            echo "\n{$error->getMessage()}\n\n";
            exit(1);
        }
    }

    /**
     * @return string
     * @throws Exception
     */
    public function getEdition()
    {
        $input = $this->getInput();
        switch (strtolower($input['mage-edition'])):
            case 'open source':
                return 'magento/project-community-edition';
            case 'commerce':
                return 'magento/project-enterprise-edition';
            default:
                throw new Exception('INVALID ARGUMENT: Unacceptable Magento Edition Provided.');
        endswitch;
    }

    public function download()
    {
        $input = $this->getInput();
        $composerAuth = sprintf(
            '{"http-basic": {"repo.magento.com": {"username": "%s","password": "%s"}}, "github-oauth": {"github.com": "%s"}}',
            $input['mage-access-key-public'],
            $input['mage-access-key-private'],
            $input['github-token']
            );
        try {
            $this->createProject($composerAuth, $input);
        } catch (Exception $error) {
            echo "\n\n Could not create Magento project. Got error: {$error->getMessage()}\n\n";
            exit(1);
        }
        $this->prepareProject($composerAuth);

        $this->complete();
    }

    private function complete()
    {
        echo "\n";
        echo "\n";
        echo "\n";
        echo "\n";
        echo "\n    +++++++++++++++++++++++++++++++++++";
        echo "\n";
        echo "\n    Magento has been downloaded! Now...";
        echo "\n      Execute: `lando start && lando composer install && lando magento:setup:quick #Optional --use-sample-data`";
        echo "\n";
        echo "\n      If you experience difficulty installing Magento try running the above commands 1 at a time to see the error output";
        echo "\n";
        echo "\n      That's it! You will then be able to access your Magento store at https://magento2.lndo.site/";
        echo "\n";
        echo "\n      Run `lando` to see available shortcuts such as `lando magento` and `lando composer`!";
        echo "\n";
    }

    /**
     * @param $composerAuth
     * @param array $input
     * @throws Exception
     */
    private function createProject($composerAuth, array $input)
    {
        shell_exec('rm -rf /tmp/magento');
        shell_exec("export COMPOSER_AUTH='{$composerAuth}'; composer create-project -n --no-install --repository-url=https://repo.magento.com/ {$this->getEdition()} /tmp/magento {$input['mage-version']}");
    }

    /**
     * @param $composerAuth
     */
    private function prepareProject($composerAuth)
    {
        shell_exec("cp -r /tmp/magento/. /app");
        file_put_contents(
            '/app/nginx.conf.sample',
            fopen('https://raw.githubusercontent.com/magento/magento2/'.$this->input['mage-version'].'/nginx.conf.sample', 'r')
        );
        file_put_contents("/app/auth.json", $composerAuth);
    }
}

$magentoDownloaderCli = new magentoDownloaderCli((array)$argv);
$magentoDownloaderCli->download();
