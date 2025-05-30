from celery import Celery
from scraper import run_scraper
from db import store_results

celery = Celery("tasks", broker = "redis://localhost:6379/0")

@celery.task
def scrape_and_store(username, password, query):
    results = run_scraper(username, password, query)
    store_results(query, results)