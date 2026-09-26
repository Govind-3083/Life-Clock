# ⏳ Life-Clock

A clock that tells your time remaining to enjoy life.

🌐 [**Visit the site live here**](https://govind-3083.github.io/Life-Clock/)

> ⚠️ **Note:** This tool provides statistical estimates for educational purposes, not medical diagnoses. Consult a doctor for actual health advice.

##  Features

* **Baseline Calculation:** Uses standard global health estimates based on your region and sex.
* **Lifestyle Modifiers:** Adjusts your timeline dynamically based on your daily habits (diet, exercise, sleep, and smoking).
* **Live Countdown:** Converts remaining years into a real-time ticking countdown displayed in days.
* **Lightweight & Fast:** Built entirely with pure HTML, CSS, and Vanilla JavaScript. All calculations happen instantly in the browser.

##  How it Works

The math behind the clock is inspired by large-scale epidemiological data (such as WHO mortality tables and major longevity cohort studies).

1. The app establishes a baseline life expectancy based on your country and assigned sex at birth.
2. It adds or subtracts mathematical modifiers (converted into days) based on the lifestyle questions you answer.
3. It subtracts your current age to generate your final, personalized "Days Left" countdown.

##  Running Locally

If you want to view or modify this project on your local machine, no build tools are required!

1. Clone this repository:
   ```bash
   git clone https://github.com/govind-3083/Life-Clock.git
   ```
2. Navigate into the project folder.
3. Double-click the `index.html` file to open it in any modern web browser.
