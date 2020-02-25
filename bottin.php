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

// Your code starts here.
function bottin_block_assets() {
	$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/block.asset.php' );

	// phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'bottin-block-style-css', // Handle.
		plugins_url( 'bottin/src/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ), // Dependency to include the CSS after it.
		filemtime( plugin_dir_path( __DIR__ ) . 'bottin/src/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'bottin-autocompler',
		// Handle.
		plugins_url( 'bottin/build/block.js', dirname( __FILE__ ) ),
		// Block.build.js: We register the block here. Built with Webpack.
		$asset_file['dependencies'],
		$asset_file['version'],
		true // Enqueue the script in the footer.
	);

	wp_enqueue_style( 'bottin-block-style-css' );
	wp_enqueue_script( 'bottin-autocompler' );

	register_block_type( 'acmarche-block/bottin',
	                     [
		                     'attributes' => [
			                     'ShowFull' => [
				                     'type'    => 'boolean',
				                     'default' => true,
			                     ],
			                     'idBottin' => [
				                     'default' => '0',
				                     'type'    => 'string',
			                     ],
		                     ],
	                     ]
	);
}

// Hook: Block assets.
add_action( 'init', 'bottin_block_assets' );

add_action( 'wp_ajax_my_action', 'my_action' );

function my_action() {
	global $wpdb; // this is how you get access to the database

	$whatever = intval( $_POST['whatever'] );

	$whatever += 10;

	echo $whatever;

	wp_die(); // this is required to terminate immediately and return a proper response
}