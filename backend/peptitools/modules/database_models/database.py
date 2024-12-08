import os
from operator import and_

import pandas as pd
from sqlalchemy import create_engine, func, select, text
from sqlalchemy.orm import DeclarativeBase, Session

from peptitools.modules.database_models import table_models

Peptide = table_models.Peptide


class Base(DeclarativeBase):
    pass


class Database:
    """Database class"""

    def __init__(self):
        # Config connection
        user = os.environ["POSTGRES_USER"]
        db_name = os.environ["POSTGRES_DB"]
        host = os.environ["POSTGRES_HOST"]
        password = os.environ["POSTGRES_PASSWORD"]
        port = os.environ.get("POSTGRES_PORT", 5432)
        self.engine = create_engine(
            f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}"
        )
        self.conn = self.engine.connect()
        # Config max items for selects
        self.session = Session(self.engine, future=True)

    def get_table(self, query):
        return pd.read_sql(text(query), con=self.conn)

    def get_table_query(self, stmt):
        """Applies a select for a previous stmt"""
        return pd.read_sql(stmt, con=self.conn)

    def get_peptipedia_sample(self, limit):
        stmt = (
            select(Peptide.id_peptide, Peptide.sequence)
            .where(Peptide.is_canon)
            .where(func.random() > 0.1)
            .limit(limit)
        )
        return pd.read_sql(stmt, con=self.conn)

    def get_activities(self, stmt):
        """"""
        return
