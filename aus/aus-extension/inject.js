console.log('injected file.');
class Form {

    getElementByText = (tag, text) => {
        try {
            return document.evaluate('//' + tag + '[text()="' + text + '"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                .singleNodeValue;
        } catch (e) {
            return null;
        }
    }
    /**
     * Get attribute value
     * @param tag
     * @param text
     * @param tagAttribute
     * @returns {*}
     */
    getAttribute = (tag, text, tagAttribute = 'for') => {
        return this.getElementByText(tag, text)?.getAttribute(tagAttribute);
    }

    /**
     * Set date
     * @param label
     * @param date1 02 Oct 1999
     * @param data2 1999-10-02
     */
    setDate = (label, date1, data2) => {
        const dateOfBirth = this.getAttribute('label', label);
        $('#' + dateOfBirth)
            .val(date1);
        dateOfBirth && $('#' + dateOfBirth.replace('_input', ''))
            .attr('data-wc-value', data2)
    }

    /**
     * Set radio
     * @param span
     * @param value Yes: 1, No: 2
     */
    setRadio = (span, value) => {
        const element = $('[name=' + this.getAttribute('span', span,
            'data-wc-for') + '][value=' + value + ']');
        element.prop('checked', true);
        element.trigger( 'click');
        return element;
    }

    /**
     * Select option
     * @param span
     * @param value VN26
     */
    selectOption = (value) => {
        const element = $('option[value=' + value + ']');
        element.prop('selected', true);
        return element;
    }

    /**
     * Set input, select
     * @param label
     * @param value
     */
    setInput = (label, value) => {
        let element = $('#' + this.getAttribute('label', label));
        element.val(value);
        return element;
    }

    /**
     * Click Next
     */
    clickNext = () => {
        const button = $('button[title="Go to next page"]');
        button?.click();
        return button;
    }

    /**
     * Click Add
     */
    clickAdd = () => {
        const button = this.getElementByText('button', 'Add');
        button?.click();
        return button;
        // $('button[aria-label="Add an entry to the list"]')?.click();
    }

    /**
     * Click Confirm
     */
    clickConfirm = () => {
        const button = this.getElementByText('button', 'Confirm')
        button?.click();
        return button;
        // $('button[title="Save the current entry"]')?.click();
    }

    /**
     *
     * @param func
     * @returns {Promise<unknown>}
     */
    setPromise = (func, timeout = 1000) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(func);
            }, timeout);
        });
    }
}