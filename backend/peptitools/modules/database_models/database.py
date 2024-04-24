import os
from sqlalchemy import create_engine, text, select, func
from sqlalchemy.orm import Session
import pandas as pd
class Database:
    """Database class"""
    def __init__(self):
        # Config connection
        user = os.environ["DB_USER"]
        db_name = os.environ["DB_NAME"]
        host = os.environ["DB_HOST"]
        password = os.environ["DB_PASS"]
        port = os.environ["DB_PORT"]
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
        return pd.read_sql(stmt, con = self.conn)
    def get_activities(self, stmt):
        """"""
        return None