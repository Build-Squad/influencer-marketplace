from setuptools import setup, find_packages

from pyxfluencer import xfluencer_solana_python_client_version

setup(
   name='pyxfluencer',
   version=xfluencer_solana_python_client_version,
   description='XFluencer Python Solana Program',
   long_description=open('README.md').read(),
   package_dir={"":"pyxfluencer"},
   packages=find_packages(include=['pyxfluencer/*']),
   author="Ruben Colomina",  
   install_requirements=["anchorpy[cli]"]
   
)

