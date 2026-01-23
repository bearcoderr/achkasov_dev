"""Скрипт для создания таблиц в БД"""
import sys
from pathlib import Path

# Добавляем корень проекта в PYTHONPATH
root_dir = Path(__file__).parent
sys.path.insert(0, str(root_dir))

from src.infrastructure.db.database import engine, Base



def create_tables():
    """Создать все таблицы"""
    print("🔧 Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

    # Показываем созданные таблицы
    print("\n📊 Created tables:")
    for table in Base.metadata.tables.keys():
        print(f"  - {table}")


def drop_tables():
    """Удалить все таблицы (ОСТОРОЖНО!)"""
    print("⚠️  WARNING: Dropping all tables...")
    response = input("Are you sure? (yes/no): ")
    if response.lower() == 'yes':
        Base.metadata.drop_all(bind=engine)
        print("✅ All tables dropped!")
    else:
        print("❌ Operation cancelled")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--drop":
        drop_tables()
    else:
        create_tables()