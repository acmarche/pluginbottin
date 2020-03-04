import apiFetch from '@wordpress/api-fetch';
import ServerSideRender from '@wordpress/server-side-render';
import {Disabled} from '@wordpress/components';
import {PanelBody, ToggleControl} from '@wordpress/components';
import {InspectorControls, PlainText, RichText} from '@wordpress/block-editor';
import {withState} from '@wordpress/compose';
import {addFilter} from '@wordpress/hooks';
import {Component} from '@wordpress/element';

class BottinBlock extends Component {

    constructor(props) {
        super(props);
        this.setAttributes = props.setAttributes;
        this.isSelected = props.isSelected;
        this.className = props.className;
        this.attributes = props.attributes;
        this.ShowFull = props.attributes;

        addFilter(
            'editor.Autocomplete.completers',
            'acbottin/autocompleters-bottin',
            this.appendBottinCompleter
        );

        this.setContent();
    }

    appendBottinCompleter(completers, blockName, updateAttribute) {

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
                console.log(completers);
                console.log(blockName);
                console.log(updateAttribute);
                return {
                    action: 'replace',
                    value: updateAttribute(fiche.id),
                };
            },
        };

        return blockName === 'acmarche-block/bottin' ?
            [...completers, bottinCompleter] :
            completers;
    }

    updateAttribute(id) {
        const updateAttributesId = (newContent) => {
            const blockSelected = wp.data.select('core/block-editor').getSelectedBlock();
            console.log(blockSelected);
            blockSelected.attributes.id = newContent.toString(); //not refresh block
            setAttributes({id: newContent.toString()});//refresh block, bug with several times the same block
        };
    }

    setContent() {
        let blockContent = 'Indiquez le nom de la fiche';
        if (parseInt(this.attributes.id) > 0) {
            blockContent = <ServerSideRender
                block="acmarche-block/bottin"
                attributes={this.attributes}
            />;
        }
        return blockContent;
    }

    getToggle() {

        const FullFicheToggleControl = withState({
            isFullDisplay: this.ShowFull,
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

        return FullFicheToggleControl;
    }

    render() {
        return [
            <div key="editable">
                <InspectorControls>
                    <PanelBody title={'Paramètres de la fiche'}>
                        {this.getToggle()}
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
                    {this.setContent()}
                </Disabled>
            </div>
        ]
    }
}

export default BottinBlock;