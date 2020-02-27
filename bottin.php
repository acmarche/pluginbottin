<?php

use AcMarche\Bottin\BottinRender;

require_once( __DIR__ . '/../../../vendor/autoload.php' );

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
		                     'attributes'      => [
			                     'ShowFull' => [
				                     'type'    => 'boolean',
				                     'default' => true,
			                     ],
			                     'idBottin' => [
				                     'default' => '0',
				                     'type'    => 'string',
			                     ],
		                     ],
		                     'render_callback' => 'bottin_render_callback'
	                     ]
	);
}

function bottin_render_callback( $attributes ) {

	$id = $attributes['idBottin'];
	if ( ! $id ) {
		return 'Indiquer dans les paramètres du bloc le id';
	}

	$render        = new BottinRender();
	$block_content = $render->renderFiche( 520 );

	return $block_content;
}

// Hook: Block assets.
add_action( 'init', 'bottin_block_assets' );
/**
 * This is our callback function that embeds our phrase in a WP_REST_Response
 *
 * @param WP_REST_Request $request
 *
 * @return mixed|WP_REST_Response
 */
function rest_bottin_route( $request ) {
	//$fetcher = new \AcElasticsearch\AcElasticFetchContent();
	//$fetcher->getFicheBottin();
	//var_dump($request->get_params());
	$search = null;
	if ( isset( $request['search'] ) ) {
		$search = $request['search'];
	}
	$data = [ 0 => [ 'id' => 4, 'slug' => 'hello' . $search ], 1 => [ 'id' => 5, 'slug' => 'bonjour' ] ];

	return rest_ensure_response( $data );
}

/**
 * This function is where we register our routes for our example endpoint.
 */
function register_rest_route_bottin() {
	// register_rest_route() handles more arguments but we are going to stick to the basics for now.
	register_rest_route( 'hello-world/v1',
	                     '/phrase/(?P<search>.*+)',
	                     array(
		                     'methods'  => WP_REST_Server::READABLE,
		                     'args'     => array(
			                     'search' => array(
				                     'validate_callback' => function ( $param, $request, $key ) {
					                     return is_string( $param );
				                     }
			                     ),
		                     ),
		                     // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
		                     'callback' => 'rest_bottin_route',
	                     ) );
}

add_action( 'rest_api_init', 'register_rest_route_bottin' );