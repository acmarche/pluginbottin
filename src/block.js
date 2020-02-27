import {registerBlockType} from '@wordpress/blocks';
import {__} from '@wordpress/i18n';
import {PanelBody, ToggleControl, Autocomplete} from '@wordpress/components';
import {InspectorControls, PlainText, RichText} from '@wordpress/block-editor';
import {Component, renderToString} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import ServerSideRender from '@wordpress/server-side-render';

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

    edit: function ({className, setAttributes, attributes}) {

        const acronymCompleter = {
            name: 'acronyms',
            triggerPrefix: '::',
            options(search) {
                if (search) {
                    console.log("s: " + search);
                    var data = apiFetch({
                        path: 'hello-world/v1/phrase/' + search
                    });
                    console.log(data);
                    return data;
                }
                return [];
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
            setAttributes({idBottin: newContent});
        };

        var blockContent = '';
        console.log(attributes);
        if (parseInt(attributes.idBottin) > 0) {
            blockContent = <ServerSideRender
                block="acmarche-block/bottin"
                attributes={attributes}
            />;
        }

        return <> <RichText
            tagName="p"
            onChange={(nextContent) => {

            }}
            placeholder="add text"
            aria-autocomplete="list"
        />
            <ServerSideRender
                block="acmarche-block/bottin"
                attributes={attributes}
            />
        </>
    },
});
