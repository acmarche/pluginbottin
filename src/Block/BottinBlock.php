<?php

namespace AcMarche\Bottin\Block;

class BottinBlock {

	public function __construct() {
		add_action( 'init', [ $this, 'registerBlock' ] );
	}

	function registerBlock() {
		$asset_file = include( plugin_dir_path( __DIR__ ) . '../build/block.asset.php' );

		// Register block styles for both frontend + backend.
		wp_register_style(
			'bottin-block-style-css', // Handle.
			plugins_url( '/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
			array( 'wp-editor' ), // Dependency to include the CSS after it.
			filemtime( plugin_dir_path( __DIR__ ) . '/blocks.style.build.css' ) // Version: File modification time.
		);

		// Register block editor script for backend.
		wp_register_script(
			'bottin-autocompleter',
			// Handle.
			plugins_url( '../build/block.js', dirname( __FILE__ ) ),
			// Block.build.js: We register the block here. Built with Webpack.
			$asset_file['dependencies'],
			$asset_file['version'],
			true // Enqueue the script in the footer.
		);

		wp_enqueue_style( 'bottin-block-style-css' );
		wp_enqueue_script( 'bottin-autocompleter' );

		register_block_type( 'acmarche-block/bottin',
		                     [
			                     'attributes'      => [
				                     'showFull' => [
					                     'type'    => 'boolean',
					                     'default' => false,
				                     ],
				                     'id'       => [
					                     'type' => 'string',
				                     ],
			                     ],
			                     'render_callback' => [ 'AcMarche\Bottin\BottinBlock', 'renderBlock' ]
		                     ]
		);
	}

	function renderBlock( $attributes ) {
		$id       = (int) $attributes['id'];
		$showFull = (bool) $attributes['showFull'];
		if ( ! $id ) {
			return '';
		}

		$render        = new BottinRender();
		$block_content = $render->renderFiche( $id, $showFull );//return html

		return $block_content;
	}

}