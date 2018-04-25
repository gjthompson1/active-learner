# manage.py

import unittest

from flask_script import Manager
from flask_migrate import MigrateCommand

from app import create_app, db
# from project.api.models import Results

app = create_app()
manager = Manager(app)

manager.add_command('db', MigrateCommand)

@manager.command
def recreate_db():
    """Recreates a database."""
    db.drop_all()
    db.create_all()
    db.session.commit()

@manager.command
def seed_db():
    """Seeds the database."""
    db.session.add(User(
        username='michael',
        email='michael@realpython.com',
        password='test'
    ))
    db.session.commit()

if __name__ == '__main__':
    manager.run()
