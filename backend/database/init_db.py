from sqlalchemy import text
from backend.database.db import db

MIGRATIONS = [
    "ALTER TABLE driver ADD COLUMN password VARCHAR(200)",
    "ALTER TABLE driver ADD COLUMN experience VARCHAR(50) DEFAULT '0'",
    "ALTER TABLE driver ADD COLUMN is_online BOOLEAN DEFAULT 0",
    "ALTER TABLE trip ADD COLUMN status VARCHAR(50) DEFAULT 'Pending'",
    "ALTER TABLE trip ADD COLUMN otp VARCHAR(10)",
    "ALTER TABLE trip ADD COLUMN created_at VARCHAR(50)",
    "ALTER TABLE car ADD COLUMN driver_id INTEGER",
    "ALTER TABLE trip ADD COLUMN cancel_reason TEXT",
    "ALTER TABLE trip ADD COLUMN cancelled_by VARCHAR(50)",
    "ALTER TABLE car ADD COLUMN current_km FLOAT DEFAULT 0",
    "ALTER TABLE car ADD COLUMN last_service_km FLOAT DEFAULT 0",
    "ALTER TABLE car ADD COLUMN service_interval_km FLOAT DEFAULT 12000",
    "ALTER TABLE trip ADD COLUMN vehicle_category VARCHAR(50) DEFAULT 'mini'",
    "ALTER TABLE trip ADD COLUMN trip_type VARCHAR(50) DEFAULT 'one_way'",
    "ALTER TABLE trip ADD COLUMN drop_time VARCHAR(50)",
]

INDEXES = [
    "CREATE INDEX IF NOT EXISTS ix_user_email ON user(email)",
    "CREATE INDEX IF NOT EXISTS ix_driver_phone ON driver(phone)",
    "CREATE INDEX IF NOT EXISTS ix_driver_email ON driver(email)",
    "CREATE INDEX IF NOT EXISTS ix_car_driver_id ON car(driver_id)",
    "CREATE INDEX IF NOT EXISTS ix_trip_driver_id ON trip(driver_id)",
    "CREATE INDEX IF NOT EXISTS ix_trip_customer_email ON trip(customer_email)",
    "CREATE INDEX IF NOT EXISTS ix_trip_status ON trip(status)",
    "CREATE INDEX IF NOT EXISTS ix_trip_trip_date ON trip(trip_date)",
]

def init_database(app):
    with app.app_context():
        db.create_all()
        with db.engine.connect() as conn:
            for sql in MIGRATIONS:
                try:
                    conn.execute(text(sql))
                    conn.commit()
                except Exception:
                    conn.rollback()
            for sql in INDEXES:
                try:
                    conn.execute(text(sql))
                    conn.commit()
                except Exception:
                    conn.rollback()
