from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
from database import Base
from sqlalchemy.orm import relationship

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    product_description = Column(Text, nullable=False)
    tone = Column(String, default="professional")
    status = Column(String, default="draft")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="campaigns")
    leads = relationship("Lead", backref="campaign", cascade="all, delete-orphan")
    sequences = relationship("Sequence", backref="campaign", cascade="all, delete-orphan")
