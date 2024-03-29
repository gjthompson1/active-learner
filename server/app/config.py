# app/config.py

import os

class BaseConfig:
    """Base configuration"""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(BaseConfig):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    ELASTICSEARCH_HOST = 'elastic:changeme@localhost:9200'
    BCRYPT_LOG_ROUNDS = 4

class StagingConfig(BaseConfig):
    """Staging configuration"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    ELASTICSEARCH_HOST = 'elastic:changeme@localhost:9200'

class ProductionConfig(BaseConfig):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    ELASTICSEARCH_HOST = 'elastic:changeme@localhost:9200'
