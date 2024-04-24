
from sqlalchemy import Column, String
from sqlalchemy.orm import declarative_base
from peptitools.modules.database_models.table_models import *

Base = declarative_base()

class MVPredictedActivities(Base):
    """Materialized view peptide_by_database"""
    __tablename__ = "predicted_activities"
    id_activity = Column(Integer, primary_key=True)
    name = Column(String)
    id_parent = Column(Integer)
    encoder = Column(String)
    algorithm = Column(String)
    def __repr__(self):
        return f"MVPredictedActivities(name={self.name})"
    def definition(self):
        return f"""create materialized view {self.__tablename__} as
            SELECT a.id_activity,
            a.name,
            a.id_parent,
            pm.encoder,
            pm.algorithm
            FROM activity a
                JOIN predictive_model pm ON pm.id_activity = a.id_activity;"""
    def refresh(self):
        return f"refresh materialized view {self.__tablename__};"
