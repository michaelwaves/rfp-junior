from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from bs4 import BeautifulSoup
import pandas as pd
from dotenv import load_dotenv
import os
load_dotenv()
MERX_USERNAME=os.getenv("MERX_USERNAME")
MERX_PASSWORD=os.getenv("MERX_PASSWORD")

def run_scraper(username, password, query, driver):
    wait = WebDriverWait(driver,10)
    try:
        driver.get("https://www.merx.com/")

        login_button = wait.until(
            EC.element_to_be_clickable((By.ID, "header_btnLogin"))
        ).click()

        username_input = wait.until(
           EC.presence_of_element_located((By.ID, "j_username"))
        ).send_keys(username)
        
        driver.find_element(By.ID, "j_password").send_keys(password)
        driver.find_element(By.ID, "loginButton").click()

        main_form_page = wait.until(
            EC.presence_of_element_located((By.ID, "frmSearch"))
        )

        close_login_messages(driver)
        
        search_box = driver.find_element(By.ID, "solicitationSingleBoxSearch")
        search_box.send_keys(query)
        search_box.send_keys(Keys.RETURN)
        time.sleep(3)

        table = wait.until(
            EC.presence_of_element_located((By.ID, "solicitationsTable"))
        )
        table_html = table.get_attribute("outerHTML")

        logout(driver, wait)

        results = parse_solicitations(table_html)
        df = pd.DataFrame(results)
        print(df.head())
        df.to_json("./outputs.json",orient="records")
        
        return df.to_dict(orient="records")
    finally:
       pass


def close_login_messages(driver):
    while True:
        try:
            button = driver.find_element(By.ID, "loginMsgCloseButton")
            button.click()
            time.sleep(2)
        except Exception:
            break

def logout(driver,wait):
    account_icon = wait.until(EC.element_to_be_clickable((By.ID, "myAccountMenuLink"))
        ).click()
    driver.get('https://www.merx.com/public/authentication/logout')

def parse_solicitations(html):
    soup = BeautifulSoup(html, 'html.parser')
    rows = soup.select('#solicitationsTable tbody tr')

    results = []
    for row in rows:
        title_tag = row.select_one('a.solicitationsTitleLink')
        title = title_tag.get_text(strip=True) if title_tag else ''
        link = title_tag['href'] if title_tag and title_tag.has_attr('href') else ''

        buyer = row.select_one('span.buyerIdentification')
        buyer_text = buyer.get_text(strip=True) if buyer else ''

        description = row.select_one('span.solicitationDescription')
        description_text = description.get_text(strip=True) if description else ''

        category = row.select_one('span.searchContentGroupName')
        category_text = category.get_text(strip=True) if category else ''

        closing_date = row.select_one('span.dateValue')
        closing_date_text = closing_date.get_text(strip=True) if closing_date else ''

        region = row.select_one('span.regionValue')
        region_text = region.get_text(strip=True) if region else ''

        publication_date = row.select_one("span.publicationDate")
        publication_date_text = publication_date.get_text(strip=True) if publication_date else ''

        results.append({
            'title': title,
            'link': link,
            'buyer': buyer_text,
            'category': category_text,
            'description': description_text,
            'closing_date': closing_date_text,
            'region': region_text,
            'publication_date':publication_date_text
        })

    return results

if __name__ == "__main__":
    options = webdriver.ChromeOptions()
    options.add_experimental_option("detach", True)
    options.add_argument("window-size=1920,1080") 

    driver = webdriver.Chrome(options=options)
    #email ="augustus.nasiah@msitip"
    run_scraper(MERX_USERNAME,MERX_PASSWORD,"financial advisory",driver)