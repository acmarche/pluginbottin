<?php

namespace AcMarche\Bottin;


class BottinRest {

	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );
	}

	public function registerRoutes() {
		register_rest_route( 'acmarche/',
		                     '/bottin/(?P<search>.*+)',
		                     array(
			                     'methods'  => \WP_REST_Server::READABLE,
			                     'args'     => array(
				                     'search' => array(
					                     'validate_callback' => function ( $param, $request, $key ) {
						                     return is_string( $param );
					                     }
				                     ),
			                     ),
			                     // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
			                     'callback' => [ 'AcMarche\Bottin\BottinRest', 'restResponse' ],
		                     ) );
	}

	/**
	 * This is our callback function that embeds our phrase in a WP_REST_Response
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed|\WP_REST_Response
	 * @throws \Exception
	 */
	function restResponse( $request ) {
		$search = null;
		if ( isset( $request['search'] ) ) {
			$search = $request['search'];
		}

		$elastic = new BottinElastic( 'marchebe' );
		$result  = $elastic->search( $search );
		$hits    = $result['hits'];
		$total   = $hits['total'];
		$data    = [];
		$i       = 0;
		foreach ( $hits['hits'] as $hit ) {
			$post               = $hit['_source'];
			$data[ $i ]['slug'] = $post['name'];
			//$data[ $i ]['localite'] = $post['localite'];
			$data[ $i ]['id'] = $post['id'];
			$i ++;
		}

		return rest_ensure_response( $data );
	}
}