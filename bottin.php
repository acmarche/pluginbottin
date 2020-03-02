<?php
/**
 * Plugin Name:     Bottin
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     PLUGIN DESCRIPTION HERE
 * Author:          YOUR NAME HERE
 * Author URI:      YOUR SITE HERE
 * Text Domain:     bottin
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Bottin
 */

require_once( __DIR__ . '/../../../vendor/autoload.php' );

use AcMarche\Bottin\Block\BottinBlock;
use AcMarche\Bottin\BottinRest;

//register block
$block = new BottinBlock();
//register rest
$rest = new BottinRest();
