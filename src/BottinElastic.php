<?php

namespace AcMarche\Bottin;

use Elasticsearch\ClientBuilder;

class BottinElastic {

	/**
	 * @var \Elasticsearch\Client
	 */
	private $client;

	/**
	 * @var string
	 */
	protected $indexName;
	/**
	 * @var array
	 */
	protected $params;

	/**
	 * AcElasticServerManager constructor.
	 *
	 * @param string $indexName
	 *
	 * @throws \Exception
	 */
	public function __construct( string $indexName ) {
		$hosts = [
			$_SERVER['ELASTIC_USER'].':'.$_SERVER['ELASTIC_PASSWORD'].'@'.$_SERVER['ELASTIC_HOST']
		];

		$this->client = ClientBuilder::create()
		                             ->setHosts( $hosts )
		                             ->build();

		$this->indexName = $indexName;

		$this->params = [
			'index' => $this->indexName,
		];
	}

	/**
	 * @param string $motclef
	 *
	 * @return array
	 */
	public function search( string $motclef, int $max = 50 ) {

		if ( ! $motclef ) {
			return [];
		}

		$query = $this->createQuery( $motclef );

		$params = [
			'index' => $this->indexName,
			'type'  => '_doc',
			'body'  => [
				'query' =>
					$query,
				'size'  => $max,
			],
		];
		
		return $this->client->search( $params );
	}

	protected function createQuery( string $motclef ) {
		$query = [
			"multi_match" => [
				"query"  => $motclef,
				"fields" => [
					'post_title',
					'name',
					'content',
					'description',
					'post_title.stemmed',//trouve pluriels
					'post_content',
					'post_content.stemmed',//trouve pluriels
					'post_excerpt',
					'post_excerpt.stemmed',//trouve pluriels
					'categories.cat_name',
					'categories.cat_description',
				],
			],
		];

		return $query;
	}


}