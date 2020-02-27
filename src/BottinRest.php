<?php

namespace AcMarche\Bottin;

//add_action( 'rest_api_init', 'register_rest_route_bottin' );

class BottinRest {
	/**
	 * This is our callback function that embeds our phrase in a WP_REST_Response
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed|\WP_REST_Response
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
			                     // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
			                     'methods'  => \WP_REST_Server::READABLE,
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

}