package com.aus.automation;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.Wait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.github.bonigarcia.wdm.managers.ChromeDriverManager;

public class Auto {

	private static final Logger LOGGER = LoggerFactory.getLogger(Auto.class);
	private static final int fluentWait = 30;
	private static final int fluentWaitPolling = 2;
	private final WebDriver webDriver;
	private final Wait<WebDriver> webDriverWait;
	private final Data data = new Data();

	public Auto() {
		ChromeDriverManager.chromedriver().setup();
		ChromeDriverManager.chromedriver().config().setVersionsPropertiesOnlineFirst(false);
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--window-size=1920,1080");
		options.addArguments("--disable-dev-shm-usage");
		options.addArguments("--no-sandbox");
		webDriver = new ChromeDriver(options);
		webDriver.manage().window().maximize();
		webDriverWait = new FluentWait<>(webDriver)
			.withTimeout(Duration.ofSeconds(fluentWait))
			.pollingEvery(Duration.ofSeconds(fluentWaitPolling))
			.ignoring(NoSuchElementException.class);
	}

	private void open(String url) {
		webDriver.get(url);
	}

	private void login(String username, String password) {
		open("https://online.immi.gov.au/lusc/login");
		input(By.id("username"), username);
		input(By.id("password"), password);
		click(By.xpath("//button[text()=\"Login\"]"));
		click(By.xpath("//button[text()=\"Continue\"]"));
		open("https://online.immi.gov.au/ola/app");
	}

	private void clickEdit() {
		click(By.xpath("//button[text()=\"Edit\"]"));
	}

