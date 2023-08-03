import logging.config
from logging import getLogger
from pathlib import Path
from typing import Dict

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from backend.config import ScenarioConfig, get_configs
from backend.data_contract import Scenario
from backend.db import load_routes
from backend.odds import compute_odds
from backend.utils import read_json

LOGGER = getLogger(__name__)

fastapi_app = FastAPI()

# Simple way to get singleton
# TODO(Bazire): any simple way to avoid global ?
global APP_CONFIG, SCENARIO_CONFIG, ROUTES
APP_CONFIG, SCENARIO_CONFIG, ROUTES = None, None, None

# This is the way.
# (Needed to handle CORS on error)
app = CORSMiddleware(
    app=fastapi_app,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@fastapi_app.on_event("startup")
def setup_log_config():
    """Setup logging configuration."""
    logging.config.dictConfig(read_json(Path("log_config.json")))
    LOGGER.info("Logging configured")


@fastapi_app.on_event("startup")
def setup_config():
    """Setup configuration singletons."""
    LOGGER.info("Loading config ...")
    global APP_CONFIG, SCENARIO_CONFIG
    APP_CONFIG, SCENARIO_CONFIG = get_configs()
    LOGGER.info("Config loaded.")


@fastapi_app.on_event("startup")
async def setup_routes():
    """Setup routes singleton."""
    LOGGER.info("Loading routes ...")
    global ROUTES
    ROUTES = await load_routes(APP_CONFIG.full_routes_db)
    LOGGER.info("Routes loaded.")


@fastapi_app.get("/routes")
async def list_routes() -> Dict[str, Dict[str, int]]:
    """Debug route to consult the routes.

    Returns:
        Dict[str, Dict[str, int]]: the routes
    """
    return ROUTES


@fastapi_app.get("/config")
async def config() -> ScenarioConfig:
    """Debug route to consult the loaded scenario configuration.

    Returns:
        ScenarioConfig: the scenario configuration
    """
    return SCENARIO_CONFIG


@fastapi_app.post("/odds")
async def odds(scenario: Scenario) -> float:
    """Compute the maximum odds for the given scenario

    Args:
        scenario (Scenario): the scenario

    Returns:
        float: the odds of managing to reach destination
    """
    return compute_odds(
        routes=ROUTES, scenario_config=SCENARIO_CONFIG, scenario=scenario
    )
