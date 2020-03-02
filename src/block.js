import {registerBlockType} from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';
import ServerSideRender from '@wordpress/server-side-render';
import {Disabled} from '@wordpress/components';
import {PanelBody, ToggleControl} from '@wordpress/components';
import {InspectorControls, PlainText, RichText} from '@wordpress/block-editor';
import {withState} from '@wordpress/compose';
import {addFilter} from '@wordpress/hooks';

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
            getOptionLabel(fiche) {
                return <span>{fiche.slug} <small>{fiche.id}</small></span>;
            },
            // Declares that options should be matched by their name
            getOptionKeywords: fiche => [fiche.slug, fiche.id],
            // completions should be removed, but then spawn setPost
            getOptionCompletion(fiche) {
                return {
                    action: 'replace',
                    value: updateAttributesId(fiche.id),
                };
            },
        };

        // Our filter function
        function appendBottinCompleter(completers, blockName) {
            return blockName === 'acmarche-block/bottin' ?
                [...completers, bottinCompleter] :
                completers;
        }

        addFilter(
            'editor.Autocomplete.completers',
            'acbottin/autocompleters-bottin',
            appendBottinCompleter
        );

        const {ShowFull} = attributes;

        const updateAttributesId = (newContent) => {
            const blockSelected = wp.data.select('core/block-editor').getSelectedBlock();
            console.log(blockSelected);
            // blockSelected.attributes.id = newContent.toString(); //not refresh block
            setAttributes({id: newContent.toString()});//refresh block, bug with several times the same block
        };

        let blockContent = 'Indiquez le nom de la fiche';
        console.log('ici');
        if (parseInt(attributes.id) > 0) {
            blockContent = <ServerSideRender
                block="acmarche-block/bottin"
                attributes={attributes}
            />;
        }

        const FullFicheToggleControl = withState({
            isFullDisplay: ShowFull,
        })(({isFullDisplay, setState}) => (
            <ToggleControl
                label="Afficher la fiche complète"
                help={isFullDisplay ? 'Has fixed background.' : 'No fixed background.'}
                checked={isFullDisplay}
                onChange={value => {
                    console.log(value);
                    setAttributes({showFull: value});
                    setState({isFullDisplay: value});
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
                    withoutInteractiveFormatting
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