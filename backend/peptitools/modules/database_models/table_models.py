"""ORM Models"""
from sqlalchemy import Column, Float, Boolean, Date
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ARRAY
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Activity(Base):
    """Activity table"""
    __tablename__ = "activity"
    id_activity = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    id_parent = Column(Integer, ForeignKey("activity.id_activity"), nullable=True)
    peptide_has_activity_r = relationship("PeptideHasActivity")
    activity_has_parent_r = relationship("Activity")
    def __repr__(self):
        return f"Activity(id={self.id_activity}, name={self.name})"

class PredictiveModel(Base):
    __tablename__ = "predictive_model"
    id_activity = Column(Integer, ForeignKey("activity.id_activity"), nullable=False, primary_key=True)
    algorithm = Column(String, nullable=False)
    encoder = Column(String, nullable=False)
    def __repr__(self):
        return f"PredictiveModel(id_activity={self.id_activity})"