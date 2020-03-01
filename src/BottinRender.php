<?php

namespace AcMarche\Bottin;

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class BottinRender {

	public static function instance(): Environment {
		$path_template = plugin_dir_path( __FILE__ ) . '../templates';
		$loader        = new FilesystemLoader( $path_template );

		return new Environment( $loader );
	}

	public function renderFiche( int $idFiche, bool $showFull ): string {
		$twig     = self::instance();
		$template = 'fiche.html.twig';

		$fetch = new BottinFetchApi( $_SERVER['API_USER'], $_SERVER['API_USER'] );
		$fiche = $fetch->getFicheBottin( $idFiche );
		if ( ! $fiche ) {
			$template = 'fiche_404.html.twig';
		}

		return $twig->render( $template, [ 'fiche' => $fiche, 'showFull' => $showFull ] );
	}

}