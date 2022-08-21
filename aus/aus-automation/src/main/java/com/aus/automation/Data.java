package com.aus.automation;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Data {

	Properties prop = new Properties();

	public Data() {
		try (InputStream input = Data.class.getClassLoader().getResourceAsStream("config.properties")) {
			prop = new Properties();
			if (input == null) {
				System.out.println("Sorry, unable to find config.properties");
				return;
			}
			prop.load(input);
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	public String getEnv(String key) {
		return prop.getProperty(key);
	}

}
