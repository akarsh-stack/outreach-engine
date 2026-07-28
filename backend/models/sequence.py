from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base

class Sequence(Base):
    __tablename__ = "sequences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False)
    step_number = Column(Integer, nullable=False)
    follow_up_days = Column(Integer, nullable=False)
    message_template = Column(Text, nullable=False)
