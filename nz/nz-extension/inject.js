console.log('injected file.');

const data = {
    countryId: 188, //237,
    personalDetails: {
        familyName: 'Le',
        givenName: 'Hong Quang',
        preferredTitle: 1,
        gender: 'M',
        dateOfBirth: '6 June, 1996',
        countryOfBirth: 188, //237,
        streetNumber: '24,57',
        streetName: 'An Hai Trieu',
        suburb: 'An Dong',
        city: 'Hue',
        provinceState: 'Thua Thien Hue',
        postalCode: 49000,
        country: 188, //237,
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
        intendedTravelDate: '2 October, 2022',
        beenToNz: 'No',
        sufficientFundsOnwardTicket: 'Yes',
        readRequirements: 'Yes'
    }
}
const {personalDetails, identification, health, character, whsSpecific} = data;

//window.scrollTo(0, document.body.scrollHeight);

//Click Apply Now
if (window.location.href.includes('Application/Create.aspx?CountryId=' + data.countryId)) {
    const applyNowButton = $('#ContentPlaceHolder1_applyNowButton');
    if (applyNowButton.length) {
        applyNowButton.click();
    } else {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

//Fill personalDetails
$('#ContentPlaceHolder1_personDetails_familyNameTextBox').val(personalDetails.familyName);
$('#ContentPlaceHolder1_personDetails_givenName1Textbox').val(personalDetails.givenName);
$('#ContentPlaceHolder1_personDetails_titleDropDownList').val(personalDetails.preferredTitle).trigger('change');
$('#ContentPlaceHolder1_personDetails_genderDropDownList').val(personalDetails.gender).trigger('change');
$('#ContentPlaceHolder1_personDetails_dateOfBirthDatePicker_DatePicker').val(personalDetails.dateOfBirth).trigger('change');
$('#ContentPlaceHolder1_personDetails_CountryDropDownList').val(personalDetails.countryOfBirth).trigger('change');

$('#ContentPlaceHolder1_addressContactDetails_address_streetNumberTextbox').val(personalDetails.streetNumber);
$('#ContentPlaceHolder1_addressContactDetails_address_address1TextBox').val(personalDetails.streetName);
$('#ContentPlaceHolder1_addressContactDetails_address_suburbTextBox').val(personalDetails.suburb);
$('#ContentPlaceHolder1_addressContactDetails_address_cityTextBox').val(personalDetails.city);
$('#ContentPlaceHolder1_addressContactDetails_address_provinceStateTextBox').val(personalDetails.provinceState);
$('#ContentPlaceHolder1_addressContactDetails_address_postalCodeTextBox').val(personalDetails.postalCode);
$('#ContentPlaceHolder1_addressContactDetails_address_countryDropDownList').val(personalDetails.country).trigger('change');

$('#ContentPlaceHolder1_addressContactDetails_contactDetails_phoneNumberTextBox').val(personalDetails.phoneNumber);
$('#ContentPlaceHolder1_addressContactDetails_contactDetails_phoneNumberMobileTextBox').val(personalDetails.phoneNumber);
$('#ContentPlaceHolder1_addressContactDetails_contactDetails_emailAddressTextBox').val(personalDetails.email);
$('#ContentPlaceHolder1_hasAgent_representedByAgentDropdownlist').val(personalDetails.representedByAgent).trigger('change');
$('#ContentPlaceHolder1_communicationMethod_communicationMethodDropDownList').val(personalDetails.communicationMethod).trigger('change');
$('#ContentPlaceHolder1_hasCreditCard_hasCreditCardDropDownlist').val(personalDetails.hasCreditCard).trigger('change');

//Fill identification
$('#ContentPlaceHolder1_identification_passportNumberTextBox').val(identification.passportNumber);
$('#ContentPlaceHolder1_identification_confirmPassportNumberTextBox').val(identification.passportNumber);
$('#ContentPlaceHolder1_identification_passportExpiryDateDatePicker_DatePicker').val(identification.passportExpiryDate).trigger('change');

$('#ContentPlaceHolder1_identification_otherIdentificationDropdownlist').val(identification.otherIdentification).trigger('change');
$('#ContentPlaceHolder1_identification_otherIssueDateDatePicker_DatePicker').val(identification.otherIssueDate).trigger('change');
$('#ContentPlaceHolder1_identification_otherExpiryDateDatePicker_DatePicker').val(identification.otherExpiryDate).trigger('change');

//Fill health
$('#ContentPlaceHolder1_medicalConditions_renalDialysisDropDownList').val(health.no).trigger('change');
$('#ContentPlaceHolder1_medicalConditions_tuberculosisDropDownList').val(health.no).trigger('change');
$('#ContentPlaceHolder1_medicalConditions_cancerDropDownList').val(health.no).trigger('change');
$('#ContentPlaceHolder1_medicalConditions_heartDiseaseDropDownList').val(health.no).trigger('change');
$('#ContentPlaceHolder1_medicalConditions_disabilityDropDownList').val(health.no).trigger('change');
$('#ContentPlaceHolder1_medicalConditions_hospitalisationDropDownList').val(health.no).trigger('change');
$('#ContentPlaceHolder1_medicalConditions_residentailCareDropDownList').val(health.no).trigger('change');
$('#ContentPlaceHolder1_medicalConditions_pregnancy_pregnancyStatusDropDownList').val(health.no).trigger('change');
$('#ContentPlaceHolder1_medicalConditions_tbRiskDropDownList').val(health.yes).trigger('change');

//Fill character
$('#ContentPlaceHolder1_character_imprisonment5YearsDropDownList').val(character.no).trigger('change');
$('#ContentPlaceHolder1_character_imprisonment12MonthsDropDownList').val(character.no).trigger('change');
$('#ContentPlaceHolder1_character_deportedDropDownList').val(character.no).trigger('change');
$('#ContentPlaceHolder1_character_chargedDropDownList').val(character.no).trigger('change');
$('#ContentPlaceHolder1_character_convictedDropDownList').val(character.no).trigger('change');
$('#ContentPlaceHolder1_character_underInvestigationDropDownList').val(character.no).trigger('change');
$('#ContentPlaceHolder1_character_excludedDropDownList').val(character.no).trigger('change');
$('#ContentPlaceHolder1_character_removedDropDownList').val(character.no).trigger('change');

//Fill whsSpecific
$('#ContentPlaceHolder1_offshoreDetails_commonWHSQuestions_previousWhsPermitVisaDropDownList').val(whsSpecific.previousWhsPermitVisa).trigger('change');
$('#ContentPlaceHolder1_offshoreDetails_commonWHSQuestions_sufficientFundsHolidayDropDownList').val(whsSpecific.sufficientFundsHoliday).trigger('change');
$('#ContentPlaceHolder1_offshoreDetails_intendedTravelDateDatePicker_DatePicker').val(whsSpecific.intendedTravelDate).trigger('change');
$('#ContentPlaceHolder1_offshoreDetails_beenToNzDropDownList').val(whsSpecific.beenToNz).trigger('change');
$('#ContentPlaceHolder1_offshoreDetails_requirementsQuestions_sufficientFundsOnwardTicketDropDownList').val(whsSpecific.sufficientFundsOnwardTicket).trigger('change');
$('#ContentPlaceHolder1_offshoreDetails_requirementsQuestions_readRequirementsDropDownList').val(whsSpecific.readRequirements).trigger('change');


const validateButton = $('#ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_validateButton');
const nextImageButton = $('#ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_nextImageButton');

// Click Next
nextImageButton.click();
// Button Save available when input last page.
if (!nextImageButton.length) {
    //Click Save
    validateButton.click();
}
// Button Submit available when click Save.
if (!validateButton.length) {
    // Click Confirm Submit
    $('#ContentPlaceHolder1_wizardPageFooter_wizardPageNavigator_submitImageButton').click();
    const submitSuperLink = $('#ContentPlaceHolder1_wizardPageHeader_submitSuperLink');
    if (submitSuperLink.length) {
        submitSuperLink[0].click();
    }
}

//Check Confirm Submit
$('#ContentPlaceHolder1_falseStatementCheckBox').prop('checked', true);
$('#ContentPlaceHolder1_notesCheckBox').prop('checked', true);
$('#ContentPlaceHolder1_circumstancesCheckBox').prop('checked', true);
$('#ContentPlaceHolder1_warrantsCheckBox').prop('checked', true);
$('#ContentPlaceHolder1_informationCheckBox').prop('checked', true);
$('#ContentPlaceHolder1_healthCheckBox').prop('checked', true);
$('#ContentPlaceHolder1_adviceCheckBox').prop('checked', true);
$('#ContentPlaceHolder1_registrationCheckBox').prop('checked', true);
$('#ContentPlaceHolder1_entitlementCheckbox').prop('checked', true);
$('#ContentPlaceHolder1_permitExpiryCheckBox').prop('checked', true);
$('#ContentPlaceHolder1_medicalInsuranceCheckBox').prop('checked', true);

//Click Submit
$('#ContentPlaceHolder1_submitImageButton').click();

//Click Pay Now
const payAnchor = $('#ContentPlaceHolder1_payAnchor');
if (payAnchor.length) {
    payAnchor[0].click();
}
const payAnchor2 = $('#ContentPlaceHolder1_onlinePaymentAnchor2');
if (payAnchor2.length) {
    payAnchor2[0].click();
}

//Fill Payer Name
$('#_ctl0_ContentPlaceHolder1_payerNameTextBox').val('LE HONG QUYEN');

//Click Pay
$('#_ctl0_ContentPlaceHolder1_okButton').click();
