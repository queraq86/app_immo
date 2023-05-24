from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:mysecretpassword@database/mydatabase"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"


class PropertyDB(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String, index=True)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_user(db, email, username, password):
    new_user = UserDB(email=email, username=username, password=password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def create_property(db, name, address):
    new_prop = PropertyDB(name=name, address=address)
    db.add(new_prop)
    db.commit()
    db.refresh(new_prop)
    return new_prop


def delete_property(db, prop_id):
    prop = db.query(PropertyDB).get(prop_id)
    if prop:
        db.delete(prop)
        db.commit()
        return True
    return False
