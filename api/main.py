from typing import Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import (
    get_db,
    create_user,
    get_user,
    read_users,
    create_property,
    delete_property,
    read_properties,
)


SECRET_KEY = "ce0adc1727209d57f5a2750857e2e75a4a3384bf2f5af464776f404b27199bc0"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None


class User(BaseModel):
    id: int
    username: str
    email: Union[str, None] = None
    disabled: Union[bool, None] = None


class Property(BaseModel):
    name: str
    address: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


app = FastAPI()

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if user is None:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return User(
        id=user.id, username=user.username, email=user.email, disabled=user.disabled
    )


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/")
async def read_all_users(db: Session = Depends(get_db)):
    return read_users(db)


@app.get("/")
def read_root():
    return {"Hello": "FastAPI"}


@app.post("/register")
async def register_user(
    username: str = Form(),
    password: str = Form(),
    email: str = Form(),
    db: Session = Depends(get_db),
):
    user = get_user(db, username)
    # Check if the user already exists
    if user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create the user
    hashed_password = get_password_hash(password)
    create_user(db, email, username, hashed_password)

    return {"message": "Registration successful"}


@app.get("/properties")
def read_user_properties(
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return read_properties(db, current_user.id, skip, limit)


@app.post("/properties")
def create_property_endpoint(
    prop: Property,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    new_prop = create_property(db, current_user.id, prop.name, prop.address)
    return new_prop


@app.delete("/properties/{prop_id}")
def delete_property_endpoint(
    prop_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if delete_property(db, current_user.id, prop_id):
        return {"message": "Property deleted successfully"}
    else:
        return {"message": "Property not found"}


@app.get("/profile")
def get_profile(current_user: User = Depends(get_current_active_user)):
    return {
        "username": current_user.username,
        "email": current_user.email,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
