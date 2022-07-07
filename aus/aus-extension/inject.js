console.log('injected file.');
const data = {
    passportDetails: {
        familyName: 'Leaa',
        givenName: 'Hong Qaauang',
        sex: 'F',
        dateOfBirth: '1996-06-19',
        passportNumber: 'K0000000E',
        countryOfPassport: 'VNM', //VNM
        countryOfBirth: 237,
        streetNumber: '24,57',
        streetName: 'An Hai Trieu',
        suburb: 'An Dong',
        city: 'Hue',
        provinceState: 'Thua Thien Hue',
        postalCode: 49128,
        country: 237,
        phoneNumber: '84 93 9190697',
        email: 'lgqgq@gmail.com',
        representedByAgent: 'No',
        communicationMethod: 1,
        hasCreditCard: 'Yes'
    },
    identification: {
        passportNumber: 'A2096457',
        passportExpiryDate: '4 May, 2030',
        otherIdentification: 3,
        otherIssueDate: '2 July, 2021',
        otherExpiryDate: '6 June, 2036'
    },
    health: {
        yes: 'Yes',
        no: 'No'
    },
    character: {
        yes: 'Yes',
        no: 'No'
    },
    whsSpecific: {
        previousWhsPermitVisa: 'No',
        sufficientFundsHoliday: 'Yes',
        intendedTravelDate: '1 October, 2022',
        beenToNz: 'No',
        sufficientFundsOnwardTicket: 'Yes',
        readRequirements: 'Yes'
    }
}
const {passportDetails, identification, health, character, whsSpecific} = data;


const getElementByText = (tag, text) => {
    return $(tag + ':contains("' + text + '")').filter(function () {
        return $(this).text().trim() === text.trim();
    })
}

try {
    const familyName = getElementByText('label', 'Family name').attr('for');
    const givenName = getElementByText('label', 'Given names').attr('for');
    const sex = getElementByText('span', 'Sex').attr('data-wc-for');
    const dateOfBirth = getElementByText('label', 'Date of birth').attr('for');
    const dateOfBirth_ = dateOfBirth.replace('_input', '');
    const passportNumber = getElementByText('label', 'Passport number').attr('for');
    const countryOfPassport = getElementByText('label', 'Country of passport').attr('for');
    const countryOfPassport_ = countryOfPassport.replace('_input', '');
    const nationalityOfPassport = getElementByText('label', 'Nationality of passport holder').attr('for');
} catch (e) {
}

$('input#' + familyName).val(passportDetails.familyName);
$('input#' + givenName).val(passportDetails.givenName);
$('input[name="' + sex + '"][value=' + passportDetails.sex + ']').prop("checked", true);
$('input#' + dateOfBirth).val(passportDetails.dateOfBirth);
$('input#' + dateOfBirth_).attr('data-wc-value', passportDetails.dateOfBirth);
$('input#' + passportNumber).val(passportDetails.passportNumber);
$('select#' + countryOfPassport).val(passportDetails.countryOfPassport);
$('select#' + countryOfPassport_).val(passportDetails.countryOfPassport);
$('select#' + nationalityOfPassport).val(passportDetails.countryOfPassport);

