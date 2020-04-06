<?php

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class BottinTwig {

	public static function instance() {
		$path_template = plugin_dir_path( __FILE__ ) . 'templates';
		$loader        = new FilesystemLoader( $path_template );

		return new Environment( $loader );
	}

	public function renderFiche(array $fiche) {
		$twig = self::instance();
        $template = 'fiche.html.twig';
		echo $twig->render($template, $fiche);
	}
}
