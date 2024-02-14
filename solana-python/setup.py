from setuptools import setup, find_packages

from src import xfluencer_solana_python_client_version

setup(
   name='xfluencer_python_client',
   version=xfluencer_solana_python_client_version,
   description='XFluencer Python Solana Program',
   long_description=open('README.md').read(),
   package_dir={"":"src"},
   packages=find_packages(where='src'),
   author="Ruben Colomina",   
)

