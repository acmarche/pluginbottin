import {registerBlockType} from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';
import ServerSideRender from '@wordpress/server-side-render';
import {Disabled} from '@wordpress/components';
import {PanelBody, ToggleControl} from '@wordpress/components';
import {InspectorControls, PlainText, RichText} from '@wordpress/block-editor';
import {withState} from '@wordpress/compose';

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
    },
    example: {
        attributes: {
            id: '12345',
        },
    },
    edit: function ({className, setAttributes, attributes}) {

        const bottinCompleter = {
            name: 'acbottin',
            triggerPrefix: '::',
            options(search) {
                if (search) {
                    return apiFetch({
                        path: 'acmarche/bottin/' + search
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
        function appendBottinCompleter(completers, blockName) {
            return blockName === 'acmarche-block/bottin' ?
                [...completers, bottinCompleter] :
                completers;
        }

        wp.hooks.addFilter(
            'editor.Autocomplete.completers',
            'acbottin/autocompleters/bottin',
            appendBottinCompleter
        );

        const {ShowFull} = attributes;

        const setPost = (newContent) => {
            setAttributes({id: newContent.toString()});
        };

        let blockContent = 'Indiquez le nom de la fiche';
        if (parseInt(attributes.id) > 0) {
            blockContent = <ServerSideRender
                block="acmarche-block/bottin"
                attributes={attributes}
            />;
        }

        const FullFicheToggleControl = withState({
            hasFixedBackground: ShowFull,
        })(({hasFixedBackground, setState}) => (
            <ToggleControl
                label="Afficher la fiche complète"
                help={hasFixedBackground ? 'Has fixed background.' : 'No fixed background.'}
                checked={hasFixedBackground}
                onChange={value => {
                    console.log(value);
                    setAttributes({ShowFull: value});
                    setState({hasFixedBackground: value})
                }}
            />
        ));

        return (<>
                <InspectorControls>
                    <PanelBody title={'Paramètres de la fiche'}>
                        <FullFicheToggleControl/>
                    </PanelBody>
                </InspectorControls>
                <RichText
                    tagName="p"
                    placeholder="Modifier"
                    onChange={(value) => {
                    }}
                    aria-autocomplete="list"
                />
                <Disabled>
                    {blockContent}
                </Disabled>
            </>
        )
    },
});
