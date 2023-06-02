from typing import List
from dataclasses import dataclass
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship, Mapped, Session

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:mysecretpassword@database/mydatabase"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


@dataclass
class UserDB(Base):
    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True, index=True)
    email: str = Column(String, unique=True, index=True)
    username: str = Column(String, unique=True, index=True)
    hashed_password: str = Column(String)
    disabled: str = Column(Boolean)
    properties: Mapped[List["PropertyDB"]] = relationship(
        "PropertyDB", back_populates="user", cascade="all, delete-orphan"
    )


@dataclass
class PropertyDB(Base):
    __tablename__ = "properties"

    id: int = Column(Integer, primary_key=True, index=True)
    name: str = Column(String, index=True, unique=True)
    address: str = Column(String, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id"))
    user: Mapped[List["UserDB"]] = relationship("UserDB", back_populates="properties")


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_user(db: Session, email: str, username: str, hashed_password: str):
    new_user = UserDB(
        email=email, username=username, hashed_password=hashed_password, disabled=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user(db: Session, username: str):
    user = db.query(UserDB).filter_by(username=username).first()
    return user


def read_users(db: Session):
    users = db.query(UserDB.email, UserDB.username).all()
    return users


def create_property(db: Session, user_id: int, name: str, address: str):
    new_prop = PropertyDB(name=name, address=address, user_id=user_id)
    db.add(new_prop)
    db.commit()
    db.refresh(new_prop)
    del new_prop.user
    return new_prop


def delete_property(db: Session, user_id: int, prop_id: int):
    prop = db.query(PropertyDB).filter_by(user_id=user_id, id=prop_id).first()
    if prop:
        db.delete(prop)
        db.commit()
        return True
    return False


def read_properties(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    properties = (
        db.query(PropertyDB.id, PropertyDB.name, PropertyDB.address)
        .filter_by(user_id=user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    properties_dict = [
        {"id": id, "name": name, "address": address} for id, name, address in properties
    ]
    return properties_dict
