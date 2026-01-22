from src.infrastructure.db.database import get_db
from src.infrastructure.db.models import LoginRequest as LoginRequestModel
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def create_admin():
    db = next(get_db())  # Используем get_db() вместо SessionLocal()

    try:
        # Проверяем есть ли уже пользователь
        existing = db.query(LoginRequestModel).filter(
            LoginRequestModel.username == "AlexWeb"
        ).first()

        if existing:
            print(f"User AlexWeb already exists! ID: {existing.id}")
            print(f"Hash: {existing.hashed_password[:50]}...")
            return

        # Создаём нового пользователя
        password = "*VZ6wzw9"  # Замените на свой пароль
        hashed_password = pwd_context.hash(password)

        new_user = LoginRequestModel(
            username="AlexWeb",
            hashed_password=hashed_password
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        print("✅ User created successfully!")
        print(f"Username: AlexWeb")
        print(f"Password: {password}")
        print(f"ID: {new_user.id}")
        print(f"Hash: {hashed_password[:50]}...")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()