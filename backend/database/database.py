from sqlalchemy.engine import Engine
from sqlmodel import create_engine

sqlite_file_name: str = "database.db"
sqlite_url: str = f"sqlite:///{sqlite_file_name}"

connection_args: dict[str, bool] = {"check_same_thread": False}

engine: Engine = create_engine(sqlite_url, connect_args=connection_args, echo=True)