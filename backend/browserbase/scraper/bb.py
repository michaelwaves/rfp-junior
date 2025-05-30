from selenium import webdriver
from selenium.webdriver.remote.remote_connection import RemoteConnection
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from browserbase import Browserbase
import os
from dotenv import load_dotenv
from scraper import run_scraper


load_dotenv()

bb = Browserbase(api_key=os.environ["BROWSERBASE_API_KEY"])
MERX_USERNAME =os.getenv("MERX_USERNAME")
MERX_PASSWORD =os.getenv("MERX_PASSWORD")

class CustomRemoteConnection(RemoteConnection):
    _signing_key = None

    def __init__(self, remote_server_addr: str, signing_key: str):
        super().__init__(remote_server_addr)
        self._signing_key = signing_key

    def get_remote_connection_headers(self, parsed_url, keep_alive=False):
        headers = super().get_remote_connection_headers(parsed_url, keep_alive)
        headers.update({'x-bb-signing-key': self._signing_key})
        return headers


def search(username, password, search_term:str):
  session = bb.sessions.create(project_id=os.environ["BROWSERBASE_PROJECT_ID"])
  print(session)
  custom_conn = CustomRemoteConnection(session.selenium_remote_url, session.signing_key)
  options = webdriver.ChromeOptions()
  driver = webdriver.Remote(custom_conn, options=options)
  results = run_scraper(username, password, search_term, driver)
  driver.quit()
  return results

if __name__=="__main__":
    search("username/email","password","finance")