	private void clickNext() {
		click(By.xpath("//span[text()=\"Next\"]/ancestor::button"));
		String xpath = "//*[contains(text(),\"The system is currently unavailable\")]";
		Boolean invisibility = webDriverWait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(xpath)));
		if (!invisibility) {
			run();
		}
	}

	private void click(By by) {
		try {
			WebElement webElement = webDriverWait.until(ExpectedConditions.visibilityOfElementLocated(by));
			click(webElement);
		} catch (TimeoutException e) {
			LOGGER.error(String.format("Unable to click to [%s].", by.toString()), e);
		}
	}

	private void click(WebElement webElement) {
		try {
			new Actions(webDriver)
				.moveToElement(webElement)
				.click()
				.perform();
		} catch (TimeoutException e) {
			LOGGER.error("Unable to click to element.", e);
		}
	}

	private void input(By by, String value) {
		try {
			WebElement webElement = webDriverWait.until(ExpectedConditions.visibilityOfElementLocated(by));
			input(webElement, value);
		} catch (TimeoutException e) {
			LOGGER.error("Unable to input value to element.", e);
		}
	}

	private void input(WebElement webElement, String value) {
		try {
			webElement.clear();
			new Actions(webDriver)
				.click(webElement)
				.sendKeys(value)
				.perform();
			webDriverWait.until(condition -> webElement.getAttribute("value").equals(value));
		} catch (TimeoutException e) {
			LOGGER.error("Unable to input value to element.", e);
		}
	}

	private boolean isVisibilityOfText(String text) {
		try {
			return webDriverWait.until(driver -> driver.findElement(By.xpath(String.format("//span[text()=\"%s\"]", text)))) != null;
		} catch (Exception e) {
			return false;
		}
	}

	private void sleep(int second) {
		try {
			Thread.sleep(second * 1000L);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}
	}

	private WebElement findElementByText(String tag, String text) {
		return webDriverWait.until(driver -> {
			List<WebElement> elements = driver.findElements(By.xpath(String.format("//%s[text()=\"%s\"]", tag, text)))
				.stream()
				.filter(WebElement::isDisplayed)
				.collect(Collectors.toList());
			return elements.size() > 0 ? elements.get(0) : null;
		});
	}

	private void checkElementByInput(String spanText, String elementValue) {
		try {
			String name = findElementByText("span", spanText)
				.getAttribute("data-wc-for");
			String xpath = String.format("//input[@name=\"%s\"][@value=\"%s\"]", name, elementValue);
			LOGGER.info(String.format("%s[%s]", spanText, xpath));
			WebElement webElement = webDriverWait.until(driver -> driver.findElement(By.xpath(xpath)));
			click(webElement);
		} catch (TimeoutException e) {
			LOGGER.error(String.format("Unable to check to [%s, %s].", spanText, elementValue), e);
		}
	}

	private void chooseOptionBySelect(String selectText, String optionValue) {
		try {
			String id = findElementByText("label", selectText)
				.getAttribute("for");
			LOGGER.info(String.format("%s[%s]", selectText, id));
			WebElement webElement = webDriverWait.until(driver -> driver.findElement(By.id(id)));
			Select select = new Select(webElement);
			webDriverWait.until(condition -> {
				select.selectByValue(optionValue);
				return webElement.getAttribute("value").equals(optionValue);
			});
		} catch (NoSuchElementException | TimeoutException e) {
			LOGGER.error(String.format("Unable to choose to [%s, %s].", selectText, optionValue), e);
		}
	}

	private void checkElementByInputVisibleText(String visibleText) {
		try {
			String xpath = String.format("//label[.//span[text()=\"%s\"]]//input", visibleText);
			LOGGER.info(String.format("[%s]", visibleText));
			List<WebElement> webElements = webDriverWait.until(driver -> {
				List<WebElement> elements = driver.findElements(By.xpath(xpath))
					.stream()
					.filter(WebElement::isDisplayed)
					.collect(Collectors.toList());
				return elements.size() > 0 ? elements : null;
			});
			webElements.stream()
				.filter(element -> !element.isSelected())
				.forEach(this::click);
		} catch (TimeoutException e) {
			LOGGER.error(String.format("Unable to check to [%s].", visibleText), e);
		}
	}


	private void chooseOptionByOptionVisibleText(String visibleText) {
		try {
			String xpath = String.format("//option[text()=\"%s\"]", visibleText);
			LOGGER.info(String.format("[%s]", visibleText));
			List<WebElement> webElements = webDriverWait.until(driver -> {
				List<WebElement> elements = driver.findElements(By.xpath(xpath))
					.stream()
					.filter(WebElement::isDisplayed)
					.collect(Collectors.toList());
				return elements.size() > 0 ? elements : null;
			});
			webElements.get(0).click();
		} catch (NoSuchElementException | TimeoutException e) {
			LOGGER.error(String.format("Unable to choose to [%s].", visibleText), e);
		}
	}

	private void inputValueByLabel(String labelText, String inputValue) {
		try {
			String id = findElementByText("label", labelText)
				.getAttribute("for");
			LOGGER.info(String.format("%s[%s]", labelText, id));
			WebElement webElement = webDriverWait.until(driver -> driver.findElement(By.id(id)));
			input(webElement, inputValue);
		} catch (TimeoutException e) {
			LOGGER.error(String.format("Unable to input to [%s, %s].", labelText, inputValue), e);
		}
	}

	void page1() {
		if (isVisibilityOfText("1/16")) {
			clickNext();
		}
	}

	void page2() {
		if (isVisibilityOfText("2/16")) {
			clickNext();
		}
	}

	void page3() {
		if (isVisibilityOfText("3/16")) {
			clickNext();
		}
	}

	void page4() {
		if (isVisibilityOfText("4/16")) {
			clickNext();
			Boolean invisibility =
				webDriverWait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath("//*[contains(text(),\"An error has occurred\")]")));
			if (!invisibility) {
				sleep(60);
				page4();
			}
		}
	}

	void page5() {
		if (isVisibilityOfText("5/16")) {
			checkElementByInput("Has this applicant previously travelled to Australia or previously applied for a visa?", "2");
			clickNext();
		}
	}

	void page6() {
		if (isVisibilityOfText("6/16")) {
			chooseOptionBySelect("Usual country of residence", data.getEnv("contact_details.residence.country"));
			inputValueByLabel("Office", data.getEnv("contact_details.department_office.office"));
			chooseOptionBySelect("Country", data.getEnv("contact_details.residential_address.country"));
			inputValueByLabel("Address", data.getEnv("contact_details.residential_address.address"));
			inputValueByLabel("Suburb / Town", data.getEnv("contact_details.residential_address.suburb_town"));
			sleep(1);
			chooseOptionBySelect("State or Province", data.getEnv("contact_details.residential_address.state_or_province"));
			inputValueByLabel("Postal code", data.getEnv("contact_details.residential_address.postal_code"));
			checkElementByInput("Is the postal address the same as the residential address?", "1");
			inputValueByLabel("Mobile / Cell phone", data.getEnv("contact_details.contact_telephone_numbers.mobile_phone"));
			clickNext();
		}
	}

	void page7() {
		if (isVisibilityOfText("7/16")) {
			checkElementByInput("Does the applicant authorise another person to receive written correspondence on their behalf?", "NO");
			clickNext();
		}
	}

	void page8() {
	}

	void page9() {
		if (isVisibilityOfText("9/16")) {
			checkElementByInput("Does the applicant meet the education requirements for this visa?", "1");
			List<WebElement> qualificationEdits = webDriver.findElements(By.xpath("//button[text()=\"Edit\"]"));
			if (qualificationEdits.isEmpty()) {
				click(By.xpath("//button[text()=\"Add\"]"));
				chooseOptionBySelect("Qualification", data.getEnv("education_history.qualification"));
				inputValueByLabel("Course name", data.getEnv("education_history.course_name"));
				inputValueByLabel("Institution name", data.getEnv("education_history.institution_name"));
				chooseOptionBySelect("Country of institution", data.getEnv("education_history.country_of_institution"));
				inputValueByLabel("Date from", data.getEnv("education_history.date_from"));
				inputValueByLabel("Date to", data.getEnv("education_history.date_to"));
				chooseOptionBySelect("Status", data.getEnv("education_history.status"));
				click(By.xpath("//button[text()=\"Confirm\"]"));
			}
			clickNext();
		}
	}

	void page10() {
		if (isVisibilityOfText("10/16")) {
			inputValueByLabel("Usual occupation", data.getEnv("employment.usual_occupation"));
			chooseOptionBySelect("Industry type", data.getEnv("employment.intended_employment"));
			clickNext();
		}
	}

	void page11() {
		if (isVisibilityOfText("11/16")) {
			checkElementByInput("Does the applicant hold a current passport from the USA, UK, Canada, New Zealand, or the republic of Ireland?", "2");
			checkElementByInput("Does the applicant have at least functional English language ability?", "1");
			checkElementByInputVisibleText("Completion of an English language proficiency test of at least functional level within the last 12 months");
			chooseOptionBySelect("Name of test", data.getEnv("language.english_test_details.name_of_test"));
			inputValueByLabel("Date of test", data.getEnv("language.english_test_details.date_of_test"));
			inputValueByLabel("Test reference number", data.getEnv("language.english_test_details.test_reference_number"));
			chooseOptionBySelect("Country where test was undertaken", data.getEnv("language.english_test_details.country_where_test_was_undertaken"));
			chooseOptionBySelect("Language ability", data.getEnv("language.english_test_details.language_ability"));
			chooseOptionBySelect("Main language", data.getEnv("language.main_language"));
			clickNext();
		}
	}

	void page12() {
	}

	void page13() {
		if (isVisibilityOfText("13/16")) {
			//Check "No" 9/9 for Health declarations
			checkElementByInputVisibleText("No");
			clickNext();
		}
	}

	void page14() {
		if (isVisibilityOfText("14/16")) {
			//Check "No" 18/18 for Character declarations
			checkElementByInputVisibleText("No");
			clickNext();
		}
	}

	void page15() {
		if (isVisibilityOfText("15/16")) {
			//Check "Yes" 5/5 for Work and Holiday declarations
			checkElementByInputVisibleText("Yes");
			clickNext();
		}
	}

	void page16() {
		if (isVisibilityOfText("16/16")) {
			//Check "Yes" 15/15 for Declarations
			checkElementByInputVisibleText("Yes");
			clickNext();
		}
	}

	void pageAttachment() {
		click(By.xpath("//button[text()=\"​ Expand all\"]"));
		//Notifications
		//
	}

	public void run() {
		try {
			login(data.getEnv("username"), data.getEnv("password"));
			clickEdit();
			page1();
			page2();
			page3();
			page4();
			page5();
			page6();
			page7();
			page8();
			page9();
			page10();
			page11();
			page12();
			page13();
			page14();
			page15();
			page16();
			clickNext();
			pageAttachment();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void waitBrowser() {
		boolean isClosed = false;
		while (!isClosed) {
			try {
				webDriver.getTitle();
				sleep(3);
			} catch (Exception e) {
				isClosed = true;
				webDriver.close();
			}
		}
	}

}
