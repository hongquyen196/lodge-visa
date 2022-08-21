package com.aus.automation;

public class AusApplication {
	private static final Auto auto = new Auto();

	public static void main(String[] args) {
		auto.run();
		auto.waitBrowser();
	}

}
