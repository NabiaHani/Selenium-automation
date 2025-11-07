## 🧩 Daraz.pk Functional Test Automation

This project automates functional testing of the **Daraz.pk e-commerce website** using **Selenium WebDriver** (can also be adapted to Playwright). It verifies the search, filtering, and product details workflow to ensure the website behaves as expected.

---

## 🚀 Technologies Used

* **Node.js**
* **Mocha** (test framework)
* **Selenium WebDriver**
* **Microsoft Edge / Google Chrome**
* **JavaScript (ES6)**

---

## 📂 Project Setup

### 1️⃣ Clone or create the project

```bash
mkdir selenium-automation
cd selenium-automation
npm init -y
```

### 2️⃣ Install dependencies

For Selenium setup:

```bash
npm install selenium-webdriver mocha
```

If using Chrome:

```bash
npm install chromedriver
```

---

## 🧠 Tasks to Complete

| Step | Task Description                                                                  |
| ---- | --------------------------------------------------------------------------------- |
| 1    | **Setup project** with Selenium or Playwright                                     |
| 2    | **Navigate to Daraz.pk** homepage                                                 |
| 3    | **Search for “electronics”** using the search bar                                 |
| 4    | **Apply brand filter** (e.g., “Samsung”, “Lenovo”, etc.)                          |
| 5    | **Apply price filter** (minimum: 500, maximum: 5000)                              |
| 6    | **Write method** to count products in results and validate that count > 0         |
| 7    | **Open product details** page for the first listed item                           |
| 8    | **Verify if “Free Shipping”** or “Free Delivery” is available on the product page |

---

## ⚙️ How to Run the Test

1. Make sure you have **ChromeDriver** or **Edge WebDriver** installed and configured.
2. Save your test file inside the `tests/` folder (e.g., `tests/daraztest.js`).
3. Run the test using Mocha:

   ```bash
   npm test
   ```

---

## 🧾 Example Folder Structure

```
daraz-automation/
│
├── tests/
│   └── daraztest.js
│
├── package.json
└── README.md
```

---

## 🧩 Expected Flow

1. Browser launches (Edge or Chrome).
2. Navigates to [https://www.daraz.pk](https://www.daraz.pk).
3. Searches for **“electronics”**.
4. Applies brand and price filters.
5. Counts total visible products (> 0).
6. Opens the first product.
7. Verifies if **Free Shipping** label exists.

---

## 💡 Notes

* Increase timeout if elements take time to load (`this.timeout(120000)` in Mocha).
* You can switch browser easily by updating:

  ```js
  new Builder().forBrowser('chrome').build()
  ```

  or

  ```js
  new Builder().forBrowser('MicrosoftEdge').build()
  ```
* Recommended: Run tests on a stable internet connection for Daraz.pk.
