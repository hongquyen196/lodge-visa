console.log('injected file.');
const data = {
    page2: {
        proposedArrivalDate1: '04 Oct 2020',
        proposedArrivalDate2: '2020-10-04'
    },
    page3: {
        familyName: 'Son',
        givenName: 'Smith',
        sex: 'M',
        dateOfBirth1: '04 Oct 1999',
        dateOfBirth2: '1999-10-04',
        passportNumber: 'K0000000E',
        countryOfPassport: 'SGP', //VNM
        dateOfIssue1: '02 Sep 2017',
        dateOfIssue2: '2017-09-02',
        dateOfExpiry1: '01 Sep 2027',
        dateOfExpiry2: '2027-09-01',
        placeOfIssue: 'North York',
        city: 'Toronto',
        province: 'Ontario',
        countryOfBirth: 'SGP',
    },
    page6: {
        countryOfResidence: 'VIET', //VIET
        office: 'Cambodia, Phnom Penh', //Vietnam, Ho Chi Minh City
        country: 'VIET', //VIET
        address: '25/70 HAI TRAN, AN LONG, TT HUE',
        stateOrProvince: 'VN26', //VN26'
        postalCode: '59000',
        phoneNumber: '74939160359'
    },
    page9: {
        qualification: 19, //18
        courseName: 'Information Technology',
        institutionName: 'University of Sciences, Hue University',
        countryOfInstitution: 'VIET',
        dateFrom1: '05 Sep 2014',
        dateFrom2: '2014-09-05',
        dateTo1: '12 Jun 2018',
        dateTo2: '2018-06-12',
        status: 4
    },
    page10: {
        usualOccupation: 'Software Engineer',
        industryType: 'M'
    },
    page11: {
        mainLanguage: '6302A'
    }
}

const {
    page2,
    page3,
    page6,
    page9,
    page10,
    page11
} = data;

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
     * @param tag attribute
     * @returns {*}
     */
    getAttribute = (tag, text, tagAttribute = 'for') => {
        const attributeValue = this.getElementByText(tag, text)?.getAttribute(tagAttribute);
        // console.info(text, attributeValue);
        return attributeValue;
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

new Promise(function (resolve) {
    setTimeout(() => {
        const form = new Form();
        //Page 2
        // form.setInput('Current location', 'SING');
        // form.setInput('Legal status', '1');
        // form.setRadio('Will the applicant be accompanied by dependent children at any time during their stay in Australia on this visa?', 2)
        // form.setRadio('Has the applicant been granted and entered Australia on a Working Holiday visa (subclass 417) before?', 2);
        // form.setRadio('Was the last Work and Holiday visa held by the applicant a COVID-19 affected visa?', 2);
        // form.setRadio('Select the type of work and holiday visa the applicant is applying for:', 4);
        // form.setRadio('Has the applicant been granted and entered Australia on a first Work and Holiday visa (subclass 462) before?', 2);
        // form.setDate('Proposed arrival date', page2.proposedArrivalDate1, page2.proposedArrivalDate2);
        // form.setRadio('Does the applicant have a letter of government support to attach to this visa application?', 2);
        //Page 3
        // form.setInput('Family name', page3.familyName);
        // form.setInput('Given names', page3.givenName);
        // form.setRadio('Sex', page3.sex);
        // form.setDate('Date of birth', page3.dateOfBirth1, page3.dateOfBirth2);
        // form.setInput('Passport number', page3.passportNumber);
        // form.setInput('Country of passport', page3.countryOfPassport);
        // form.setInput('Nationality of passport holder', page3.countryOfPassport);
        // form.setDate('Date of issue', page3.dateOfIssue1, page3.dateOfIssue2);
        // form.setDate('Date of expiry', page3.dateOfExpiry1, page3.dateOfExpiry2);
        // form.setInput('Place of issue / issuing authority', page3.placeOfIssue);
        // form.setRadio('Does this applicant have a national identity card?', 2);
        // form.setInput('Town / City', page3.city);
        // form.setInput('State / Province', page3.province);
        // form.setInput('Country of birth', page3.countryOfBirth);
        // form.setInput('Relationship status', 'N');
        // form.setRadio('Is this applicant currently, or have they ever been known by any other names?', 2)
        //Page 5
        if (form.getElementByText('span', '5/16')) {
            form.setRadio('Has this applicant previously travelled to Australia or previously applied for a visa?', 2);
            form.clickNext();
        }
        //Page 6
        if (form.getElementByText('span', '6/16')) {
            form.setInput('Usual country of residence', page6.countryOfResidence);
            form.setInput('Office', 'Cambodia, Phnom Penh');
            form.setInput('Address', page6.address);
            form.setInput('Postal code', page6.postalCode);
            form.setRadio('Is the postal address the same as the residential address?', 1);
            form.setInput('Mobile / Cell phone', page6.phoneNumber);
            form.setPromise(form.setInput('Country', page6.country))
                .then(() => {
                    form.selectOption(page6.stateOrProvince)
                    form.clickNext();
                });
        }
        //Page 7
        if (form.getElementByText('span', '7/16')) {
            form.setRadio('Does the applicant authorise another person to receive written correspondence on their behalf?', 'NO');
            form.clickNext();
        }
        //Page 9
        if (form.getElementByText('span', '9/16')) {
            form.setPromise(form.setRadio('Does the applicant meet the education requirements for this visa?', 1))
                .then(() => {
                    if (!form.getElementByText('td', page9.courseName)) {
                        form.clickAdd();
                        form.selectOption(page9.qualification);
                        form.setInput('Course name', page9.courseName);
                        form.setInput('Institution name', page9.institutionName);
                        form.selectOption('VIET');
                        form.setDate('Date from', page9.dateFrom1, page9.dateFrom2);
                        form.setDate('Date to', page9.dateTo1, page9.dateTo2);
                        form.setInput('Status', page9.status);
                        form.clickConfirm();
                    } else {
                        form.clickNext();
                    }
                });
        }
        //Page 10
        if (form.getElementByText('span', '10/16')) {
            form.setInput('Usual occupation', page10.usualOccupation);
            form.selectOption(page10.industryType);
            form.clickNext();
        }
        //Page 11
        if (form.getElementByText('span', '11/16')) {
            form.setPromise(form.setRadio('Does the applicant hold a current passport from the USA, UK, Canada, New Zealand, or the republic of Ireland?', 2))
                .then(() => {

                    form.selectOption(page11.mainLanguage);
                });
            // form.clickNext();
        }
        this.form = form;
        resolve('done');
    }, 2000);
}).then((response) => {
    console.log(response);
    // response.clickNext();
});


