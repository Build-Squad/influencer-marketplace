from django.db import models
import uuid
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db.models import SET_NULL
from django.conf import settings
from orders.models import Order

class Wallet(models.Model):
  user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='user', on_delete=SET_NULL, null=True)
  coinbase_wallet_address = models.CharField(max_length=42, blank=True, null=True)
  coinbase_wallet_connected = models.BooleanField(default=False)

class Transaction(models.Model):
  buyer = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='buyer_transactions', on_delete=SET_NULL, null=True)
  seller = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='seller_transactions', on_delete=SET_NULL, null=True)
  order = models.ForeignKey(Order, related_name='trnx_order', on_delete=SET_NULL, null=True)
  escrow_address = models.CharField(max_length=42) # Ethereum address for escrow smart contract
  buyer_coinbase_wallet = models.CharField(max_length=42, blank=True, null=True) # Coinbase wallet address of the buyer
  amount = models.DecimalField(max_digits=10, decimal_places=2)
  status = models.CharField(max_length=20, choices=[('Initiated', 'Initiated'), ('Completed', 'Completed'), ('Refunded', 'Refunded')])
  created_at = models.DateTimeField(auto_now_add=True)  

class EscrowContract(models.Model):
  transaction = models.OneToOneField(Transaction, related_name='escrowcontract_transactions', on_delete=SET_NULL, null=True)
  smart_contract_address = models.CharField(max_length=42)  
