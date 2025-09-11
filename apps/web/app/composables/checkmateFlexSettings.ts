
/**
 * Composable that provides utility functions to configure and manage 
 * the styling of page components like flex blocks. It allows for dynamic 
 * setting of background color, text color, margin, padding, and 
 * container width based on the provided settings object.
 * 
 * @param settings - An object containing various styling options 
 *                   such as background color, text color, custom 
 *                   margins, custom paddings, and container settings.
 * 
 * The composable returns computed properties for background color, 
 * text color, margin classes, padding classes, and container width 
 * classes, as well as a method to retrieve specific container classes 
 * based on the requested class types.
 */
export const useCheckmateFlexSettings = (settings: any) => {

    const containerBackgroundColorClass  = computed (() => {

        if (!settings.value.hasOwnProperty('backgroundColor')) {
            return [];
        }

        switch (settings.value.backgroundColor) {
            default:
            case 'none': //TODO: Change for each project
                return ['bg-inherit'];
            case 'light':
                return ['bg-white'];
            case 'dark':
                return ['bg-black'];
            case 'primary':
                return ['bg-primary'];
            case 'secondary':
                return ['bg-secondary'];
        }

    });

    const containerTextColorClass  = computed (() => {
        if (!settings.value.hasOwnProperty('textColor')) {
            return [];
        }

        switch (settings.value.textColor) {
            default:
            case 'default': //TODO: Change for each project
                return ['text-inherit'];
            case 'light':
                return ['text-white'];
            case 'dark':
                return ['text-black'];
            case 'primary':
                return ['text-primary'];
            case 'secondary':
                return ['text-secondary'];
        }

    });

    /**
     * Get container margin classes based on the custom margin options 
     * provided in the settings object. Returns an array of margin 
     * classes that can be applied to the container.
     */
    const containerMarginClasses  = computed (() => {
        if (!settings.value.hasOwnProperty('customMargin')) {
            return [];
        }

        let classes = [];

        // Margin top.
        if (settings.value.customMargin.marginTop) {
            classes.push('cm-mt-' + settings.value.customMargin.marginTop);
        }

        // Margin right.
        if (settings.value.customMargin.marginRight) {
            classes.push('cm-mr-' + settings.value.customMargin.marginRight);
        }

        // Margin bottom.
        if (settings.value.customMargin.marginBottom) {
            classes.push('cm-mb-' + settings.value.customMargin.marginBottom);
        }

        // Margin left.
        if (settings.value.customMargin.marginLeft) {
            classes.push('cm-ml-' + settings.value.customMargin.marginLeft);
        }

        return classes;

    });

    /**
     * Get container padding classes based on the custom padding options 
     * provided in the settings object. Returns an array of padding 
     * classes that can be applied to the container.
     */
    const containerPaddingClasses  = computed (() => {
        if (!settings.value.hasOwnProperty('customPadding')) {
            return [];
        }

        let classes = [];

        // Padding top
        if (settings.value.customPadding.paddingTop) {
            classes.push('cm-pt-' + settings.value.customPadding.paddingTop);
        }
        // Padding right
        if (settings.value.customPadding.paddingRight) {
            classes.push('cm-pr-' + settings.value.customPadding.paddingRight);
        }
        // Padding bottom
                if (settings.value.customPadding.paddingBottom) {
            classes.push('cm-pb-' + settings.value.customPadding.paddingBottom);
        }
        // Padding left
        if (settings.value.customPadding.paddingLeft) {
            classes.push('cm-pl-' + settings.value.customPadding.paddingLeft);
        }

        return classes;

    });

    const containerWidthClass  = computed (() => {
        if (!settings.value.hasOwnProperty('container')) {
            return [];
        }

        if(settings.value.container !== 'contained') {
            return [];
        }

        return ['cm-contained'];
    });

    /**
     * Get specific container classes based on the requested class types. 
     * This function allows for flexible retrieval of classes for width, 
     * padding, background, text, and margin based on the provided class 
     * types.
     * 
     * @param classTypes - An array of class types to retrieve. If no 
     *                     class types are provided, all classes will 
     *                     be returned.
     */
    const getContainerClasses = ( ...classTypes: string[] ) => {
        let classes = [];

        // Get container width classes.
        if (classTypes.length === 0 || classTypes.some( item =>  ['width', 'containerWidthClass'].includes(item))) {
            classes.push(... containerWidthClass.value);
        }
        // Get padding classes.
        if (classTypes.length === 0 || classTypes.some(item =>  ['padding', 'containerPaddingClasses'].includes(item))) {
            classes.push(... containerPaddingClasses.value);
        }
        // Get background classes.
        if (classTypes.length === 0 || classTypes.some(item =>  ['background', 'containerBackgroundColorClass'].includes(item))) {
            classes.push(... containerBackgroundColorClass.value);
        }
        // Get text classes.
        if (classTypes.length === 0 || classTypes.some(item =>  ['text', 'containerTextColorClass'].includes(item))) {
            classes.push(... containerTextColorClass.value);
        }
        // Get margin classes.
        if (classTypes.length === 0 || classTypes.some(item =>  ['margin', 'containerMarginClasses'].includes(item))) {
            classes.push(... containerMarginClasses.value);
        }

        return classes;
    }

    return {
        getContainerClasses,
        containerTextColorClass,
        containerPaddingClasses,
        containerMarginClasses,
        containerWidthClass,
        containerBackgroundColorClass
    }
}
