import {registerBlockType} from '@wordpress/blocks';
import {RichText} from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import ServerSideRender from '@wordpress/server-side-render';
import {Button, Disabled, TextControl} from '@wordpress/components';

//https://developer.wordpress.org/block-editor/developers/block-api/block-registration/
registerBlockType('acmarche-block/bottin', {
    title: 'Bottin',
    description: 'Insérer une fiche ou une rubrique du bottin',
    placeholder: 'Indiquer id',
    icon: 'store',
    category: 'widgets',
    supports: {
        align: true,
        html: false,
    }, example: {
        attributes: {
            id: '12345',
        },
    },
    edit: function ({className, setAttributes, attributes}) {

        const acronymCompleter = {
            name: 'acronyms',
            triggerPrefix: '::',
            options(search) {
                if (search) {
                    return apiFetch({
                        path: 'hello-world/v1/phrase/' + search
                    });
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
            setAttributes({id: newContent.toString()});
        };

        let blockContent = null;
        if (parseInt(attributes.id) > 0) {
            blockContent = <ServerSideRender
                block="acmarche-block/bottin"
                attributes={attributes}
            />;
        }

        return (<>
                <RichText
                    tagName="p"
                    onChange={(nextContent) => {

                    }}
                    placeholder="Modifier"
                    aria-autocomplete="list"
                />
                <Disabled>
                    {blockContent}
                </Disabled>

            </>
        )
    },
});
