import {registerBlockType} from '@wordpress/blocks';
//import edit from './edit';
import editComponent from './editComponent';

registerBlockType('acmarche-block/bottin', {
    title: 'Bottin',
    description: 'Insérer une fiche ou une rubrique du bottin',
    placeholder: 'Indiquer id',
    icon: 'store',
    category: 'widgets',
    supports: {
        align: true,
        html: false,
    },
    example: {
        attributes: {
            id: '12345',
        },
    },
    edit: editComponent
});