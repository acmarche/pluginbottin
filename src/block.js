import {registerBlockType} from '@wordpress/blocks';
import {__} from '@wordpress/i18n';
import {PanelBody, ToggleControl, Autocomplete} from '@wordpress/components';
import {InspectorControls, PlainText, RichText} from '@wordpress/block-editor';
import {Component, renderToString} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

//https://developer.wordpress.org/block-editor/developers/block-api/block-registration/
registerBlockType('acmarche-block/bottin', {
    title: 'Bottin 22',
    description: 'Insérer une fiche ou une rubrique du bottin',
    placeholder: 'Indiquer id',
    icon: 'store',
    category: 'widgets',
    supports: {
        align: true,
        html: false,
    }, example: {
        attributes: {
            cover: 'https://www.marche.be/logo/marche.jpg',
            author: 'William Shakespeare',
            pages: 500
        },
    },
    attributes: {
        idBottin: {
            default: null,
            type: 'string',
            id: 'loulou'
            //  source: 'meta',
            //   meta: 'myguten_meta_block_field',
        },
    },

    edit: function (props) {

        const acronymCompleter = {
            name: 'acronyms',
            triggerPrefix: '::',
            options(search) {
                var data = apiFetch({path: '/wp/v2/posts'});
                console.log(data);
                var data = apiFetch({path: 'hello-world/v1/phrase'});
                console.log(data);
                return data;
            },
            isDebounced: true,
            getOptionLabel(post) {
                return <span>{post.slug} <small>{post.id}</small></span>;
            },
            getOptionKeywords: post => [post.slug, post.id],
            getOptionCompletion(post) {
                return {
                    action: 'replace',
                    value: setPost(post.id),
                };
            },
        };

        // Our filter function
        function appendAcronymCompleter(completers, blockName) {
            return blockName === 'acmarche-block/bottin' ?
                [...completers, acronymCompleter] :
                completers;
        }

        wp.hooks.addFilter(
            'editor.Autocomplete.completers',
            'my-plugin/autocompleters/acronym',
            appendAcronymCompleter
        );

        const setPost = (newContent) => {
            console.log(newContent);
            props.setAttributes({idBottin: newContent});
        };

        return <RichText
            tagName="p"
            onChange={(nextContent) => {

            }}
            placeholder="add text"
            aria-autocomplete="list"

        />;
    },

    // No information saved to the block
    // Data is saved to post meta via attributes
    //render call back prend le dessus
    save() {
        return null;
    }
});
