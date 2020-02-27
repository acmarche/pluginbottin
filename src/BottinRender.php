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

	public function renderFiche( int $idFiche ) : string {
		$twig     = self::instance();
		$template = 'fiche.html.twig';


		$fiche = $fetch->getFicheBottin( $idFiche );

		return $twig->render( $template, [ 'fiche' => $fiche ] );
	}

}