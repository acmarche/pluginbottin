<?php

namespace AcMarche\Bottin;

use Symfony\Component\HttpClient\HttpClient;

class BottinFetchApi {
	/**
	 * @var \Symfony\Contracts\HttpClient\HttpClientInterface
	 */
	private $httpClient;

	public function __construct( string $user = null, string $password = null ) {
		$options = [];
		if ( $user && $password ) {
			$options['auth_basic'] = [ $user . ':' . $password ];
		}

		$this->httpClient = HttpClient::create( $options );
	}

	public function getFicheBottin( int $ficheID ) {
		$url = 'https://bottin.marche.be/api/fiches/' . $ficheID . '.json';

		return $this->getContent( $url );
	}

	private function getContent( string $url ) {
		$response = $this->httpClient->request( 'GET', $url );

		return \json_decode( $response->getContent() );
	}

	private function convertfiche( array $fiches ) {
		$datas = [];
		foreach ( $fiches as $data ) {
			$fiche   = $data->fiche;
			$datas[] = $fiche;
		}

		return $datas;
	}
}